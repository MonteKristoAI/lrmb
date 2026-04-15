const agentId = process.env.ELEVENLABS_AGENT_ID;
const apiKey = process.env.ELEVENLABS_API_KEY;

async function main() {
  const res = await fetch("https://api.elevenlabs.io/v1/convai/agents/" + agentId, {
    headers: { "xi-api-key": apiKey }
  });
  const data = await res.json();
  
  console.log("=== platform_settings ===");
  console.log(JSON.stringify(data.platform_settings, null, 2));
  console.log("\n=== workspace_overrides ===");
  console.log(JSON.stringify(data.workspace_overrides, null, 2));
}

main().catch(e => console.error(e));
