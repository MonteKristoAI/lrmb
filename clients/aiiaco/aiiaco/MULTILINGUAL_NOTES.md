# AiiA Multilingual Support Notes

## Current Config
- Agent language: `en` (English only)
- TTS model: `eleven_turbo_v2` (English-only, fastest)
- ASR: ElevenLabs provider, high quality

## ElevenLabs Multilingual Support
- Adding additional languages switches the agent to **Turbo v2.5 Multilingual** model
- English always uses the faster v2 model
- Selecting "All" supports **31 languages** covering ~90% of world population
- Each language can have its own voice and first message
- Language detection tool can auto-switch to user's preferred language
- Language is **fixed for the duration of the call** — no mid-conversation switching

## Languages asked about:
- Arabic ✅ supported
- French ✅ supported
- Spanish ✅ supported
- Chinese (Mandarin) ✅ supported
- Korean ✅ supported
- Russian ✅ supported
- Japanese ✅ supported

## What's needed to enable:
1. Add additional languages via ElevenLabs API (agent config update)
2. Configure language-specific voices from Voice Library
3. Translate/customize first messages for each language
4. Add language detection tool to agent
5. Update the website widget to show language selector
