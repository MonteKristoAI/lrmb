import 'dotenv/config';

const apiKey = process.env.ELEVENLABS_API_KEY;

const convIds = [
  "conv_8701kkg7crg5e3ftge6pan3ydf7h",  // Namadou call
  "conv_3201kkg6wp2aecs9khbhf2gdek3z",  // Nimmer call
];

for (const convId of convIds) {
  const res = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${convId}`, {
    headers: { "xi-api-key": apiKey }
  });
  const data = await res.json();
  const summary = data.analysis?.transcript_summary || "No summary";
  const transcript = data.transcript || [];
  
  console.log(`\n=== ${convId} ===`);
  console.log("Duration:", data.metadata?.call_duration_secs, "seconds");
  console.log("Transcript messages:", transcript.length);
  console.log("Summary:", summary.substring(0, 300));
  
  // Extract contact info from transcript
  const fullText = transcript.map(t => `${t.role}: ${t.message}`).join("\n");
  const emailMatch = fullText.match(/[\w.-]+@[\w.-]+\.\w+/);
  console.log("Email found:", emailMatch ? emailMatch[0] : "none");
  
  // Show last few messages
  console.log("\nLast 3 messages:");
  transcript.slice(-3).forEach(t => {
    console.log(`  [${t.role}]: ${t.message?.substring(0, 150)}`);
  });
}
