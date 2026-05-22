// Shared HMAC-SHA256 share-link helpers used by both
// track-overview-token (signs) and track-overview-data + track-detail (verify).
//
// v1 tokens (legacy): { iat, exp, v:1, viewer? } - implicit audience = full overview
// v2 tokens (QA P1):  { iat, exp, v:2, viewer?, aud, jti } - explicit scope + revokable

const TEXT = new TextEncoder();
const ALG = { name: "HMAC", hash: "SHA-256" } as const;

export type ShareAudience = "ops_overview" | "ops_detail" | "ops_full";

export interface SharePayloadV1 {
  iat: number;
  exp: number;
  v: 1;
  viewer?: string;
}

export interface SharePayloadV2 {
  iat: number;
  exp: number;
  v: 2;
  viewer?: string;
  aud: ShareAudience;
  jti: string;
}

export type SharePayload = SharePayloadV1 | SharePayloadV2;

export class ShareLinkError extends Error {
  constructor(public readonly code:
    | "missing_secret"
    | "missing_token"
    | "bad_format"
    | "bad_signature"
    | "expired"
    | "unsupported_version"
    | "future_iat"
    | "wrong_audience"
    | "revoked",
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

interface VerifyOptions {
  /**
   * Required audience for v2 tokens. v1 tokens are accepted for any audience
   * to preserve existing share links until they expire naturally.
   */
  requiredAudience?: ShareAudience;
  /**
   * Optional revocation predicate. Returns true if the jti has been revoked.
   * Pass a function backed by the revoked_share_tokens table.
   */
  isRevoked?: (jti: string) => Promise<boolean>;
  /** Overrides Date.now() — for testing. */
  nowSec?: number;
}

export async function verifyShareToken(
  token: string,
  secret: string,
  opts: VerifyOptions = {},
): Promise<SharePayload> {
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

  if (payload.v !== 1 && payload.v !== 2) {
    throw new ShareLinkError("unsupported_version", `Token version ${(payload as { v: unknown }).v} not supported`);
  }

  const now = opts.nowSec ?? Math.floor(Date.now() / 1000);
  if (payload.iat > now + 60) {
    throw new ShareLinkError("future_iat", "Token issued in the future");
  }
  if (payload.exp <= now) {
    throw new ShareLinkError("expired", "Token expired");
  }

  if (payload.v === 2) {
    if (!payload.aud || !payload.jti) {
      throw new ShareLinkError("bad_format", "v2 token missing aud/jti");
    }
    if (opts.requiredAudience && payload.aud !== opts.requiredAudience && payload.aud !== "ops_full") {
      throw new ShareLinkError("wrong_audience", `Token audience ${payload.aud} != ${opts.requiredAudience}`);
    }
    if (opts.isRevoked && (await opts.isRevoked(payload.jti))) {
      throw new ShareLinkError("revoked", "Token has been revoked");
    }
  }
  // v1 tokens: implicitly accepted for any audience (legacy compatibility).
  // They will all expire by 2026-07-19 (Tony's longest-lived token).

  return payload;
}
