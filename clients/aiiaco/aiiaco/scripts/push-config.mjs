const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY || !AGENT_ID) {
  console.error("Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID");
  process.exit(1);
}

// Get current live config
const getRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`, {
  headers: { "xi-api-key": API_KEY },
});
const current = await getRes.json();
const currentMax = current.conversation_config?.conversation?.max_duration_seconds;
console.log("Current live max_duration_seconds:", currentMax);

// Push update
console.log("Pushing max_duration_seconds: 900 to live agent...");
const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`, {
  method: "PATCH",
  headers: {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    conversation_config: {
      conversation: {
        max_duration_seconds: 900,
      },
    },
  }),
});

if (!res.ok) {
  const err = await res.text();
  console.error("Push failed:", res.status, err);
  process.exit(1);
}

console.log("Push successful! Status:", res.status);

// Verify
const verifyRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`, {
  headers: { "xi-api-key": API_KEY },
});
const verified = await verifyRes.json();
const newMax = verified.conversation_config?.conversation?.max_duration_seconds;
console.log("Verified live max_duration_seconds:", newMax);
console.log(newMax === 900 ? "CONFIRMED: 900s is live" : "WARNING: mismatch!");
