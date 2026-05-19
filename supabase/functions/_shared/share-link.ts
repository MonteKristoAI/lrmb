// Shared HMAC-SHA256 share-link helpers used by both
// track-overview-token (signs) and track-overview-data (verifies).

const TEXT = new TextEncoder();
const ALG = { name: "HMAC", hash: "SHA-256" } as const;

export interface SharePayload {
  iat: number;
  exp: number;
  v: 1;
  viewer?: string;
}

export class ShareLinkError extends Error {
  constructor(public readonly code:
    | "missing_secret"
    | "missing_token"
    | "bad_format"
    | "bad_signature"
    | "expired"
    | "unsupported_version"
    | "future_iat",
  message: string) {
    super(message);
  }
}

function b64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64UrlDecode(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", TEXT.encode(secret), ALG, false, ["sign", "verify"]);
}

export async function signShareToken(payload: SharePayload, secret: string): Promise<string> {
  if (!secret) throw new ShareLinkError("missing_secret", "Cannot sign without secret");
  const key = await importKey(secret);
  const payloadEnc = b64UrlEncode(TEXT.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", key, TEXT.encode(payloadEnc));
  return `${payloadEnc}.${b64UrlEncode(sig)}`;
}

export async function verifyShareToken(token: string, secret: string, nowSec?: number): Promise<SharePayload> {
  if (!secret) throw new ShareLinkError("missing_secret", "Cannot verify without secret");
  if (!token) throw new ShareLinkError("missing_token", "Token absent");
  const parts = token.split(".");
  if (parts.length !== 2) throw new ShareLinkError("bad_format", "Token must be <payload>.<sig>");

  const [payloadB64, sigB64] = parts;
  const key = await importKey(secret);
  const sig = b64UrlDecode(sigB64);
  const ok = await crypto.subtle.verify("HMAC", key, sig, TEXT.encode(payloadB64));
  if (!ok) throw new ShareLinkError("bad_signature", "Signature mismatch");

  let payload: SharePayload;
  try {
    const json = new TextDecoder().decode(b64UrlDecode(payloadB64));
    payload = JSON.parse(json) as SharePayload;
  } catch {
    throw new ShareLinkError("bad_format", "Payload not valid JSON");
  }

  if (payload.v !== 1) {
    throw new ShareLinkError("unsupported_version", `Token version ${payload.v} not supported`);
  }

  const now = nowSec ?? Math.floor(Date.now() / 1000);
  if (payload.iat > now + 60) {
    throw new ShareLinkError("future_iat", "Token issued in the future");
  }
  if (payload.exp <= now) {
    throw new ShareLinkError("expired", "Token expired");
  }
  return payload;
}
