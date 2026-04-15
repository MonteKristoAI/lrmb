# AiiA Diagnostic Intelligence Agent — Architecture Audit

## The Full Chain (8 Steps)

```
User clicks gold mic → ElevenLabs voice agent (AiiA) → Call ends →
ElevenLabs fires webhook → Server processes transcript → LLM extracts intelligence →
Lead saved to DB → Email sent to caller + Owner notified
```

## Three Entry Points Into the Intelligence Pipeline

### 1. Webhook Handler (`server/webhooks/elevenlabs.ts`)
- **Trigger**: ElevenLabs fires POST to `/api/webhooks/elevenlabs` after every call
- **Flow**: Raw body → HMAC verify (now resilient — logs warning but never drops) → `parseCallWebhook()` → `extractConversationIntelligence()` → DB insert/update → `sendEmail()` → `notifyOwner()`
- **Status**: FIXED — no longer drops leads on HMAC mismatch

### 2. Conversation Poller (`server/conversationPoller.ts`)
- **Trigger**: Runs every 5 minutes on a timer (1-min initial delay after boot)
- **Flow**: Fetch recent conversations from ElevenLabs API → Check each against DB → For any NOT in DB → fetch detail → `parseCallWebhook()` → `extractConversationIntelligence()` → DB insert/update → `sendEmail()` → `notifyOwner()`
- **Status**: NEW — safety net for any calls the webhook misses

### 3. Re-Analyze Button (`server/routers.ts` → `leads.reanalyzeTranscript`)
- **Trigger**: Admin clicks "Re-analyze" button on a lead in the admin console
- **Flow**: Load lead from DB → `extractConversationIntelligence(lead.callTranscript)` → Update DB with refreshed intelligence
- **Status**: Working — uses the SAME `extractConversationIntelligence()` function

## Shared Core Service: `extractConversationIntelligence()` in `server/aiAgent.ts`

All three entry points call the same function. This is the single LLM-powered intelligence extraction service that:
- Extracts pain points, wants, current solutions
- Generates executive summary
- Extracts contact info (name, company, email, phone) as LLM fallback
- Returns structured `ConversationIntelligence` object

## Supporting Services

| Service | File | Purpose |
|---------|------|---------|
| Health Monitor | `server/healthMonitor.ts` | Checks 6 vitals every 5 min |
| Health Scheduler | `server/healthScheduler.ts` | Runs health checks on timer, alerts owner |
| Email | `server/email.ts` | Sends via Resend (from: team@resend.aiiaco.com) |
| Owner Notify | `server/_core/notification.ts` | Manus notification system |
| Knowledge Base | `server/routers.ts` (knowledgeBase router) | CRUD + push-to-agent |
| Agent Config | `server/routers.ts` (agent router) | Read/update ElevenLabs agent prompt |

## Gaps Identified

### GAP 1: No admin "Recover Missed Calls" button
The poller runs automatically, but there's no way for an admin to manually trigger it.
If they see a call is missing, they have to wait up to 5 minutes.

### GAP 2: Health monitor doesn't check the Conversation Poller
The 6 vitals don't include a check for whether the poller is running.
If the poller crashes silently, nobody knows.

### GAP 3: No "force re-send email" button
If the email failed but the lead was captured, there's no way to re-send the follow-up email from the admin console.

### GAP 4: Poller email template is simplified
The webhook handler uses rich track-specific emails (getTrackEmail).
The poller uses a simplified version (getTrackEmailForPoller).
They should use the same templates.
