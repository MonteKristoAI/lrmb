// L10 wave 9 (2026-06-10): client-side photo preparation.
//
// Why: Maria-the-HK-lead in Miami uploads completion photos from her iPhone
// on 3G/EDGE. iPhone HEIC photos are 3-12 MB. At 3G's ~500 kbps that's
// 30-90 seconds blocking the "Complete" tap. Plus the raw file carries
// EXIF GPS coordinates + camera serial + owner name — a privacy hazard
// every time a signed URL gets screenshotted.
//
// Fix: pipe the file through a canvas at max 1920px wide. Re-encode as
// JPEG q=0.8. This:
//   1. Cuts a 10 MB HEIC down to ~300-600 KB (50× faster upload)
//   2. Strips EXIF entirely (canvas drawImage never carries metadata)
//   3. Normalizes HEIC → JPEG so older browsers / agency viewers can
//      always render the result
//
// Edge cases:
//   - File already < 200 KB: skip resize, just strip via canvas anyway
//     (still cheap, still drops EXIF).
//   - PNG / WebP: same path, re-encoded as JPEG (lossless screenshots
//     of plumbing damage rarely need PNG precision).
//   - HEIC on a browser that can't decode it (older Chrome on Android):
//     bail out, return the original file. photo-upload edge fn validates
//     magic bytes server-side and will reject if truly broken.

const MAX_DIMENSION_PX = 1920;
const JPEG_QUALITY = 0.8;

export class PhotoPrepError extends Error {
  constructor(public readonly code: string, public readonly originalType: string) {
    super(`photo-prep ${code} (${originalType})`);
    this.name = "PhotoPrepError";
  }
}

export interface PreparedPhoto {
  file: File;
  originalSize: number;
  finalSize: number;
  originalType: string;
  finalType: string;
  resized: boolean;
}

export async function preparePhotoForUpload(input: File): Promise<PreparedPhoto> {
  const originalSize = input.size;
  const originalType = input.type || "image/jpeg";

  // Try to decode via Image. HEIC may fail on some browsers — fall back.
  let bitmap: ImageBitmap | HTMLImageElement;
  try {
    if (typeof createImageBitmap === "function") {
      bitmap = await createImageBitmap(input);
    } else {
      bitmap = await loadViaImage(input);
    }
  } catch {
    // L10 wave 17 (2026-06-10): decode failure now THROWS instead of
    // silently returning the raw file. The raw HEIC carries EXIF GPS,
    // device serial, owner name — exactly what the canvas re-encode was
    // supposed to strip. The wider promise was "EXIF stripped"; that
    // promise must not silently degrade.
    // Caller catches and shows toast: "Could not process photo.
    // Try a JPEG/PNG instead."
    throw new PhotoPrepError("decode_failed", originalType);
  }

  const srcW = "width" in bitmap ? bitmap.width : (bitmap as HTMLImageElement).naturalWidth;
  const srcH = "height" in bitmap ? bitmap.height : (bitmap as HTMLImageElement).naturalHeight;
  if (!srcW || !srcH) {
    return { file: input, originalSize, finalSize: input.size, originalType, finalType: originalType, resized: false };
  }

  const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(srcW, srcH));
  const dstW = Math.round(srcW * scale);
  const dstH = Math.round(srcH * scale);

  const canvas = document.createElement("canvas");
  canvas.width = dstW;
  canvas.height = dstH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // No canvas context — environment is broken. Same logic as decode
    // fail: don't silently return raw file with EXIF intact.
    throw new PhotoPrepError("canvas_context_unavailable", originalType);
  }

  // White background prevents transparent PNGs becoming black JPEGs.
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, dstW, dstH);
  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, dstW, dstH);
  if ("close" in bitmap) (bitmap as ImageBitmap).close();

  const blob: Blob | null = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY);
  });
  if (!blob) {
    throw new PhotoPrepError("encode_failed", originalType);
  }

  const baseName = input.name.replace(/\.[^.]+$/, "");
  const outName = `${baseName || "photo"}.jpg`;
  const out = new File([blob], outName, { type: "image/jpeg", lastModified: Date.now() });

  return {
    file: out,
    originalSize,
    finalSize: out.size,
    originalType,
    finalType: "image/jpeg",
    resized: scale < 1 || originalType !== "image/jpeg",
  };
}

function loadViaImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image decode failed"));
    };
    img.src = url;
  });
}
