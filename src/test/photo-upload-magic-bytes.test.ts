// L10 audit 2026-06-09: photo-upload's detectImageKind() is the
// content-trust gate. Before v3 a malicious client could send
// Content-Type: image/jpeg with HTML/SVG bytes and we'd accept it,
// which let an attacker stash <script> tags in Supabase Storage and
// serve them under our origin if the path was guessed. v3 fixed it by
// hashing the first 12 bytes against the known image magics.
//
// Port of detectImageKind from supabase/functions/photo-upload/index.ts.
// Keep in sync.

import { describe, expect, it } from "vitest";

function detectImageKind(b: Uint8Array): { mime: string; ext: string } | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  if (
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  ) {
    return { mime: "image/png", ext: "png" };
  }
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }
  if (
    b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70
  ) {
    const brand = new TextDecoder().decode(b.slice(8, 12)).toLowerCase();
    if (["heic","heix","heis","heim","mif1","msf1","hevc"].includes(brand)) {
      return { mime: "image/heic", ext: "heic" };
    }
  }
  return null;
}

function bytesOf(hex: string): Uint8Array {
  const clean = hex.replace(/\s+/g, "");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

describe("detectImageKind - accepted image types", () => {
  it("JPEG (FF D8 FF E0 ...)", () => {
    // JFIF header
    const buf = bytesOf("FF D8 FF E0 00 10 4A 46 49 46 00 01");
    expect(detectImageKind(buf)).toEqual({ mime: "image/jpeg", ext: "jpg" });
  });

  it("JPEG (FF D8 FF DB) - EXIF-less variant", () => {
    const buf = bytesOf("FF D8 FF DB 00 84 00 08 06 06 07 06");
    expect(detectImageKind(buf)).toEqual({ mime: "image/jpeg", ext: "jpg" });
  });

  it("PNG (89 50 4E 47 0D 0A 1A 0A)", () => {
    const buf = bytesOf("89 50 4E 47 0D 0A 1A 0A 00 00 00 0D");
    expect(detectImageKind(buf)).toEqual({ mime: "image/png", ext: "png" });
  });

  it("WebP (RIFF????WEBP)", () => {
    const buf = bytesOf("52 49 46 46 24 00 00 00 57 45 42 50");
    expect(detectImageKind(buf)).toEqual({ mime: "image/webp", ext: "webp" });
  });

  it("HEIC (ftyp + heic brand)", () => {
    // 4 bytes anything, then "ftyp", then "heic"
    const buf = bytesOf("00 00 00 20 66 74 79 70 68 65 69 63");
    expect(detectImageKind(buf)).toEqual({ mime: "image/heic", ext: "heic" });
  });

  it("HEIC (ftyp + mif1 brand)", () => {
    const buf = bytesOf("00 00 00 20 66 74 79 70 6D 69 66 31");
    expect(detectImageKind(buf)).toEqual({ mime: "image/heic", ext: "heic" });
  });

  it("HEIC (ftyp + heix brand)", () => {
    const buf = bytesOf("00 00 00 20 66 74 79 70 68 65 69 78");
    expect(detectImageKind(buf)).toEqual({ mime: "image/heic", ext: "heic" });
  });
});

describe("detectImageKind - rejected payloads (security gate)", () => {
  it("HTML masquerading as image/jpeg", () => {
    const buf = new TextEncoder().encode("<!DOCTYPE html><html></html>");
    expect(detectImageKind(buf)).toBeNull();
  });

  it("SVG (XML payload)", () => {
    const buf = new TextEncoder().encode("<svg xmlns='http://www.w3.org/");
    expect(detectImageKind(buf)).toBeNull();
  });

  it("plain script bytes", () => {
    const buf = new TextEncoder().encode("<script>alert(1)</script>");
    expect(detectImageKind(buf)).toBeNull();
  });

  it("PDF (%PDF-)", () => {
    const buf = new TextEncoder().encode("%PDF-1.4 some content here");
    expect(detectImageKind(buf)).toBeNull();
  });

  it("ZIP (PK)", () => {
    const buf = bytesOf("50 4B 03 04 14 00 00 00 08 00 00 00");
    expect(detectImageKind(buf)).toBeNull();
  });

  it("ftyp but UNKNOWN brand (e.g. mp4)", () => {
    // mp4 has ftypisom - not in the allowed brand list.
    const buf = bytesOf("00 00 00 20 66 74 79 70 69 73 6F 6D");
    expect(detectImageKind(buf)).toBeNull();
  });

  it("buffer shorter than 12 bytes", () => {
    expect(detectImageKind(new Uint8Array(0))).toBeNull();
    expect(detectImageKind(bytesOf("FF D8 FF"))).toBeNull();
    expect(detectImageKind(bytesOf("89 50 4E 47 0D 0A 1A"))).toBeNull(); // 7 bytes
  });

  it("near-PNG (one byte wrong) does NOT match", () => {
    // Last magic byte 0x0A flipped to 0x0B.
    const buf = bytesOf("89 50 4E 47 0D 0A 1A 0B 00 00 00 0D");
    expect(detectImageKind(buf)).toBeNull();
  });

  it("RIFF prefix but missing WEBP marker at offset 8", () => {
    // RIFF????AVI_ → audio/video file, not WebP.
    const buf = bytesOf("52 49 46 46 24 00 00 00 41 56 49 20");
    expect(detectImageKind(buf)).toBeNull();
  });

  it("all-zero buffer", () => {
    expect(detectImageKind(new Uint8Array(64))).toBeNull();
  });
});
