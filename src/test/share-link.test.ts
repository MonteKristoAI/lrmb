// Vitest suite for the HMAC share-link helpers used by the Operations Overview.
// Imports the module that lives in supabase/functions/_shared so both the edge
// functions and this test bench cover the same implementation.

import { describe, it, expect } from "vitest";
import {
  signShareToken,
  verifyShareToken,
  ShareLinkError,
  type SharePayload,
} from "../../supabase/functions/_shared/share-link";

const SECRET = "test-secret-1234567890";

function makePayload(overrides: Partial<SharePayload> = {}): SharePayload {
  const now = Math.floor(Date.now() / 1000);
  return {
    iat: now,
    exp: now + 3600,
    v: 1,
    ...overrides,
  };
}

describe("signShareToken + verifyShareToken", () => {
  it("round-trips a payload through sign->verify", async () => {
    const payload = makePayload({ viewer: "Tony" });
    const token = await signShareToken(payload, SECRET);
    const verified = await verifyShareToken(token, SECRET);
    expect(verified).toEqual(payload);
  });

  it("produces a token containing the literal '.' separator", async () => {
    const token = await signShareToken(makePayload(), SECRET);
    const parts = token.split(".");
    expect(parts.length).toBe(2);
    expect(parts[0].length).toBeGreaterThan(10);
    expect(parts[1].length).toBeGreaterThan(10);
  });

  it("yields different tokens for different secrets", async () => {
    const payload = makePayload();
    const a = await signShareToken(payload, SECRET);
    const b = await signShareToken(payload, SECRET + "_other");
    expect(a).not.toBe(b);
    expect(a.split(".")[0]).toBe(b.split(".")[0]); // payload portion is identical
    expect(a.split(".")[1]).not.toBe(b.split(".")[1]); // signature differs
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signShareToken(makePayload(), SECRET);
    await expect(verifyShareToken(token, SECRET + "_wrong")).rejects.toMatchObject({
      code: "bad_signature",
    });
  });

  it("rejects a token whose payload was tampered with", async () => {
    const token = await signShareToken(makePayload({ viewer: "Tony" }), SECRET);
    const [, sig] = token.split(".");
    // Forge a payload with viewer='Mallory' but the original signature
    const forgedPayload = JSON.stringify({
      ...makePayload({ viewer: "Mallory" }),
    });
    const forgedPayloadB64 = btoa(forgedPayload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const forgedToken = `${forgedPayloadB64}.${sig}`;
    await expect(verifyShareToken(forgedToken, SECRET)).rejects.toMatchObject({
      code: "bad_signature",
    });
  });

  it("rejects an expired token", async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = await signShareToken({ iat: now - 7200, exp: now - 3600, v: 1 }, SECRET);
    await expect(verifyShareToken(token, SECRET)).rejects.toMatchObject({
      code: "expired",
    });
  });

  it("rejects a token with iat far in the future", async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = await signShareToken({ iat: now + 3600, exp: now + 7200, v: 1 }, SECRET);
    await expect(verifyShareToken(token, SECRET)).rejects.toMatchObject({
      code: "future_iat",
    });
  });

  it("rejects a token without a '.' separator", async () => {
    await expect(verifyShareToken("not-a-real-token", SECRET)).rejects.toMatchObject({
      code: "bad_format",
    });
  });

  it("rejects an empty token", async () => {
    await expect(verifyShareToken("", SECRET)).rejects.toMatchObject({
      code: "missing_token",
    });
  });

  it("rejects a token whose payload isn't JSON", async () => {
    // Build a token with valid signature but non-JSON payload bytes
    const garbage = "not-json-data";
    const payloadB64 = btoa(garbage).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const token = `${payloadB64}.${sigB64}`;
    await expect(verifyShareToken(token, SECRET)).rejects.toMatchObject({
      code: "bad_format",
    });
  });

  it("rejects a token with an unsupported version", async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = await signShareToken({ iat: now, exp: now + 3600, v: 99 } as unknown as SharePayload, SECRET);
    await expect(verifyShareToken(token, SECRET)).rejects.toMatchObject({
      code: "unsupported_version",
    });
  });

  it("refuses to sign or verify with missing secret", async () => {
    await expect(signShareToken(makePayload(), "")).rejects.toMatchObject({
      code: "missing_secret",
    });
    const token = await signShareToken(makePayload(), SECRET);
    await expect(verifyShareToken(token, "")).rejects.toMatchObject({
      code: "missing_secret",
    });
  });

  it("ShareLinkError instances carry the code attribute", async () => {
    try {
      await verifyShareToken("garbage", SECRET);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ShareLinkError);
      expect((err as ShareLinkError).code).toBe("bad_format");
    }
  });
});
