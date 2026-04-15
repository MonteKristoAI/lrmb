/**
 * Set up ElevenLabs post-call webhook:
 * 1. Create a workspace webhook with our URL
 * 2. Assign it as the post-call webhook in convai settings
 * 
 * Usage: node scripts/setup-webhook.mjs
 */

const API_KEY = process.env.ELEVENLABS_API_KEY;
const EL_BASE = "https://api.elevenlabs.io/v1";
const WEBHOOK_URL = "https://aiiaco.com/api/webhooks/elevenlabs";

async function main() {
  // Step 0: Check if there's already a webhook configured
  console.log("[0] Checking existing webhooks...");
  const listRes = await fetch(`${EL_BASE}/workspace/webhooks`, {
    headers: { "xi-api-key": API_KEY }
  });
  if (listRes.ok) {
    const existing = await listRes.json();
    console.log("  Existing webhooks:", JSON.stringify(existing, null, 2));
  }

  // Also check current convai settings
  const settingsRes = await fetch(`${EL_BASE}/convai/settings`, {
    headers: { "xi-api-key": API_KEY }
  });
  if (settingsRes.ok) {
    const settings = await settingsRes.json();
    console.log("  Current convai webhook settings:", JSON.stringify(settings.webhooks, null, 2));
  }

  // Step 1: Create workspace webhook
  console.log("\n[1] Creating workspace webhook...");
  console.log(`  URL: ${WEBHOOK_URL}`);
  
  const createRes = await fetch(`${EL_BASE}/workspace/webhooks`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      settings: {
        auth_type: "hmac",
        name: "AiiACo Post-Call Transcription",
        webhook_url: WEBHOOK_URL,
      }
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error(`  FAILED: ${createRes.status} - ${err}`);
    
    // If webhook already exists, try to find it and use it
    if (createRes.status === 422 || createRes.status === 409) {
      console.log("  Webhook may already exist. Checking list...");
      const listRes2 = await fetch(`${EL_BASE}/workspace/webhooks`, {
        headers: { "xi-api-key": API_KEY }
      });
      if (listRes2.ok) {
        const webhooks = await listRes2.json();
        console.log("  Available webhooks:", JSON.stringify(webhooks, null, 2));
        
        // Try to find one matching our URL
        const items = webhooks.webhooks || webhooks || [];
        const match = (Array.isArray(items) ? items : []).find(w => 
          w.webhook_url === WEBHOOK_URL || w.settings?.webhook_url === WEBHOOK_URL
        );
        if (match) {
          console.log(`  Found existing webhook: ${match.webhook_id}`);
          await assignWebhook(match.webhook_id);
          return;
        }
      }
    }
    process.exit(1);
  }

  const created = await createRes.json();
  console.log(`  ✓ Created webhook: ${created.webhook_id}`);
  if (created.webhook_secret) {
    console.log(`  ✓ Webhook secret: ${created.webhook_secret}`);
    console.log("  ⚠️  SAVE THIS SECRET - you'll need it for HMAC verification");
  }

  // Step 2: Assign webhook to convai settings
  await assignWebhook(created.webhook_id);
}

async function assignWebhook(webhookId) {
  console.log(`\n[2] Assigning webhook ${webhookId} to convai settings...`);
  
  const patchRes = await fetch(`${EL_BASE}/convai/settings`, {
    method: "PATCH",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      webhooks: {
        post_call_webhook_id: webhookId,
        events: ["transcript"],
      }
    }),
  });

  if (!patchRes.ok) {
    const err = await patchRes.text();
    console.error(`  FAILED: ${patchRes.status} - ${err}`);
    process.exit(1);
  }

  const result = await patchRes.json();
  console.log("  ✓ Convai settings updated");
  console.log("  Webhook config:", JSON.stringify(result.webhooks, null, 2));

  // Step 3: Verify
  console.log("\n[3] Verifying...");
  const verifyRes = await fetch(`${EL_BASE}/convai/settings`, {
    headers: { "xi-api-key": API_KEY }
  });
  const verified = await verifyRes.json();
  console.log("  Final webhook settings:", JSON.stringify(verified.webhooks, null, 2));
  
  if (verified.webhooks?.post_call_webhook_id === webhookId) {
    console.log("\n✅ Webhook fully configured and verified");
  } else {
    console.log("\n⚠️  Verification mismatch - check manually");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
