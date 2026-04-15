/**
 * Telnyx Verification Poller
 *
 * Polls the Telnyx API every 30 minutes to check if the account has reached
 * verification Level 2 (verified_by_telnyx). When Level 2 is detected, it
 * automatically runs the full provisioning sequence:
 *   1. Search for the best available toll-free number (888/800)
 *   2. Purchase the number
 *   3. Create SIP trunk credentials
 *   4. Import the number into ElevenLabs via SIP trunk
 *   5. Assign the AiA Diagnostic Agent
 *   6. Notify the owner with the new number
 *
 * The poller stops itself after successful provisioning to avoid re-running.
 */

import { notifyOwner } from "./_core/notification";

const TELNYX_API_KEY = process.env.TELNYX_API_KEY ?? "";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY ?? "";
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID ?? "";
const POLL_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

let pollerTimer: ReturnType<typeof setInterval> | null = null;
let provisioningDone = false;

// ─── Telnyx helpers ───────────────────────────────────────────────────────────

async function telnyxGet(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`https://api.telnyx.com/v2${path}`, {
    headers: { Authorization: `Bearer ${TELNYX_API_KEY}`, "Content-Type": "application/json" },
  });
  const json = await res.json() as Record<string, unknown>;
  if (!res.ok) throw new Error(`Telnyx GET ${path} failed: ${res.status} — ${JSON.stringify(json)}`);
  return json;
}

async function telnyxPost(path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(`https://api.telnyx.com/v2${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TELNYX_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json() as Record<string, unknown>;
  if (!res.ok) throw new Error(`Telnyx POST ${path} failed: ${res.status} — ${JSON.stringify(json)}`);
  return json;
}

async function checkVerificationLevel(): Promise<number> {
  try {
    const data = await telnyxGet("/account_balance");
    const account = (data as any)?.data ?? {};
    const level = account?.verified_by_telnyx ?? 0;
    return typeof level === "number" ? level : 0;
  } catch (err) {
    console.error("[TelnyxPoller] Failed to check verification level:", err);
    return 0;
  }
}

async function searchTollFreeNumber(): Promise<string | null> {
  try {
    // Try 888 first, then 800
    for (const prefix of ["888", "800", "877", "866"]) {
      const data = await telnyxGet(`/available_phone_numbers?filter[phone_number][starts_with]=%2B1${prefix}&filter[features][]=voice&filter[limit]=5`);
      const numbers = ((data as any)?.data ?? []) as Array<{ phone_number: string }>;
      const full = numbers.find((n) => n.phone_number && !n.phone_number.includes("-"));
      if (full) return full.phone_number;
    }
    // Fallback: any US number
    const data = await telnyxGet("/available_phone_numbers?filter[country_code]=US&filter[features][]=voice&filter[limit]=5");
    const numbers = ((data as any)?.data ?? []) as Array<{ phone_number: string }>;
    return numbers[0]?.phone_number ?? null;
  } catch (err) {
    console.error("[TelnyxPoller] Number search failed:", err);
    return null;
  }
}

async function purchaseNumber(phoneNumber: string): Promise<string | null> {
  try {
    const data = await telnyxPost("/number_orders", {
      phone_numbers: [{ phone_number: phoneNumber }],
    });
    const ordered = ((data as any)?.data?.phone_numbers ?? []) as Array<{ phone_number: string }>;
    return ordered[0]?.phone_number ?? phoneNumber;
  } catch (err) {
    console.error("[TelnyxPoller] Number purchase failed:", err);
    return null;
  }
}

async function createSipCredentials(): Promise<{ username: string; password: string; sipUri: string } | null> {
  try {
    // Create a credential connection (SIP trunk)
    const connData = await telnyxPost("/credential_connections", {
      name: "AiiACo Diagnostic Agent",
      active: true,
      user_name: `aiia-agent-${Date.now()}`,
      password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
    });
    const conn = (connData as any)?.data ?? {};
    return {
      username: conn.user_name ?? "",
      password: conn.password ?? "",
      sipUri: `sip:${conn.user_name}@sip.telnyx.com`,
    };
  } catch (err) {
    console.error("[TelnyxPoller] SIP credential creation failed:", err);
    return null;
  }
}

async function importIntoElevenLabs(
  phoneNumber: string,
  sipUsername: string,
  sipPassword: string
): Promise<string | null> {
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/convai/phone-numbers/import", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        label: "AiiACo Diagnostic Agent",
        sip_trunk_credentials: {
          username: sipUsername,
          password: sipPassword,
        },
        agent_id: ELEVENLABS_AGENT_ID,
      }),
    });
    const json = await res.json() as Record<string, unknown>;
    if (!res.ok) {
      console.error("[TelnyxPoller] ElevenLabs import failed:", json);
      return null;
    }
    return (json as any)?.phone_number_id ?? (json as any)?.id ?? "imported";
  } catch (err) {
    console.error("[TelnyxPoller] ElevenLabs import error:", err);
    return null;
  }
}

// ─── Main provisioning sequence ───────────────────────────────────────────────

async function runProvisioning(): Promise<void> {
  console.log("[TelnyxPoller] Level 2 verified — starting provisioning sequence…");

  // 1. Search for toll-free number
  const phoneNumber = await searchTollFreeNumber();
  if (!phoneNumber) {
    console.error("[TelnyxPoller] No available number found — aborting");
    await notifyOwner({
      title: "⚠️ Telnyx Provisioning Failed",
      content: "Level 2 verified but no available toll-free number found. Please check Telnyx dashboard.",
    });
    return;
  }
  console.log(`[TelnyxPoller] Found number: ${phoneNumber}`);

  // 2. Purchase the number
  const purchased = await purchaseNumber(phoneNumber);
  if (!purchased) {
    console.error("[TelnyxPoller] Number purchase failed — aborting");
    await notifyOwner({
      title: "⚠️ Telnyx Provisioning Failed",
      content: `Found number ${phoneNumber} but purchase failed. Please purchase manually in Telnyx dashboard.`,
    });
    return;
  }
  console.log(`[TelnyxPoller] Purchased: ${purchased}`);

  // 3. Create SIP credentials
  const sip = await createSipCredentials();
  if (!sip) {
    console.error("[TelnyxPoller] SIP credential creation failed — aborting");
    await notifyOwner({
      title: "⚠️ Telnyx Provisioning Partial",
      content: `Number ${purchased} purchased but SIP credential creation failed. Please create credentials manually.`,
    });
    return;
  }
  console.log("[TelnyxPoller] SIP credentials created");

  // 4. Import into ElevenLabs and assign agent
  const elId = await importIntoElevenLabs(purchased, sip.username, sip.password);
  if (!elId) {
    console.error("[TelnyxPoller] ElevenLabs import failed — provisioning incomplete");
    await notifyOwner({
      title: "⚠️ Telnyx Provisioning Partial",
      content: `Number ${purchased} purchased and SIP credentials created, but ElevenLabs import failed.\n\nSIP Username: ${sip.username}\nSIP URI: ${sip.sipUri}\n\nPlease import manually in ElevenLabs → Conversational AI → Phone Numbers.`,
    });
    return;
  }

  // 5. Format number for display
  const digits = purchased.replace(/\D/g, "");
  const display = digits.length === 11
    ? `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
    : purchased;

  console.log(`[TelnyxPoller] ✅ Provisioning complete! Number: ${display}`);

  // 6. Notify owner
  await notifyOwner({
    title: `✅ AI Phone Number Live: ${display}`,
    content: [
      `Phone number ${display} has been automatically provisioned and assigned to the AiA Diagnostic Agent.`,
      ``,
      `Next step: Update the site CTAs by setting PHONE_NUMBER=${purchased} and PHONE_NUMBER_DISPLAY=${display} in client/src/const.ts`,
      ``,
      `ElevenLabs Phone Number ID: ${elId}`,
      `Telnyx Number: ${purchased}`,
    ].join("\n"),
  });

  provisioningDone = true;
  stopPoller();
  console.log("[TelnyxPoller] Poller stopped after successful provisioning.");
}

// ─── Poller lifecycle ─────────────────────────────────────────────────────────

async function pollOnce(): Promise<void> {
  if (provisioningDone) return;
  if (!TELNYX_API_KEY) return;

  const level = await checkVerificationLevel();
  console.log(`[TelnyxPoller] Verification level: ${level}`);

  if (level >= 2) {
    await runProvisioning();
  }
}

export function startTelnyxPoller(): void {
  // Provisioning complete — +18884960152 is live on ElevenLabs. Poller disabled.
  console.log("[TelnyxPoller] Number +18884960152 already provisioned and live. Poller disabled.");
  provisioningDone = true;
}

export function stopPoller(): void {
  if (pollerTimer !== null) {
    clearInterval(pollerTimer);
    pollerTimer = null;
  }
}
