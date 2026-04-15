/**
 * Inspect live ElevenLabs agent config - full dump of conversation settings,
 * turn detection, voice, max duration, etc.
 *
 * Usage: node scripts/inspect-live-agent.mjs
 * Reads ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID from process.env
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Try to load .env manually (read-only, no dotenv needed)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const EL_BASE = "https://api.elevenlabs.io/v1";

if (!API_KEY) { console.error("Missing ELEVENLABS_API_KEY"); process.exit(1); }
if (!AGENT_ID) { console.error("Missing ELEVENLABS_AGENT_ID"); process.exit(1); }

async function main() {
  console.log("Fetching agent config...\n");

  // 1. Get full agent config
  const agentRes = await fetch(`${EL_BASE}/convai/agents/${AGENT_ID}`, {
    headers: { "xi-api-key": API_KEY },
  });
  if (!agentRes.ok) {
    console.error(`Agent fetch failed: ${agentRes.status} ${await agentRes.text()}`);
    process.exit(1);
  }
  const agent = await agentRes.json();

  // Print key settings
  console.log("=== AGENT IDENTITY ===");
  console.log(`  Name: ${agent.name}`);
  console.log(`  Agent ID: ${AGENT_ID}`);

  const convConfig = agent.conversation_config || {};
  const agentConfig = convConfig.agent || {};
  const prompt = agentConfig.prompt || {};
  const tts = convConfig.tts || {};
  const asr = convConfig.asr || {};
  const turn = convConfig.turn || {};
  const conversation = convConfig.conversation || {};
  const clientTools = convConfig.client_tools || [];

  console.log("\n=== PROMPT ===");
  console.log(`  LLM: ${prompt.llm || "not set"}`);
  console.log(`  Temperature: ${prompt.temperature ?? "not set"}`);
  console.log(`  Max tokens: ${prompt.max_tokens ?? "not set"}`);
  console.log(`  Prompt length: ${(prompt.prompt || "").length} chars`);
  console.log(`  First message: "${(agentConfig.first_message || "").substring(0, 120)}..."`);
  console.log(`  Language: ${agentConfig.language || "not set"}`);

  console.log("\n=== TTS (Text-to-Speech) ===");
  console.log(`  Voice ID: ${tts.voice_id || "not set"}`);
  console.log(`  Model ID: ${tts.model_id || "not set"}`);
  console.log(`  Stability: ${tts.stability ?? "not set"}`);
  console.log(`  Similarity boost: ${tts.similarity_boost ?? "not set"}`);
  console.log(`  Optimize streaming latency: ${tts.optimize_streaming_latency ?? "not set"}`);

  console.log("\n=== ASR (Speech Recognition) ===");
  console.log(`  Quality: ${asr.quality || "not set"}`);
  console.log(`  User input audio format: ${asr.user_input_audio_format || "not set"}`);

  console.log("\n=== TURN DETECTION ===");
  console.log(JSON.stringify(turn, null, 2));

  console.log("\n=== CONVERSATION SETTINGS ===");
  console.log(JSON.stringify(conversation, null, 2));

  console.log("\n=== CLIENT TOOLS ===");
  console.log(`  Count: ${clientTools.length}`);
  if (clientTools.length > 0) {
    console.log(JSON.stringify(clientTools, null, 2));
  }

  console.log("\n=== PLATFORM SETTINGS ===");
  console.log(JSON.stringify(agent.platform_settings, null, 2));

  console.log("\n=== WORKSPACE OVERRIDES ===");
  console.log(JSON.stringify(agent.workspace_overrides, null, 2));

  // 2. Check workspace-level settings
  const wsRes = await fetch(`${EL_BASE}/convai/settings`, {
    headers: { "xi-api-key": API_KEY },
  });
  if (wsRes.ok) {
    const ws = await wsRes.json();
    console.log("\n=== WORKSPACE SETTINGS ===");
    console.log(JSON.stringify(ws, null, 2));
  }

  // 3. Get recent conversations to check for patterns
  console.log("\n=== RECENT CONVERSATIONS (last 5) ===");
  const convRes = await fetch(
    `${EL_BASE}/convai/conversations?agent_id=${AGENT_ID}&page_size=5`,
    { headers: { "xi-api-key": API_KEY } }
  );
  if (convRes.ok) {
    const convData = await convRes.json();
    const conversations = convData.conversations || [];
    for (const c of conversations) {
      console.log(`\n  --- Conversation ${c.conversation_id} ---`);
      console.log(`    Status: ${c.status}`);
      console.log(`    Start: ${c.start_time_unix_secs ? new Date(c.start_time_unix_secs * 1000).toISOString() : "?"}`);
      console.log(`    Duration: ${c.call_duration_secs ?? "?"}s`);
      console.log(`    End reason: ${c.end_reason || c.termination_reason || "?"}`);

      // Fetch full conversation detail to see transcript
      try {
        const detailRes = await fetch(
          `${EL_BASE}/convai/conversations/${c.conversation_id}`,
          { headers: { "xi-api-key": API_KEY } }
        );
        if (detailRes.ok) {
          const detail = await detailRes.json();
          const transcript = detail.transcript || [];
          console.log(`    Transcript entries: ${transcript.length}`);
          // Show first 3 entries
          for (const t of transcript.slice(0, 3)) {
            const text = (t.message || t.text || "").substring(0, 100);
            console.log(`      [${t.role}]: "${text}${text.length >= 100 ? '...' : ''}"`);
          }
          if (detail.analysis) {
            console.log(`    Analysis: ${JSON.stringify(detail.analysis).substring(0, 200)}`);
          }
          // Check for call_successful and other metadata
          console.log(`    Call successful: ${detail.metadata?.call_successful ?? detail.analysis?.call_successful ?? "?"}`);
        }
      } catch (e) {
        console.log(`    (Could not fetch detail: ${e.message})`);
      }
    }
  }

  // Save full agent config to file for reference
  const outPath = path.join(__dirname, "..", "agent-live-config.json");
  fs.writeFileSync(outPath, JSON.stringify(agent, null, 2));
  console.log(`\nFull agent config saved to: ${outPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
