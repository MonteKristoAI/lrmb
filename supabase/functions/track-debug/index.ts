// Retired diagnostic. See git commit b39a8d4 (initial findings) and the
// 2026-05-28 evening probe that surfaced TRACK vendor-assignment semantics
// (lrmb track-poll v22 captures vendor_name going forward). 410 Gone stub.
Deno.serve(() => new Response(
  JSON.stringify({ error: "gone", message: "track-debug retired 2026-05-29" }),
  { status: 410, headers: { "Content-Type": "application/json" } },
));
