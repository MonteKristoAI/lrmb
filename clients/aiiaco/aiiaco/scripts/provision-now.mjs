/**
 * Direct provisioning - number already purchased (+18884960152).
 * Continues from Step 3: create SIP credentials and import into ElevenLabs.
 */
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const TELNYX_KEY = process.env.TELNYX_API_KEY;
const EL_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

const PURCHASED_NUMBER = "+18884960152"; // already purchased

async function telnyxGet(path) {
  const r = await fetch(`https://api.telnyx.com/v2${path}`, {
    headers: { Authorization: `Bearer ${TELNYX_KEY}` },
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Telnyx GET ${path}: ${r.status} ${JSON.stringify(j).slice(0,300)}`);
  return j;
}

async function telnyxPost(path, body) {
  const r = await fetch(`https://api.telnyx.com/v2${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TELNYX_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Telnyx POST ${path}: ${r.status} ${JSON.stringify(j).slice(0,400)}`);
  return j;
}

async function elPost(path, body) {
  const r = await fetch(`https://api.elevenlabs.io/v1${path}`, {
    method: "POST",
    headers: { "xi-api-key": EL_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`ElevenLabs POST ${path}: ${r.status} ${JSON.stringify(j).slice(0,400)}`);
  return j;
}

// Step 3: Create a credential connection (SIP trunk) on Telnyx
console.log("Step 3: Creating SIP credential connection on Telnyx...");
const conn = await telnyxPost("/credential_connections", {
  name: "AiiA ElevenLabs SIP Trunk",
  active: true,
});
const connId = conn?.data?.id;
const sipUsername = conn?.data?.user_name;
const sipPassword = conn?.data?.password;
console.log(`  Connection ID: ${connId}`);
console.log(`  SIP Username: ${sipUsername}`);

if (!sipUsername || !sipPassword) {
  console.log("Full connection response:", JSON.stringify(conn?.data ?? conn, null, 2));
  process.exit(1);
}

// Step 4: Import into ElevenLabs
console.log("\nStep 4: Importing into ElevenLabs...");
let elNum;
try {
  elNum = await elPost("/convai/phone-numbers/create", {
    phone_number: PURCHASED_NUMBER,
    label: "AiiA Diagnostic Line",
    sip_trunk_credentials: {
      username: sipUsername,
      password: sipPassword,
      sip_domain: "sip.telnyx.com",
    },
  });
} catch (e) {
  // Try the import endpoint as fallback
  console.log("  create failed, trying import endpoint...");
  elNum = await elPost("/convai/phone-numbers/import", {
    phone_number: PURCHASED_NUMBER,
    label: "AiiA Diagnostic Line",
    sip_trunk_credentials: {
      username: sipUsername,
      password: sipPassword,
    },
    agent_id: AGENT_ID,
  });
}
const elNumId = elNum?.phone_number_id ?? elNum?.id;
console.log(`  ElevenLabs Phone Number ID: ${elNumId}`);

// Step 5: Assign agent (if not already assigned via import)
if (elNumId && !elNum?.agent_id) {
  console.log(`\nStep 5: Assigning agent ${AGENT_ID}...`);
  try {
    await elPost(`/convai/phone-numbers/${elNumId}/assign-agent`, {
      agent_id: AGENT_ID,
    });
    console.log("  Agent assigned!");
  } catch (e) {
    console.log("  Agent assignment:", e.message);
  }
} else {
  console.log("\nStep 5: Agent already assigned via import.");
}

// Format display
const digits = PURCHASED_NUMBER.replace(/\D/g, "");
const display = digits.length === 11
  ? `+1 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`
  : PURCHASED_NUMBER;

console.log("\n" + "=".repeat(55));
console.log("PROVISIONING COMPLETE");
console.log("=".repeat(55));
console.log(`Phone: ${display}`);
console.log(`Raw:   ${PURCHASED_NUMBER}`);
console.log("\nUpdate client/src/const.ts:");
console.log(`  PHONE_NUMBER = "${PURCHASED_NUMBER}"`);
console.log(`  PHONE_NUMBER_DISPLAY = "${display}"`);
console.log("=".repeat(55));
