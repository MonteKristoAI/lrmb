/**
 * Push full agent update to ElevenLabs:
 * - Updated prompt (AiA rename, relaxed intake, corrected budget)
 * - Updated first message
 * - Turn eagerness → balanced
 */

const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY || !AGENT_ID) {
  console.error("Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID");
  process.exit(1);
}

// Import the updated prompt from the server module
// We read it directly from the file to avoid TS compilation
import { readFileSync } from "fs";
const agentFile = readFileSync("./server/aiAgent.ts", "utf-8");

// Extract AGENT_SYSTEM_PROMPT
const promptMatch = agentFile.match(/export const AGENT_SYSTEM_PROMPT = `([\s\S]*?)`;/);
if (!promptMatch) {
  console.error("Could not extract AGENT_SYSTEM_PROMPT from aiAgent.ts");
  process.exit(1);
}
const systemPrompt = promptMatch[1];

// Extract firstMessage
const firstMsgMatch = agentFile.match(/firstMessage:\s*\n?\s*"([^"]+)"/);
if (!firstMsgMatch) {
  console.error("Could not extract firstMessage from aiAgent.ts");
  process.exit(1);
}
const firstMessage = firstMsgMatch[1];

console.log("=== Update Summary ===");
console.log(`  Prompt length: ${systemPrompt.length} chars`);
console.log(`  First message: "${firstMessage}"`);
console.log(`  Turn eagerness: balanced`);

// Get current config for comparison
const getRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`, {
  headers: { "xi-api-key": API_KEY },
});
const current = await getRes.json();
console.log(`\n  Current prompt length: ${(current.conversation_config?.agent?.prompt?.prompt || "").length} chars`);
console.log(`  Current first message: "${(current.conversation_config?.agent?.first_message || "").substring(0, 80)}..."`);
console.log(`  Current turn eagerness: ${current.conversation_config?.turn?.turn_eagerness || "not set"}`);

// Push update
console.log("\nPushing update...");
const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`, {
  method: "PATCH",
  headers: {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "AiA Diagnostic Agent",
    conversation_config: {
      agent: {
        prompt: { prompt: systemPrompt },
        first_message: firstMessage,
      },
      turn: {
        turn_eagerness: "normal",
      },
    },
  }),
});

if (!res.ok) {
  const err = await res.text();
  console.error("Push FAILED:", res.status, err);
  process.exit(1);
}

console.log("Push successful! Status:", res.status);

// Verify
const verifyRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`, {
  headers: { "xi-api-key": API_KEY },
});
const verified = await verifyRes.json();
const vPrompt = verified.conversation_config?.agent?.prompt?.prompt || "";
const vFirst = verified.conversation_config?.agent?.first_message || "";
const vEagerness = verified.conversation_config?.turn?.turn_eagerness || "not set";
const vName = verified.name || "not set";

console.log("\n=== Verification ===");
console.log(`  Agent name: ${vName}`);
console.log(`  Prompt length: ${vPrompt.length} chars`);
console.log(`  First message: "${vFirst.substring(0, 80)}..."`);
console.log(`  Turn eagerness: ${vEagerness}`);
console.log(`  Contains "AiA": ${vPrompt.includes("You are AiA")}`);
console.log(`  Contains relaxed intake: ${vPrompt.includes("Welcome & Explore")}`);
console.log(`  Contains "few hundred": ${vPrompt.includes("few hundred")}`);
console.log(`  Max duration: ${verified.conversation_config?.conversation?.max_duration_seconds}s`);

const allGood = vPrompt.includes("You are AiA") && 
                vEagerness === "normal" && 
                !vPrompt.includes("few hundred") &&
                vPrompt.includes("Welcome & Explore");
console.log(`\n${allGood ? "✅ ALL CHANGES VERIFIED LIVE" : "⚠️ SOME CHANGES MAY NOT HAVE APPLIED"}`);
