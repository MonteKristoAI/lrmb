/**
 * Push the latest AiiA agent prompt + first message to ElevenLabs.
 * Reads the prompt from server/aiAgent.ts (single source of truth).
 * 
 * Usage: node --import tsx scripts/push-agent-config.mjs
 * Or:    npx tsx scripts/push-agent-config.mjs
 */
import 'dotenv/config';

const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const API_KEY = process.env.ELEVENLABS_API_KEY;
const EL_BASE = "https://api.elevenlabs.io/v1";

if (!API_KEY || !AGENT_ID) {
  console.error("Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID");
  process.exit(1);
}

// Dynamically import the prompt from the codebase source of truth
let SYSTEM_PROMPT, FIRST_MESSAGE;
try {
  const mod = await import("../server/aiAgent.ts");
  SYSTEM_PROMPT = mod.AGENT_SYSTEM_PROMPT;
  FIRST_MESSAGE = mod.AGENT_CONFIG.firstMessage;
} catch (e) {
  console.error("Failed to import aiAgent.ts - make sure tsx is available:", e.message);
  process.exit(1);
}

async function main() {
  console.log(`\n📡 Pushing config to agent: ${AGENT_ID}`);
  console.log(`   Prompt length: ${SYSTEM_PROMPT.length} chars`);
  console.log(`   First message: "${FIRST_MESSAGE.slice(0, 80)}..."`);

  // Update prompt + first message
  console.log("\n[1/1] Updating prompt and first message...");
  const res = await fetch(`${EL_BASE}/convai/agents/${AGENT_ID}`, {
    method: "PATCH",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation_config: {
        agent: {
          prompt: { prompt: SYSTEM_PROMPT },
          first_message: FIRST_MESSAGE,
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ FAILED to update prompt: ${res.status} - ${err}`);
    process.exit(1);
  }
  console.log("  ✓ Prompt and first message updated");

  // Verify
  console.log("\n[Verify] Fetching live agent config...");
  const verifyRes = await fetch(`${EL_BASE}/convai/agents/${AGENT_ID}`, {
    headers: { "xi-api-key": API_KEY },
  });
  const data = await verifyRes.json();
  
  const livePrompt = data.conversation_config?.agent?.prompt?.prompt ?? "";
  const liveFirst = data.conversation_config?.agent?.first_message ?? "";
  
  console.log(`  Live prompt: ${livePrompt.length} chars`);
  console.log(`  First message: "${liveFirst.substring(0, 80)}..."`);
  console.log(`  Contains "MANDATORY": ${livePrompt.includes("MANDATORY")}`);
  console.log(`  Contains "Deep Company Knowledge": ${livePrompt.includes("Deep Company Knowledge")}`);
  console.log(`  Contains "Agent Program": ${livePrompt.includes("Agent Program")}`);
  console.log(`  Contains "Operator Program": ${livePrompt.includes("Operator Program")}`);
  console.log(`  Contains "Corporate Program": ${livePrompt.includes("Corporate Program")}`);
  
  if (livePrompt.includes("MANDATORY") && livePrompt.includes("Deep Company Knowledge")) {
    console.log("\n✅ Agent config pushed and verified successfully!");
  } else {
    console.log("\n⚠️  Prompt may not have been fully applied - check manually");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
