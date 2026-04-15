# Language Detection Tool - ElevenLabs API

## Key Findings
- Language detection is a SYSTEM TOOL, not a built_in_tools flag
- It must be added as a tool in the agent's `prompt.tools` array
- The tool type is "system" with name "language_detection"

## API Structure for Adding Language Detection Tool
```json
{
  "conversation_config": {
    "agent": {
      "prompt": {
        "tools": [
          {
            "type": "system",
            "name": "language_detection",
            "description": "Detect the user's language and switch to it automatically"
          }
        ]
      }
    }
  }
}
```

## How it works
- `detection`: if user speaks a different language than current output, switch triggered
- `content`: if user asks in current language to change to a new language, switch triggered
- Language is fixed for duration of call once switched
- Supported languages must be defined in agent settings (language_presets)

## Current State
- Arabic language preset: ADDED (with Sultan voice 8KMBeKnOSHXjLqGuWsAE)
- Language detection tool: NOT YET ADDED (need to add as system tool)
- TTS model: still eleven_turbo_v2 (English only) - needs to be changed to multilingual model
