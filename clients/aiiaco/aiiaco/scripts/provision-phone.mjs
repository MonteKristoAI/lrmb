/**
 * AiiACo Phone Provisioning Script
 * ─────────────────────────────────
 * Run this script ONCE after Telnyx Level 2 verification is approved.
 * It will:
 *   1. Search for the best available toll-free number (888 prefix preferred)
 *   2. Purchase the number via Telnyx API
 *   3. Create a SIP trunk credential set on Telnyx
 *   4. Import the number into ElevenLabs via SIP trunk
 *   5. Assign the AiiA Diagnostic Agent to the number
 *   6. Print the final number so you can update PHONE_NUMBER in client/src/const.ts
 *
 * Usage:
 *   node scripts/provision-phone.mjs
 *
 * Prerequisites:
 *   - TELNYX_API_KEY env var set (already in project secrets)
 *   - ELEVENLABS_API_KEY env var set (already in project secrets)
 *   - ELEVENLABS_AGENT_ID env var set (already in project secrets)
 *   - Telnyx account at Level 2 verification (identity verified + company info complete)
 */

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const TELNYX_KEY = process.env.TELNYX_API_KEY;
const EL_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

if (!TELNYX_KEY || !EL_KEY || !AGENT_ID) {
  console.error("❌ Missing required env vars: TELNYX_API_KEY, ELEVENLABS_API_KEY, ELEVENLABS_AGENT_ID");
  process.exit(1);
}

async function telnyxGet(path) {
  const r = await fetch(`https://api.telnyx.com/v2${path}`, {
    headers: { Authorization: `Bearer ${TELNYX_KEY}` },
  });
  return r.json();
}

async function telnyxPost(path, body) {
  const r = await fetch(`https://api.telnyx.com/v2${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TELNYX_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function elPost(path, body) {
  const r = await fetch(`https://api.elevenlabs.io/v1${path}`, {
    method: "POST",
    headers: { "xi-api-key": EL_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function main() {
  console.log("🔍 Step 1: Checking Telnyx verification level...");
  const verif = await telnyxGet("/verifications");
  const level = verif.data?.verification_level;
  console.log(`   Verification level: ${level}`);
  if (level < 2) {
    console.error("❌ Account is still at Level 1. Wait for Telnyx to approve Level 2 verification.");
    console.error("   Check your email for approval notification, or visit portal.telnyx.com/#/account/account-levels");
    process.exit(1);
  }

  console.log("\n🔍 Step 2: Searching for best available toll-free number...");
  // Try 888 prefix first, then any toll-free
  let chosenNumber = null;
  for (const prefix of ["888", "800", "877", "866", "855", "844", "833"]) {
    const search = await telnyxGet(
      `/available_phone_numbers?filter[phone_number_type]=toll-free&filter[phone_number][starts_with]=%2B1${prefix}&filter[features][]=voice&filter[limit]=5`
    );
    if (search.data?.length && !search.data[0].phone_number.includes("-")) {
      chosenNumber = search.data[0].phone_number;
      console.log(`   Found ${prefix} number: ${chosenNumber}`);
      break;
    }
  }
  if (!chosenNumber) {
    // Fall back to any toll-free
    const search = await telnyxGet(
      `/available_phone_numbers?filter[phone_number_type]=toll-free&filter[features][]=voice&filter[limit]=5`
    );
    if (search.data?.length && !search.data[0].phone_number.includes("-")) {
      chosenNumber = search.data[0].phone_number;
      console.log(`   Found toll-free number: ${chosenNumber}`);
    }
  }
  if (!chosenNumber) {
    console.error("❌ No unmasked numbers available. Verification may still be propagating. Try again in 30 minutes.");
    process.exit(1);
  }

  console.log(`\n📞 Step 3: Purchasing ${chosenNumber}...`);
  const order = await telnyxPost("/number_orders", {
    phone_numbers: [{ phone_number: chosenNumber }],
  });
  if (order.errors) {
    console.error("❌ Purchase failed:", JSON.stringify(order.errors));
    process.exit(1);
  }
  console.log(`   ✅ Purchased! Order ID: ${order.data?.id}`);

  // Wait for order to complete
  console.log("   ⏳ Waiting for order to complete...");
  await new Promise((r) => setTimeout(r, 5000));

  console.log("\n🔧 Step 4: Creating SIP trunk credential on Telnyx...");
  const cred = await telnyxPost("/telephony_credentials", {
    connection_name: "AiiA ElevenLabs SIP",
  });
  if (cred.errors) {
    console.error("❌ SIP credential creation failed:", JSON.stringify(cred.errors));
    process.exit(1);
  }
  const sipUsername = cred.data?.sip_username;
  const sipPassword = cred.data?.sip_password;
  const sipDomain = "sip.telnyx.com";
  console.log(`   ✅ SIP credentials created`);
  console.log(`   Username: ${sipUsername}`);
  console.log(`   Domain: ${sipDomain}`);

  console.log("\n🔗 Step 5: Importing number into ElevenLabs via SIP trunk...");
  const elNumber = await elPost("/convai/phone-numbers/create", {
    phone_number: chosenNumber,
    label: "AiiA Diagnostic Line",
    sip_trunk_credentials: {
      username: sipUsername,
      password: sipPassword,
      sip_domain: sipDomain,
    },
  });
  if (elNumber.error || elNumber.detail) {
    console.error("❌ ElevenLabs import failed:", JSON.stringify(elNumber));
    process.exit(1);
  }
  const elNumberId = elNumber.phone_number_id || elNumber.id;
  console.log(`   ✅ Number imported into ElevenLabs. ID: ${elNumberId}`);

  console.log(`\n🤖 Step 6: Assigning AiiA Diagnostic Agent (${AGENT_ID}) to number...`);
  const assign = await elPost(`/convai/phone-numbers/${elNumberId}/assign-agent`, {
    agent_id: AGENT_ID,
  });
  if (assign.error || assign.detail) {
    console.error("❌ Agent assignment failed:", JSON.stringify(assign));
    process.exit(1);
  }
  console.log(`   ✅ Agent assigned!`);

  const displayNumber = chosenNumber.replace("+1", "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");

  console.log("\n" + "=".repeat(60));
  console.log("✅ PROVISIONING COMPLETE");
  console.log("=".repeat(60));
  console.log(`Phone number: ${chosenNumber}`);
  console.log(`Display:      ${displayNumber}`);
  console.log("\n📝 NEXT STEP - Update client/src/const.ts:");
  console.log(`   PHONE_NUMBER = "${chosenNumber}"`);
  console.log(`   PHONE_NUMBER_DISPLAY = "${displayNumber}"`);
  console.log("\nAll Call Now buttons on the site will automatically show the real number.");
  console.log("=".repeat(60));
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
