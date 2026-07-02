// LRMB SLA push fanout edge function (v6, 2026-07-02).
// Reads pending exceptions from sla_push_queue, fetches active
// push_subscriptions, encrypts each payload per RFC 8291 (AES-128-GCM),
// signs a VAPID JWT with ES256 via raw Web Crypto (web-push npm doesn't
// work in Deno because crypto.ECDH is not implemented).
// VAPID keys, subject, and cron shared secret live in public.push_config.
// Callers must send X-Cron-Secret header.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { decode as b64uDecode, encode as b64uEncode } from 'https://deno.land/std@0.208.0/encoding/base64url.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface QueueRow { id: string; dedupe_key: string; severity: string; title: string; subtitle: string | null; entity_link: string | null; dispatch_attempts: number | null; }
interface PushSub { id: string; user_id: string; endpoint: string; p256dh: string; auth_key: string; }

async function loadCfg() {
  const { data } = await supabase.from('push_config').select('key, value')
    .in('key', ['vapid_public','vapid_private','vapid_subject','sla_push_cron_secret']);
  if (!data) return null;
  const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
  if (!map.vapid_public || !map.vapid_private) return null;
  return {
    subject: map.vapid_subject ?? 'mailto:support@lrmb.com',
    publicKey: map.vapid_public,
    privateKey: map.vapid_private,
    cronSecret: map.sla_push_cron_secret ?? null,
  };
}

async function importVapidPrivate(rawPrivB64u: string, publicRawB64u: string): Promise<CryptoKey> {
  const pubRaw = b64uDecode(publicRawB64u);
  if (pubRaw.length !== 65 || pubRaw[0] !== 0x04) throw new Error('bad VAPID public key format');
  const x = pubRaw.slice(1, 33);
  const y = pubRaw.slice(33, 65);
  const d = b64uDecode(rawPrivB64u);
  const jwk: JsonWebKey = { kty: 'EC', crv: 'P-256', x: b64uEncode(x), y: b64uEncode(y), d: b64uEncode(d), ext: true };
  return await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
}

async function vapidJwt(endpoint: string, subject: string, privKey: CryptoKey): Promise<string> {
  const u = new URL(endpoint);
  const aud = `${u.protocol}//${u.host}`;
  const header = { typ: 'JWT', alg: 'ES256' };
  const now = Math.floor(Date.now() / 1000);
  const claims = { aud, exp: now + 12 * 3600, sub: subject };
  const enc = new TextEncoder();
  const headerB = b64uEncode(enc.encode(JSON.stringify(header)));
  const claimsB = b64uEncode(enc.encode(JSON.stringify(claims)));
  const signInput = `${headerB}.${claimsB}`;
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privKey, enc.encode(signInput));
  return `${signInput}.${b64uEncode(new Uint8Array(sig))}`;
}

async function encryptPayload(payload: string, subP256dh: string, subAuth: string): Promise<Uint8Array> {
  const rawUaPublic = b64uDecode(subP256dh);
  const ecdh = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPublicJwk = await crypto.subtle.exportKey('jwk', ecdh.publicKey);
  const asPublicRaw = new Uint8Array([0x04, ...b64uDecode(asPublicJwk.x!), ...b64uDecode(asPublicJwk.y!)]);
  const uaPublicKey = await crypto.subtle.importKey('raw', rawUaPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const sharedSecret = await crypto.subtle.deriveBits({ name: 'ECDH', public: uaPublicKey }, ecdh.privateKey, 256);
  const authSecret = b64uDecode(subAuth);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();

  async function hkdfExtract(secret: Uint8Array, salt: Uint8Array): Promise<Uint8Array> {
    const k = await crypto.subtle.importKey('raw', salt, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return new Uint8Array(await crypto.subtle.sign('HMAC', k, secret));
  }
  async function hkdfExpand(prk: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
    const k = await crypto.subtle.importKey('raw', prk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const out: number[] = []; let t = new Uint8Array(0); let counter = 1;
    while (out.length < length) {
      const buf = new Uint8Array(t.length + info.length + 1);
      buf.set(t, 0); buf.set(info, t.length); buf[t.length + info.length] = counter;
      const mac = new Uint8Array(await crypto.subtle.sign('HMAC', k, buf));
      out.push(...mac); t = mac; counter += 1;
    }
    return new Uint8Array(out.slice(0, length));
  }

  const keyInfo = new Uint8Array([...enc.encode('WebPush: info\0'), ...rawUaPublic, ...asPublicRaw]);
  const prkKey = await hkdfExtract(new Uint8Array(sharedSecret), authSecret);
  const ikm = await hkdfExpand(prkKey, keyInfo, 32);
  const prk = await hkdfExtract(ikm, salt);
  const cek = await hkdfExpand(prk, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdfExpand(prk, enc.encode('Content-Encoding: nonce\0'), 12);

  const cekKey = await crypto.subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt']);
  const plaintext = new Uint8Array([...enc.encode(payload), 0x02]);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce, tagLength: 128 }, cekKey, plaintext));

  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096);
  const header = new Uint8Array(16 + 4 + 1 + asPublicRaw.length);
  header.set(salt, 0); header.set(rs, 16); header[20] = asPublicRaw.length; header.set(asPublicRaw, 21);

  const body = new Uint8Array(header.length + ciphertext.length);
  body.set(header, 0); body.set(ciphertext, header.length);
  return body;
}

Deno.serve(async (req) => {
  const cfg = await loadCfg();
  if (!cfg) return new Response(JSON.stringify({ error: 'VAPID/config not loaded' }), { status: 500 });

  if (cfg.cronSecret) {
    const provided = req.headers.get('x-cron-secret') ?? '';
    if (provided !== cfg.cronSecret) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }

  let vapidPrivKey: CryptoKey;
  try { vapidPrivKey = await importVapidPrivate(cfg.privateKey, cfg.publicKey); }
  catch (e) { return new Response(JSON.stringify({ error: `VAPID import failed: ${String(e)}` }), { status: 500 }); }

  const { data: pending, error: qErr } = await supabase
    .from('sla_push_queue')
    .select('id, dedupe_key, severity, title, subtitle, entity_link, dispatch_attempts')
    .is('dispatched_at', null)
    .lt('dispatch_attempts', 3)
    .order('enqueued_at', { ascending: true })
    .limit(50);
  if (qErr) return new Response(JSON.stringify({ error: qErr.message }), { status: 500 });
  if (!pending || pending.length === 0) return new Response(JSON.stringify({ dispatched: 0 }), { status: 200 });

  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('id, user_id, endpoint, p256dh, auth_key')
    .not('endpoint', 'is', null);

  const results = { dispatched: 0, failed: 0, no_subs: 0, subs_count: subs?.length ?? 0 };
  if (!subs || subs.length === 0) {
    results.no_subs = pending.length;
    for (const row of pending as QueueRow[]) {
      await supabase.from('sla_push_queue')
        .update({ dispatch_attempts: (row.dispatch_attempts ?? 0) + 1, last_error: 'no active push subscriptions' })
        .eq('id', row.id);
    }
    return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  for (const row of pending as QueueRow[]) {
    const payload = JSON.stringify({
      title: `[${row.severity}] ${row.title}`,
      body: row.subtitle ?? '',
      url: row.entity_link ?? '/command-center',
      dedupe_key: row.dedupe_key,
    });
    let successCount = 0; let lastError: string | null = null;
    for (const sub of subs as PushSub[]) {
      try {
        const body = await encryptPayload(payload, sub.p256dh, sub.auth_key);
        const jwt = await vapidJwt(sub.endpoint, cfg.subject, vapidPrivKey);
        const resp = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `vapid t=${jwt}, k=${cfg.publicKey}`,
            'Content-Encoding': 'aes128gcm',
            'Content-Type': 'application/octet-stream',
            'TTL': '3600',
          },
          body,
        });
        if (resp.status >= 200 && resp.status < 300) {
          successCount += 1;
        } else if (resp.status === 404 || resp.status === 410) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
          lastError = `dead endpoint (${resp.status})`;
        } else {
          const text = await resp.text().catch(() => '');
          lastError = `push ${resp.status}: ${text.slice(0, 200)}`;
        }
      } catch (e) { lastError = String(e); }
    }
    const nextAttempts = (row.dispatch_attempts ?? 0) + 1;
    if (successCount > 0) {
      await supabase.from('sla_push_queue')
        .update({ dispatched_at: new Date().toISOString(), dispatch_attempts: nextAttempts, last_error: null })
        .eq('id', row.id);
      results.dispatched += 1;
    } else {
      await supabase.from('sla_push_queue')
        .update({ dispatch_attempts: nextAttempts, last_error: lastError ?? 'unknown' })
        .eq('id', row.id);
      results.failed += 1;
    }
  }
  return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
