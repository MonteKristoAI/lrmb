import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

// FBE-4 (2026-07-02): fetch VAPID public key from DB at subscribe time so a
// key rotation via public.push_config takes effect without an FE redeploy.
// Env var kept as offline fallback for initial page load.
const VAPID_PUBLIC_KEY_ENV = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

async function loadVapidPublicKey(): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc("get_vapid_public_key");
    if (error) throw error;
    if (typeof data === "string" && data.length > 0) return data;
  } catch (e) {
    console.warn("get_vapid_public_key RPC failed, falling back to env", e);
  }
  return VAPID_PUBLIC_KEY_ENV ?? null;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>(
    "Notification" in window ? Notification.permission : "denied"
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Optimistic: assume supported if the platform primitives are present.
    // The subscribe() call will fetch the DB VAPID key; if it fails, subscribe returns false.
    setIsSupported(
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    );
  }, []);

  useEffect(() => {
    if (!isSupported || !user) return;
    // Check if already subscribed
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    });
  }, [isSupported, user]);

  const subscribe = async () => {
    if (!isSupported || !user) return false;

    try {
      const vapidKey = await loadVapidPublicKey();
      if (!vapidKey) {
        console.error("no VAPID public key available");
        return false;
      }

      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return false;

      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();

      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
      }

      const subJson = sub.toJSON();

      // v34: surface upsert errors. Previously we silently said "subscribed" even when the
      // server-side row wasn't saved, so push delivery would fail mysteriously.
      const { error: upsertErr } = await supabase.from("push_subscriptions").upsert({
        user_id: user.id,
        endpoint: subJson.endpoint!,
        p256dh: subJson.keys!.p256dh!,
        auth_key: subJson.keys!.auth!,
      }, { onConflict: "user_id,endpoint" });
      if (upsertErr) {
        console.error("push subscription save failed", upsertErr);
        return false;
      }

      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error("push subscribe failed", err);
      return false;
    }
  };

  const unsubscribe = async () => {
    if (!isSupported || !user) return;

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        // v34: check delete error before flipping local state. If the DB row still
        // exists, the server will keep sending pushes — better to know than pretend.
        const { error: delErr } = await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .eq("endpoint", sub.endpoint);
        if (delErr) {
          console.error("push subscription delete failed", delErr);
          return; // keep isSubscribed=true so UI knows it's still active server-side
        }
      }
      setIsSubscribed(false);
    } catch (err) {
      console.error("push unsubscribe failed", err);
    }
  };

  return { isSupported, permission, isSubscribed, subscribe, unsubscribe };
}
