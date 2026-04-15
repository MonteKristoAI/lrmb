/**
 * One-time script to create the AiiA Diagnostic Agent in ElevenLabs.
 * Run: node scripts/create-agent.mjs
 */
import { createDiagnosticAgent, listAgents } from "../server/aiAgent.ts";

// We need to load env vars
import { config } from "dotenv";
config({ path: ".env" });

const WEBHOOK_URL = "https://aiiaco.com/api/webhooks/elevenlabs";

async function main() {
  console.log("Checking existing agents...");
  try {
    const existing = await listAgents();
    if (existing.length > 0) {
      console.log("Existing agents:");
      existing.forEach(a => console.log(`  - ${a.name}: ${a.agent_id}`));
      console.log("\nAgent already exists. Use the agent_id above.");
      return;
    }
    console.log("No existing agents found. Creating new agent...");
    const agentId = await createDiagnosticAgent(WEBHOOK_URL);
    console.log("\n✅ Agent created successfully!");
    console.log(`   Agent ID: ${agentId}`);
    console.log("\nNext step: Add ELEVENLABS_AGENT_ID=" + agentId + " to your project Secrets.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
