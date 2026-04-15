/* ============================================
   SunRaise Capital — Hero Mesh Gradient v5
   Stripe-inspired organic gradient using Canvas 2D
   with simplex noise FBM. Navy/gold institutional.
   Renders at 1/8 resolution then upscales for perf.
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-mesh-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d', { alpha: false });

  // Off-screen buffer at reduced resolution
  const SCALE = 8; // render at 1/8 then upscale — smooth because gradients
  const offscreen = document.createElement('canvas');
  const octx = offscreen.getContext('2d', { alpha: false });

  let W, H, oW, oH;

  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W;
    canvas.height = H;
    oW = Math.ceil(W / SCALE);
    oH = Math.ceil(H / SCALE);
    offscreen.width = oW;
    offscreen.height = oH;
  }
  resize();
  window.addEventListener('resize', resize);

  /* --- Simplex 2D Noise --- */
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;
  const grad = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  const perm = new Uint8Array(512);
  const pm8 = new Uint8Array(512);
  (function () {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    // Fisher-Yates with seeded-ish random for consistency
    for (let i = 255; i > 0; i--) {
      const j = (i * 7 + 13) & 255;
      const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; pm8[i] = perm[i] & 7; }
  })();

  function snoise(x, y) {
    const s = (x + y) * F2;
    const i = Math.floor(x + s), j = Math.floor(y + s);
    const t = (i + j) * G2;
    const x0 = x - (i - t), y0 = y - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    let n0 = 0, n1 = 0, n2 = 0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 > 0) { t0 *= t0; const g = grad[pm8[ii + perm[jj]]]; n0 = t0 * t0 * (g[0] * x0 + g[1] * y0); }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 > 0) { t1 *= t1; const g = grad[pm8[ii + i1 + perm[jj + j1]]]; n1 = t1 * t1 * (g[0] * x1 + g[1] * y1); }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 > 0) { t2 *= t2; const g = grad[pm8[ii + 1 + perm[jj + 1]]]; n2 = t2 * t2 * (g[0] * x2 + g[1] * y2); }
    return 70 * (n0 + n1 + n2);
  }

  function fbm(x, y) {
    return snoise(x, y) * 0.55 + snoise(x * 2, y * 2) * 0.3 + snoise(x * 4, y * 4) * 0.15;
  }

  /* --- Palette: navy depths with gold veins --- */
  // Pre-baked RGB lookup table for speed (256 entries)
  const LUT = new Uint8Array(256 * 3);
  (function buildLUT() {
    const stops = [
      [0.00, 3, 7, 18],
      [0.20, 6, 12, 28],
      [0.35, 12, 18, 38],
      [0.45, 35, 25, 10],
      [0.55, 120, 76, 12],
      [0.65, 42, 28, 12],
      [0.80, 14, 28, 52],
      [1.00, 3, 7, 18],
    ];
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      // Find segment
      let si = 0;
      for (let s = 0; s < stops.length - 1; s++) {
        if (t >= stops[s][0] && t <= stops[s + 1][0]) { si = s; break; }
      }
      const st = stops[si], en = stops[si + 1];
      const f = (t - st[0]) / (en[0] - st[0]);
      // Smoothstep interpolation
      const sf = f * f * (3 - 2 * f);
      LUT[i * 3] = Math.round(st[1] + (en[1] - st[1]) * sf);
      LUT[i * 3 + 1] = Math.round(st[2] + (en[2] - st[2]) * sf);
      LUT[i * 3 + 2] = Math.round(st[3] + (en[3] - st[3]) * sf);
    }
  })();

  /* --- Render to offscreen buffer --- */
  let time = 0;

  function render() {
    const imgData = octx.createImageData(oW, oH);
    const buf = imgData.data;

    for (let y = 0; y < oH; y++) {
      const ny = y / oH;
      const vy = (ny - 0.5) * 2;
      for (let x = 0; x < oW; x++) {
        const nx = x / oW;

        // Two noise layers offset in time
        const n1 = fbm(nx * 2.8 + time * 0.07, ny * 2.2 + time * 0.05);
        const n2 = fbm(nx * 2 - time * 0.05 + 40, ny * 2 + time * 0.03 + 40);

        // Warp: use noise to displace lookup
        const warp = snoise((nx + n1 * 0.3) * 3, (ny + n2 * 0.3) * 3 + time * 0.04) * 0.5 + 0.5;

        // Combine
        const val = (n1 * 0.4 + n2 * 0.3 + warp * 0.3) * 0.5 + 0.5;

        // Vignette — heavy on edges
        const vx = (nx - 0.5) * 2;
        const dist = Math.sqrt(vx * vx * 0.5 + vy * vy * 0.7);
        const vig = Math.max(0, 1 - dist * 0.75);

        // LUT lookup
        const li = Math.min(255, Math.max(0, Math.round(val * 255))) * 3;
        const idx = (y * oW + x) * 4;
        buf[idx] = Math.round(LUT[li] * vig);
        buf[idx + 1] = Math.round(LUT[li + 1] * vig);
        buf[idx + 2] = Math.round(LUT[li + 2] * vig);
        buf[idx + 3] = 255;
      }
    }

    octx.putImageData(imgData, 0, 0);

    // Upscale to main canvas with smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(offscreen, 0, 0, oW, oH, 0, 0, W, H);
  }

  let animId;
  function animate() {
    time += 0.0025;
    render();
    animId = requestAnimationFrame(animate);
  }

  // Reduced motion: single static frame
  if (prefersReducedMotion) {
    time = 1.0;
    render();
    return;
  }

  // Pause when off-screen
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) animId = requestAnimationFrame(animate);
    } else {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    }
  }, { threshold: 0 });
  observer.observe(canvas);

  animId = requestAnimationFrame(animate);
})();
