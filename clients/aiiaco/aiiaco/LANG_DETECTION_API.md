# Language Detection API - Exact Structure from ElevenLabs Docs

The language detection tool is added as a system tool in `prompt.tools` array, NOT in `built_in_tools`.

```bash
curl -X POST https://api.elevenlabs.io/v1/convai/agents/create \
  -H "xi-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_config": {
      "agent": {
        "prompt": {
          "first_message": "Hi how are you?",
          "tools": [
            {
              "type": "system",
              "name": "language_detection",
              "description": ""
            }
          ]
        }
      },
      "language_presets": {
        "nl": {
          "overrides": {
            "agent": { ... },
            "tts": { "voice_id": "..." }
          }
        }
      }
    }
  }'
```

## Key points:
1. Tool goes in `conversation_config.agent.prompt.tools[]`
2. Type is "system", name is "language_detection"
3. Description can be blank (uses default detection prompt)
4. Language presets define per-language voice and first_message overrides
5. Need to also switch TTS model to multilingual (eleven_turbo_v2_5 or eleven_multilingual_v2)
