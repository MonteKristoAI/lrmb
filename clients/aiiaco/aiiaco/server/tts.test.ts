import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";

describe("ElevenLabs TTS", () => {
  it("should have an ElevenLabs API key configured", () => {
    expect(ENV.elevenLabsApiKey).toBeTruthy();
    expect(ENV.elevenLabsApiKey.length).toBeGreaterThan(10);
  });

  it("should synthesize audio using Rachel voice", async () => {
    const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ENV.elevenLabsApiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: "AiiA. The AI Integration Authority for the Corporate Age.",
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.80,
          },
        }),
      }
    );

    expect(response.status).toBe(200);
    const buffer = await response.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(1000); // Should be a real audio file
  }, 15000); // Allow up to 15s for API call
});
