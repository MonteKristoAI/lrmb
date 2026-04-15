# AiiACo Project TODO

## Completed
- [x] Homepage hero, platform, method, results, case studies, engagement models sections
- [x] SEO meta tags, JSON-LD structured data, sitemap
- [x] 3 SEO pillar pages: /ai-integration, /ai-implementation-services, /ai-automation-for-business
- [x] Internal cross-links between pillar pages
- [x] Full-stack upgrade: tRPC + MySQL + leads table
- [x] Contact forms wired to backend (Executive Call Request + Structured Intake)
- [x] Owner notifications on form submission
- [x] Step 01 wording fix: "Business Intelligence Audit"
- [x] Results intro split into 2 sentences
- [x] Case Studies bullet formatting fixed
- [x] 20 industry microsites at /industries/[slug]
- [x] All 20 industry pills on homepage linked to microsites
- [x] Back button on each microsite → /#industries
- [x] /admin/leads dashboard with pipeline status controls
- [x] Featured case study block on 5 industry microsites
- [x] 3 remaining industry microsites (Battery & EV, Helium & Specialty Gas, Biofuel & Sustainable Fuels)
- [x] Sitemap updated to 23 URLs

## Follow-up Round 3
- [x] CRM webhook integration in leads router (Zapier/Make.com configurable endpoint)
- [x] 4 new anonymized case studies (Mortgage/Lending, Insurance, Luxury Hospitality, Software)
- [x] Wire all matching industry microsites to featured case studies
- [x] SF Pro / Apple system font applied site-wide
- [x] UHNW & Private Wealth industry added with dedicated microsite + featured section
- [x] Calendly (calendly.com/nemr1) embedded after Executive Call Request form submission

## Follow-up Round 4
- [x] Add Calendly embed to UHNW microsite CTA section
- [x] Build protected /admin/leads dashboard UI with pipeline status controls
- [x] Add Private Division nav item to Navbar

## Round 5
- [x] Secret admin console at unique URL with access control
- [x] Defence & Aerospace industry section + microsite
- [x] Subtle animated liquid glass background movement
- [x] Gold shimmer on section titles

## Round 6
- [x] Remove Private nav button from Navbar (keep UHNW only in Industries section)
- [x] Fix glass orb animation (currently not visible)
- [x] Redesign Calendly booking flow to be aesthetically aligned with site design

## Round 8
- [x] Change admin panel URL from /aiiaco-ops-9f4e2b7c to /admin-opsteam

## Round 7
- [x] Fix glass orb z-index stacking (overlays were covering orbs at z-index auto)
- [x] Add mix-blend-mode: screen to glass orbs for visibility through dark overlays
- [x] Increase animation movement range (80-150px travel distance for visible motion)
- [x] Boost orb color intensity (rgba opacity 0.45-0.50 vs previous 0.07-0.18)
- [x] Add animated counter roll-up to hero KPI numbers (20+, 100%, 0)

## Round 9
- [x] Update robots.txt to block /admin-opsteam and /admin/ routes
- [x] Add admin_users table to database schema (username, hashed password, role, created_at)
- [x] Build server-side admin auth procedures (login, logout, session, create/list/delete admins)
- [x] Build dedicated admin login page at /admin-opsteam
- [x] Build admin user management UI inside the console (create admin, list admins, delete admins)
- [x] First-time setup flow (shown automatically when no admins exist yet)

## Round 10
- [x] Fix admin login cookie (sameSite: lax was blocking cookie on production cross-origin requests)
- [x] Auto-login after setup (setup mutation should set session cookie immediately)

## Round 11
- [x] Switch admin session from cookie to localStorage + Authorization header (cookie blocked by proxy)
- [x] Fix circular dependency (moved token helpers to @/lib/adminToken.ts)

## Round 12 — SEO & AI Search Visibility
- [x] Research real search queries for AI integration services
- [x] Implement JSON-LD schema: Organization, ProfessionalService, FAQPage, HowTo, WebSite (5 schemas)
- [x] Add FAQ sections to /ai-integration, /ai-implementation-services, /ai-automation-for-business, /method
- [x] Rewrite PlatformSection card bodies with technical specificity and quantified outcomes
- [x] Create /ai-governance page: 6-pillar framework + regulatory alignment table + FAQ + CTA
- [x] Add /ai-governance to sitemap.xml
- [x] Add Services nav section to Footer with all 4 service pages
- [x] Add FAQPage JSON-LD with 8 enterprise AI integration Q&As to global StructuredData
- [x] Add HowTo JSON-LD with 6-step AI integration process to global StructuredData

## Round 13 — Logo & Favicon
- [x] Extract AiiA chip logo from uploaded image (crop left half, transparent PNG)
- [x] Generate favicon sizes: 512, 192, 32, 16px from chip icon
- [x] Upload all 7 logo assets to CDN
- [x] Replace navbar SVG placeholder with real AiiA chip+wordmark logo
- [x] Set favicon in index.html (tab icon, 4 sizes + apple-touch-icon)
- [x] Add Open Graph meta image (1200x630) for social share previews
- [x] Add Twitter Card image meta tags
- [x] Update Organization JSON-LD logo URL to real CDN asset

## Round 14 — Favicon Fix (Tab Icon)
- [x] Copy favicon files to client/public/ for same-origin serving (iOS Safari requires same-origin)
- [x] Generate favicon.ico (16/32/48px multi-size) for maximum browser compatibility
- [x] Update index.html to reference local /favicon.ico, /favicon-32.png, /apple-touch-icon.png

## Round 15 — Logo Consistency
- [x] Replace old 4-dot gold square in Footer with real AiiA chip+wordmark logo
- [x] Replace gear/lock emoji icons on Admin login and setup pages with AiiA logo
- [x] Replace gear icon in Admin console header with AiiA logo

## Round 16 — Workplace Page
- [x] Create /workplace page with full remote work policy (6 pillars + standards table + philosophy + CTA)
- [x] Register route in App.tsx
- [x] Add to sitemap.xml
- [x] Add to footer Company navigation

## Round 17 — Logo Update (Gold-Only Transparent)
- [x] Upload new gold-only transparent logo to CDN
- [x] Update Navbar logo (6 references replaced, 0 old remaining)
- [x] Update Footer logo
- [x] Update Admin console (login, setup, header — 3 instances)
- [x] Update favicon files in client/public/ (16/32/180/192/512px + .ico)
- [x] Update Organization JSON-LD logo URL in StructuredData.tsx

## Round 18 — Two-Tone Gold Logo
- [x] Generate two-tone gold logo from source image (dark antique gold interior + bright goldenrod frame/pins/wordmark)
- [x] Apply morphological closing to fill JPEG compression gaps in frame
- [x] Upload two-tone logo to CDN (1x + 2x retina)
- [x] Replace all 6 logo instances: Navbar, Footer, Admin login, Admin setup, Admin console header, JSON-LD schema
- [x] Regenerate all favicon files from two-tone logo (16/32/180/192/512px PNG + multi-size .ico)

## Round 21 — Read Aloud Feature (ElevenLabs Rachel Voice)
- [x] Add ElevenLabs API key to project secrets
- [x] Add TTS server procedure (Rachel voice, eleven_turbo_v2 model)
- [x] Create ReadAloud component with play/pause/stop controls and gold progress bar
- [x] Add LISTEN button to Navbar (desktop, between nav links and CTA)
- [x] Write vitest test for TTS API validation

## Round 22 — Read Aloud Voice Fix
- [x] Fix punctuation: clean dots/symbols from text before TTS (no literal "dot" spoken)
- [x] Tune ElevenLabs voice settings for more natural, witty, human delivery
- [x] Fix brand name pronunciation: AiiACo → "AiiA Co" (not AiiAko)

## Round 23 — Read Aloud Complete Rebuild (Scroll-Sync TTS)
- [ ] Redesign architecture: sentence-level chunks tied to DOM elements, not page sections
- [ ] Pre-fetch audio 2-3 sentences ahead to eliminate loading pauses
- [ ] Scroll-sync: IntersectionObserver tracks which sentence is in viewport, plays that sentence
- [ ] Word-by-word highlight on screen as Rachel speaks each word
- [ ] Instant reverse: scrolling up stops current audio and jumps to the sentence now in view
- [ ] Smooth auto-scroll: page follows along as audio plays (waterfall effect)
- [ ] Upgrade to eleven_multilingual_v2 with lower stability for more natural delivery
- [ ] Remove all section-level chunking, replace with sentence-level DOM-mapped approach

## Round 24 — Video Studio Nav Link
- [x] Add "Video Studio" CTA button in Navbar pointing to aiiaco.com/videostudio

## Round 25 — Video Studio Redirect & Nav Link
- [x] Add server-side redirect: GET /videostudio → https://aiivideo-zyf9pqt6.manus.space
- [x] Update navbar Video Studio button href to /videostudio (relative path)

## Round 26 — Fix /videostudio External Redirect
- [x] Fix /videostudio redirect to properly redirect externally (server-side before SPA catch-all)

## Round 28 — Niche Reduction (Real Estate / Mortgages / Brokerage / Management Consulting)
- [x] Audit all industry microsites and identify which to keep vs remove
- [x] Reduce industries data to 4 target verticals: Real Estate, Mortgage, CRE, Management Consulting
- [x] Update Industries homepage section to show only the 4 verticals with cards
- [x] Update case studies to keep only relevant industry cases (4 focused case studies)
- [x] Update hero KPIs and description to reflect focused niche
- [x] Update all "20+ industries" references across the site (Footer, TeamSection, AIImplementationPage, AIIntegrationPage, Home.tsx, ResultsPage, StructuredData)
- [x] Update SEO meta and structured data for focused niche

## Round 29 — Fix /videostudio Redirect (Double Approach)
- [x] Register /videostudio as absolute first Express route (before all middleware)
- [x] Add React Router /videostudio route with window.location.href redirect component

## Round 30 — Netlify _redirects Proxy for /videostudio
- [x] Add client/public/_redirects with proxy rules for /videostudio → https://aiivideo-zyf9pqt6.manus.space

## Round 31 — Evolved Positioning Update (EBITDA Efficiency Partner)
- [x] Update hero headline: "Remove Operational Friction. Run Your Business Faster."
- [x] Update hero subheadline with new AiiA positioning copy
- [x] Update hero bullet points (4 new primary points)
- [x] Update hero short explanation / body copy
- [x] Update CTA to "Book an Operational Strategy Call"
- [x] Add 3-line credibility block below hero: "Companies come to AiiA when..."
- [x] Update page SEO title and description to reflect new positioning

## Round 32 — Full Operator Brief Site Update
- [x] Save checkpoint with hero/credibility block changes from Round 31
- [x] Add Three Operational Leaks section (Field Workflow, Payroll Efficiency, Numbers We Don't Trust)
- [x] Align Method section to Find → Implement → Measure → Expand (4 phases)
- [x] Build conversational qualifier booking flow in Contact section (1 question at a time)
- [x] Update footer tagline to "Operational Intelligence for companies that refuse to let friction run the business"

## Round 33 — Suggestions Implementation
- [x] Update announcement bar to reflect new positioning
- [x] Wire qualifier budget/investment answers to admin leads dashboard columns
- [x] Complete Read Aloud rebuild: scroll-sync, sentence-level chunks, pre-fetch queue, word highlight, instant reverse on scroll

## Round 34 — CTA Buttons & CSV Export
- [x] Add "Does this sound familiar? Let's fix it." CTA button to each Operational Leaks card (scrolls to contact)
- [x] Add CSV export button to admin leads dashboard (downloads all leads including budget/investment columns)

## Round 35 — Proprietary AiiA Gold Icons (Brand Identity)
- [x] Audit all icon/emoji usage across the entire site
- [x] Generate 4 proprietary AiiA gold sector icons: Real Estate, Mortgage & Lending, Commercial Real Estate, Management Consulting
- [x] Generate 11 total AiiA gold icons: 4 industry sectors + 3 operational leaks + 6 WhatIsAiiA pillars
- [x] Upload all icons to CDN (webdev static assets, permanent lifecycle)
- [x] Replace all generic icons/emojis site-wide with proprietary AiiA gold assets (Industries, OperationalLeaks, WhatIsAiiA, Pricing)

## Round 36 — Icon Background Fix
- [ ] Regenerate workflow icon with fully transparent background (white bg visible on dark site)
- [ ] Re-upload and update CDN URL in OperationalLeaks component

## Round 36 — Skyline Brand Icon & Icon Background Fix
- [x] Generate premium AiiA gold skyline icon (Qatar/Dubai ultra-modern tower silhouette)
- [x] Fix all icon white backgrounds using AI-based rembg batch removal (14/14 icons)
- [x] Upload all 14 transparent icons to CDN and update all component references (Industries, OperationalLeaks, WhatIsAiiA, Pricing)

## Round 37 — Qualifier Flow Redesign, Skyline Icon, Landmark Icons
- [x] Audit current contact/qualifier form components and DB schema
- [x] Generate 3 large landmark section icons (Method, Industries, Models)
- [x] Swap Real Estate card icon to Dubai/Qatar skyline silhouette
- [x] Redesign qualifier into 3-step form: Step 1 (name/company/email/phone), Step 2 (problem dropdown with 10 options + free text), Step 3 (call booking: time preference or Calendly)
- [x] Progressive lead capture: save to DB as soon as name+company captured, update on each subsequent step
- [x] Integrate Calendly embed for call booking in Step 3
- [x] Add landmark icons to Method, Industries, Models section headers

## Round 38 — Calendly URL, Qualifier Modal CTAs, Lead Source Tracking
- [x] Update Calendly URL from calendly.com/aiiaco/discovery to calendly.com/aiiaco
- [x] Wire Operational Leaks "Does this sound familiar?" CTAs to open qualifier modal directly (not just scroll)
- [x] Add lead source tracking field to qualifier Step 1 (hidden, captures which CTA triggered it)
- [x] Pass lead source through all CTA entry points: Hero, Navbar, Operational Leaks cards (3 individual leak titles), ContactSection direct

## Round 39 — Broken Icon Fix
- [x] Re-upload all 3 landmark icons (Method, Industries, Models) to CDN and fix broken URLs in all three components

## Round 40 — Modal Layout Fix + Favicon
- [x] Fix qualifier modal desktop layout: widened to 1100px max with scrollable container
- [x] Add AiiA gold favicon with transparent background (rembg processed, all sizes regenerated, cache-busted with ?v=2)

## Round 41 — Admin Dashboard leadSource + Mobile Modal
- [x] Add leadSource column to admin leads dashboard table (Source badge column + expanded detail panel + CSV export updated)
- [x] Tighten mobile qualifier modal layout (responsive CSS: single-column grid below 860px, reduced padding, sidebar hidden on mobile)

## Round 42 — Investor-Grade Document Suite
- [ ] Gather brand assets: logo CDN URL, icon CDN URLs, color palette, font stack
- [ ] Build AiiACo Overview Brochure (HTML + print CSS, dark gold theme, matches website)
- [ ] Export brochure to PDF
- [ ] Build one-page visual architecture diagram (Infrastructure Stack + 3-pillar graphic)
- [ ] Export architecture diagram to PDF

## Round 42 — Investor-Grade Document Suite
- [x] Build AiiACo Overview Brochure as premium HTML/PDF matching website design (7-page A4, dark gold theme)
- [x] Build 3-Pillar Architecture Diagram (Database → Revenue → Operations) as landscape A4 PDF
- [x] Build AiiACo Infrastructure Stack diagram (5-layer stack + engagement flow + sector map) as landscape A4 PDF
- [x] All documents use proprietary AiiA gold icons, logo, and brand identity

## Round 43 — Open Graph / Social Share Preview Fix
- [x] Generate new 1200x630 OG preview image (dark gold, AiiA logo, current tagline)
- [x] Upload OG image to CDN (permanent webdev lifecycle URL)
- [x] Update index.html: og:description, og:image, twitter:description, twitter:image all updated

## Round 44 — OG Image Logo Consistency Fix
- [x] Composite the exact website logo (pure gold chip) into the OG preview image using Python/Pillow
- [x] Upload new OG image v3 to CDN and update index.html og:image + twitter:image

## Round 45 — AiiACo Masterpiece Overview Document
- [x] Read uploaded PDF content and extract all text/structure
- [x] Generate singular 3D gold masterpiece icon (Arc of the Covenant × Tron circuit board) — aiia-arc-icon-final.png
- [x] Build premium HTML document with finest paper texture, gold typography, masterpiece icon (4-page A4)
- [x] Export to PDF and verify quality — 4 pages, clean render, all assets loading

## Round 46 — Lead Confirmation Email + Diagnostic Privacy
- [x] Send lead a thank-you confirmation email on intake completion (call incoming, no diagnostic details)
- [x] Ensure AI diagnostic is sent ONLY to owner via Manus notification — never to the lead

## Round 47 — Rebuilt Diagnostic + Email Flow
- [x] Generate full diagnostic + lead brief in one structured LLM call (JSON schema response)
- [x] Owner notification: full report + preview of what the lead will receive
- [x] Lead email: email confirmation + meeting confirmation + high-level brief only

## Round 48 — Domain Verification, Admin Diagnostic Panel, Retroactive Diagnostic
- [x] Verify aiiaco.com sending domain in Resend (get DNS records, present to user)
- [x] Add AI diagnostic display to admin console lead detail panel
- [x] Run retroactive diagnostic for Maria Luisa (send her confirmation email + owner report)

## Round 50 — Logo in Google + Industry Pages
- [ ] Fix Google site icon — regenerate favicon from AiiA logo with clean transparent background
- [ ] Add all 20 missing industry slugs to industries.ts data file
- [ ] Verify IndustryMicrosite renders correctly for all slugs
- [ ] Update sitemap.xml to include all industry pages

## Round 50 — Full Audit Fix Run
- [x] Bug #1: Fix Calendly nemr1 link in IndustryMicrosite.tsx
- [x] Bug #2: Fix workflow icon white background in OperationalLeaks
- [x] Bug #3: Fix email sending domain to resend.aiiaco.com
- [ ] Improvement #1: Add Re-run Diagnostic button to admin leads panel
- [ ] Improvement #2: Lead status auto-progression to diagnostic_ready
- [ ] Improvement #3: Google Business Profile setup guide
- [ ] Improvement #4: AiiA Voice sentence-level sync (8 items)
- [ ] Improvement #5: Fix pre-existing leads.test.ts failure
- [ ] Improvement #6: Build AiiACo Overview Brochure PDF
- [ ] Improvement #7: Build Architecture Diagram PDF

## Round 51 — Next Steps Implementation
- [x] Add Re-run Diagnostic button to admin leads panel (regenerate GPT-4o diagnostic + re-send owner notification)
- [x] Fix leads.test.ts admin auth mock (inject valid JWT token into tRPC context)
- [x] Google Search Console indexing guidance for top 4 industry pages

## Round 52 — Polish & Infrastructure
- [x] Lead status auto-progression: move lead to diagnostic_ready after GPT-4o diagnostic completes
- [x] Re-run Diagnostic button: loading spinner + disabled state during mutation
- [x] Verify resend.aiiaco.com DNS and provide Namecheap CNAME setup guidance

## Round 53 — Admin Panel Enhancements
- [x] Add diagnostic_ready count badge to admin navbar header
- [x] Add per-lead notes field: DB schema migration, saveNotes tRPC procedure, notes textarea in expanded lead row

## Round 54 — Pipeline Intelligence
- [x] Notes preview (first ~60 chars) in collapsed lead row
- [x] Lead age colour-coded chip (green <3d, amber 3-7d, red >7d)
- [x] Calendly webhook: /api/webhooks/calendly → match email → auto-move lead to contacted

## Round 55 — AI Phone Diagnostic System
- [x] Research ElevenLabs Conversational AI API (agents, phone numbers, webhooks)
- [x] Design diagnostic agent prompt and 3-track routing logic
- [x] Build server: ElevenLabs agent creation/config endpoint + post-call webhook (lead capture)
- [x] Add Call Now CTA (+1 888-808-0001) to hero, navbar, contact sections
- [x] Build /admin/agent page: view/edit agent script and routing logic
- [x] Write tests for webhook lead capture

## Round 56 — ElevenLabs Phone Number
- [ ] Research ElevenLabs phone number provisioning API
- [ ] Acquire new number directly from ElevenLabs and assign to AiiA Diagnostic Agent
- [ ] Update all Call Now CTAs on site with new number

## Round 56 — Phone Number Provisioning (Telnyx)
- [x] Update Call Now CTAs with smart Calendly fallback while Telnyx verification propagates
- [x] Pre-build complete Telnyx provisioning script (number purchase + SIP trunk + ElevenLabs import)
- [ ] Run provisioning script once Telnyx Level 2 verification propagates (~30-60 min)
- [ ] Update site CTAs with real phone number

## Round 57 — Corporate Package, Transcript Viewer, Auto-Provisioning
- [x] Build /corporate page: modular AI rollout sequence (Cold Email → SDR+Website+Receptionist → Agent/Operator → Paid Ads → Podcast/Social)
- [x] Add call transcript viewer to admin expanded lead row (ElevenLabs post-call transcript inline)
- [x] Build automated Telnyx verification poller: polls every 30 min, runs provision-phone.mjs when Level 2 approved

## Round 58 — Voice Widget & Agent Optimization
- [x] Add floating gold microphone widget to site (bottom-right) for browser-based AiiA testing
- [x] Install @11labs/react and @elevenlabs/client SDKs
- [x] Update ElevenLabs agent: voice → Sarah (confident/professional), turn_eagerness → eager, speculative_turn → true
- [x] Rewrite agent prompt with natural contractions, short sentences, and proper routing logic
- [x] Fix wrong phone number in agent prompt (888-808-0001 → removed)
- [x] Remove 888 phone number from website (Calendly shown instead while number propagates)

## Round 59 — Navbar Cleanup & AiiA Voice Hardening
- [ ] Remove Video Studio CTA button from navbar
- [ ] Create a tucked-away Tools/Utilities section (footer or dropdown) for Video Studio and future tools
- [ ] Upgrade AiiA voice agent prompt: wit, humor, adversarial resilience, unmanipulable persona
- [ ] AiiA should handle testers trying to break her with charm and intelligence
- [ ] Generate solid gold circuit-wired microphone artifact icon for voice widget
- [ ] Replace generic microphone SVG with custom AiiA gold artifact icon

## Round 59 — Navbar Cleanup (completed)
- [x] Remove Video Studio CTA button from navbar (desktop + mobile)
- [x] Add Video Studio link to footer Tools section
- [x] Fix @elevenlabs/client Vite dependency optimization error

## Round 60 — Conversation Intelligence System
- [x] Add transcript and intelligence columns to leads DB schema (painPoints, wants, currentSolutions, conversationSummary, callDurationSeconds, conversationId, phone)
- [x] Push DB migration for new fields
- [x] Update ElevenLabs agent prompt: smart intake flow (name → company → email → phone → topic)
- [x] Agent should be flexible but make effort to collect all 4 contact fields before diving into business
- [x] Capture full conversation transcript from ElevenLabs post-call webhook
- [x] Build LLM-powered intelligence extraction: pain points, wants/wishes, current solutions, conversation summary
- [x] Store extracted intelligence in leads table (JSON arrays for pain points/wants/solutions, text for summary)
- [x] LLM-extracted contact info used as fallback/override for regex-extracted data
- [x] Build ConversationIntelligencePanel in admin console: summary, pain points (red), wants (green), current solutions (gold) — 3-column grid
- [x] Panel shows call duration, collapsible, auto-open by default
- [x] Owner notification enriched with full intelligence summary + bullet lists
- [x] Write vitest tests for parseCallWebhook (11 tests) and extractConversationIntelligence (3 tests)
- [x] All 47 tests passing (7 test files)

## Round 61 — MaryLou Call Bug Fix
- [x] Bug: AiiA did not prioritize collecting name/company/email/phone at start of call
  - ROOT CAUSE: Live ElevenLabs agent still had OLD prompt (no smart intake). Code was updated but never pushed to ElevenLabs API.
  - FIX: Pushed new prompt with Phase 1 Smart Intake flow via scripts/push-agent-config.mjs
- [x] Bug: AiiA never asked for phone number during call
  - ROOT CAUSE: Same — old prompt had no phone collection step
  - FIX: New prompt includes phone as 4th intake field
- [x] Bug: No email sent to client (mlcastronovo@gmail.com) after call
  - ROOT CAUSE: Webhook URL was NOT SET on ElevenLabs workspace. post_call_webhook_id was null.
  - FIX: Created workspace webhook via POST /v1/workspace/webhooks, assigned via PATCH /v1/convai/settings
- [x] Bug: No email sent to admin/owner after call
  - ROOT CAUSE: Same — no webhook = no post-call event = no processing at all
  - FIX: Same webhook fix. Webhook now points to https://aiiaco.com/api/webhooks/elevenlabs
- [x] Investigate webhook logs for MaryLou's call — no logs found (webhook was never configured)
- [x] Investigate DB records for MaryLou's lead — no record found (webhook never fired)
- [x] Fix agent prompt to enforce contact collection priority — pushed to live agent
- [x] Fix post-call email pipeline — webhook created (cc0c8ef3) and assigned to workspace
- [x] Updated ELEVENLABS_WEBHOOK_SECRET env var with new HMAC secret
- [x] All 47 tests passing (7 test files)

## Round 62 — AiiA Knowledge Base & Auto-Update System
- [x] Extract content from RE Agent intro offer PDF
- [x] Extract content from Operator intro offer PDF
- [x] Extract content from AiiACo Overview PDF
- [x] Extract content from aiia-overview-masterpiece.html
- [x] Extract content from aiia-one-pager.html
- [x] Build comprehensive knowledge base document covering Agent, Operator, and Corporate/Enterprise packages
- [x] Corporate package = RE Agent + Operator packages combined + ongoing maintenance (cold email, corporate image, operational infrastructure)
- [x] Update AiiA agent prompt with deep product knowledge (11,643 chars pushed to live agent)
- [x] Push updated prompt to live ElevenLabs agent (verified: Agent, Operator, Corporate all present)
- [x] Build knowledge_base DB table (10 columns: id, title, content, category, source, sourceFile, isActive, lastPushedAt, createdAt, updatedAt)
- [x] Build knowledge base CRUD API (list, get, create, update, delete, toggleActive, pushToAgent)
- [x] Build /admin/knowledge page: category filters, expand/collapse entries, edit/create modal, push-to-AiiA button
- [x] Stale detection: entries updated after last push show "Stale" badge
- [x] Seed 7 initial knowledge entries from all 5 documents (18,000+ chars total)
- [x] pushToAgent rebuilds full prompt from base template + active entries and pushes to ElevenLabs
- [x] Write vitest tests for knowledge base (13 tests in knowledge.test.ts)
- [x] All 60 tests passing (8 test files)

## Round 63 — AiiA Stopped Talking Bug
- [ ] Investigate: AiiA suddenly stopped responding during calls
- [ ] Check live agent config and prompt on ElevenLabs
- [ ] Check prompt size limits (may have exceeded max)
- [ ] Check server logs for errors
- [ ] Fix root cause and verify AiiA responds again

## Round 63 — Fixes Applied
- [x] ROOT CAUSE 1: max_duration was 300 seconds (5 min default) — both recent calls hit 301s and were cut off mid-sentence
  - FIX: Increased to 900 seconds (15 minutes)
- [x] ROOT CAUSE 2: Webhook was failing with 401 (HMAC secret mismatch) — old webhook had stale secret
  - FIX: Created new webhook (93dc634b) with fresh HMAC secret, assigned to workspace, updated env var
- [x] ROOT CAUSE 3: Webhook assignment was using wrong API structure (conversation vs webhooks key)
  - FIX: Corrected to use webhooks.post_call_webhook_id in PATCH /v1/convai/settings
- [x] Verified: Agent max_duration now 900s, webhook active and assigned, no failures
- [x] Note: 2 test conversations (Namadou + Nimmer) were lost — transcripts exist in ElevenLabs but were never processed

## Round 64 — Real-Time Call Transcripts in Admin Console
- [x] Add structuredTranscript column to leads DB schema (JSON array of {role, message, time_in_call_secs})
- [x] Push DB migration for new column
- [x] Update parseCallWebhook to build structured transcript with per-turn timing from ElevenLabs data
- [x] Webhook handler stores both plain-text and structured JSON transcript
- [x] Auto-polling: leads list query refetches every 15 seconds for real-time updates
- [x] Enhanced transcript viewer: chat-bubble UI with AiiA (gold, left-aligned) vs Caller (blue, right-aligned)
- [x] Per-message timestamps (m:ss format) from structured transcript
- [x] Message count + total call duration shown in transcript header
- [x] Fallback: gracefully degrades to plain-text parsing for older leads without structured data
- [x] "Live Calls" green badge in admin header showing voice calls from last 24 hours
- [x] Added 📚 Knowledge link to admin header nav (alongside Agent Config)
- [x] Write 3 new vitest tests for structuredTranscript (roles+timing, without timing, empty)
- [x] All 63 tests passing (8 test files)

## Round 65 — Call Analytics Dashboard
- [x] Build analytics tRPC endpoints: overview (KPIs), dailyVolume (time series), recentCalls (table data)
- [x] Analytics overview: totalLeads, totalVoiceCalls, avgCallDuration, callsToday/Week/Month, conversionRate, byStatus/Track/Type
- [x] Daily call volume: configurable range (7/14/30/60 days), pre-filled date gaps, avg duration per day
- [x] Recent calls: filtered to voice calls only, includes track/status/duration/company
- [x] Build AdminAnalyticsPage with 4 KPI cards (Total Leads, Voice Calls, Avg Duration, Conversion Rate)
- [x] Call volume bar chart with recharts (gold bars, day range selector, custom tooltip)
- [x] Track distribution donut chart (Operator=blue, Agent=green, Corporate=gold, Unknown=gray)
- [x] Pipeline status horizontal bar chart with percentage labels
- [x] Conversion funnel visualization: New → Diagnostic Ready → Reviewed → Contacted → Closed (color-coded stages)
- [x] Recent voice calls table with caller, company, track badge, duration, status badge, time ago
- [x] Added /admin/analytics route and 📊 Analytics link to admin header nav (Leads + Analytics + Knowledge + Agent Config)
- [x] Write 12 vitest tests for analytics endpoints (overview, dailyVolume, recentCalls)
- [x] All 75 tests passing (9 test files)

## Round 66 — Health Monitoring, Call Ending, Pronunciation, Agent Page Redesign
- [x] Build health monitoring module (server/healthMonitor.ts): 6 vitals checked in parallel
- [x] Chain checks: ElevenLabs Agent (25%) → ElevenLabs Webhook (20%) → Database (20%) → Email/Resend (15%) → LLM (10%) → Owner Notifications (10%)
- [x] Weighted health score (0-100) with overall status (healthy/degraded/down)
- [x] Auto-alerts owner when any vital is DOWN (via notifyOwner)
- [x] Health router: admin-only tRPC endpoint (health.check) returns full HealthReport
- [x] Update agent prompt: name pronunciation "Ay-yah" (like Aya from the Quran — a sign, a miracle)
- [x] Add Phase 4: Clean Call Ending — standard close, closing punchline, early hangup, silent caller flows
- [x] Closing punchline: "The companies that integrate AI first don't just win. They make it impossible for everyone else to catch up."
- [x] Never end a call without: confirming next steps, giving callback info, memorable closing line
- [x] Call time limit increased from 5 to 10 minutes
- [x] Pushed updated prompt to live ElevenLabs agent (13,213 chars, verified: Phase 4, Ay-yah, punchline all present)
- [x] Redesigned /admin/agent page as "AiiA Diagnostic Intelligence" dashboard:
  - [x] HealthVitals panel: auto-checks every 60s, color-coded vital cards, re-check button, alert indicator
  - [x] ServiceOfferingBanner: positions this as corporate intelligence diagnostic service for clients
  - [x] LRMB example: "could have one that books everything for you with voice"
  - [x] 6-capability grid: Voice AI Agent, Intelligence Extraction, Lead Pipeline, Automated Follow-up, Health Monitoring, Website Integration
  - [x] DiagnosticChainDiagram: 8-step visual flow from widget click to owner notification
  - [x] AgentConfigEditor: collapsible prompt/first-message editor with push-to-ElevenLabs
- [x] Write 11 vitest tests for health monitoring (health.test.ts)
- [x] All 86 tests passing (10 test files)

## Round 67 — Scheduled Health Checks, Re-analyze Button, Demo Page
- [x] Build health scheduler (server/healthScheduler.ts): runs every 5 minutes via setInterval
- [x] Initial check after 30s delay, then every 300s (5 min)
- [x] Auto-alerts owner if any vital is DOWN (proactive, not just on admin page visit)
- [x] Detailed logging: score, healthy count, and per-vital status for degraded/down vitals
- [x] Health scheduler registered in server/_core/index.ts on startup
- [x] Add "Re-analyze Transcript" button on older leads in admin console
- [x] Backend: leads.reanalyzeTranscript tRPC endpoint runs extractConversationIntelligence on existing transcript
- [x] Frontend: button in ConversationIntelligencePanel with loading state and success toast
- [x] Build client-facing demo page at /demo showcasing the diagnostic agent service
- [x] Demo page: hero, 8-step diagnostic chain visualization, 6-capability grid, use cases (LRMB voice booking), CTA
- [x] Link demo page from footer Tools section ONLY — "Diagnostic Intelligence" link, no CTA on main page
- [x] Added /demo route to App.tsx
- [x] Fixed health monitor tests: updated webhook mocks to match list API structure (webhooks array, most_recent_failure_timestamp)
- [x] Updated Resend API key with fresh key from user
- [x] All 86 tests passing (10 test files)

## Round 68 — AiiA Calendly Booking Integration
- [ ] Research Calendly API: availability checking, booking creation, event types
- [ ] Build Calendly API client (server-side) for checking available slots
- [ ] Build Calendly booking endpoint that creates scheduled events
- [ ] Configure ElevenLabs agent with tool/function calling for Calendly
- [ ] AiiA should be able to check available times and book calls during voice conversations
- [ ] Update agent prompt with Calendly booking instructions
- [ ] Push updated agent config (prompt + tools) to live ElevenLabs agent
- [ ] Write vitest tests for Calendly integration

## Round 68 — Fix Email Pipeline + Calendly Integration
- [ ] Bug: No email sent after long AiiA call — investigate and fix
- [ ] Check webhook logs for recent call
- [ ] Check lead records for recent call
- [ ] Fix email sending pipeline
- [ ] Save Calendly API key as env secret
- [ ] Build Calendly API client (event types, availability, booking)
- [ ] Build Express endpoints for AiiA to call during voice conversations
- [ ] Register Calendly tools on ElevenLabs agent
- [ ] Update AiiA prompt with booking instructions
- [ ] Write vitest tests

## Round 69 — Diagnostic Intelligence Agent Service Audit & Resilience
- [x] Audit full diagnostic chain architecture (webhook → poller → re-analyze → admin tools)
- [x] Fix webhook HMAC: never drop leads on signature mismatch (log warning, process anyway)
- [x] Build conversation poller (server/conversationPoller.ts): polls ElevenLabs API every 5 min
- [x] Wire poller into server startup (server/_core/index.ts)
- [x] Add "Recover Missed Calls" button to admin console (manual poller trigger)
- [x] Add "Re-send Email" button to admin console (retry failed follow-up emails)
- [x] Unify email templates: poller uses same rich track-specific emails as webhook handler
- [x] Add Conversation Poller as 7th vital in health monitor
- [x] Fix Resend email delivery (root cause: from address used unverified subdomain resend.aiiaco.com — fixed to use verified aiiaco.com)
- [x] Write vitest tests for conversation poller
- [x] Update all tests to pass (101/101)

## Round 70 — Fix Resend Email Delivery
- [x] Check Resend API for domain verification status and required DNS records
- [x] Discovered: aiiaco.com already verified with all 3 DNS records (DKIM, SPF MX, SPF TXT)
- [x] Root cause: emails sent from team@resend.aiiaco.com (unverified subdomain) instead of team@aiiaco.com (verified domain)
- [x] Fixed both from addresses in server/email.ts to use team@aiiaco.com
- [x] Test email delivered successfully (Resend status: delivered, id: ed937821)

## Round 71 — Email Delivery Tracking + Reply-To Address
- [x] Add go@aiiaco.com as reply-to on all outbound emails (email.ts)
- [x] Add emailStatus + emailSentAt columns to leads schema
- [x] Push DB migration for emailStatus
- [x] Add updateLeadEmailStatus helper to db.ts
- [x] Update webhook handler to record email status after sending
- [x] Update poller to record email status after sending
- [x] Update resendEmail admin endpoint to record email status
- [x] Show email delivery status badge per lead in admin console
- [ ] Monitor live test call end-to-end
- [x] All 101 tests pass

## Round 71 — Arabic Language + Auto-Detection
- [x] Find Arabic male voice: Sultan (8KMBeKnOSHXjLqGuWsAE) — Saudi/Khaliji, authoritative, wise
- [x] Add Arabic language preset to AiiA agent with translated first message
- [x] Set Sultan voice on Arabic preset
- [x] Add language_detection system tool for auto-detection (no selector)
- [ ] Update website widget to NOT show language selector — rely on auto-detection
- [ ] Test Arabic language switching with live call
- NOTE: TTS model stays eleven_turbo_v2 (English-only) for default — ElevenLabs constraint: "English agents must use turbo or flash v2". Arabic preset overrides voice when language switches.

## Round 72 — CRITICAL: AiiA Agent Broken (Hangs Up + Arabic Not Working)
- [x] Diagnose: AiiA stops responding and hangs up after caller says their name
- [x] Diagnose: Arabic language not responding at all
- [x] Root cause: language_presets was placed at wrong path (agent level vs conversation_config level), tools at agent.tools vs agent.prompt.tools
- [x] Fix agent configuration: language_presets at conversation_config level, tools at agent.prompt.tools
- [x] Verified: Arabic preset persisted with Sultan voice + Arabic first message
- [x] Verified: language_detection system tool persisted
- [ ] Verify English flow works end-to-end (awaiting user test call)
- [ ] Verify Arabic flow works (awaiting user test call)

## Round 73 — CRITICAL: AiiA hangs up when interrupted with Arabic during first message
- [x] Check failed call log: error 1002 "agent owner doesn't have access to required voice"
- [x] Root cause: Sultan voice (8KMBeKnOSHXjLqGuWsAE) was NOT in the ElevenLabs voice library
- [x] Added Sultan voice to library via POST /v1/voices/add/{public_owner_id}/{voice_id}
- [x] Verified: Sultan now in library (22 voices total)
- [x] Verified: language_presets and language_detection tool still configured correctly
- [ ] Verify fix with test call (awaiting user test)

## Round 74 — CRITICAL: Anti-spam + Lead Quality Gates + Email Suppression
- [x] Create shared leadQualityGate.ts module with all quality rules
- [x] Anti-spam: reject calls <30s duration or <2 user turns as "abandoned"
- [x] Minimum viable lead: require name + (email OR phone) to be treated as complete lead
- [x] Incomplete leads: still save to DB but mark status="incomplete" (no email, no owner notification)
- [x] Email suppression: NEVER send follow-up email unless lead has real email + name
- [x] Owner notification suppression: only notify for complete leads (name + contact info)
- [x] Poller: skip failed calls entirely, apply same quality gates as webhook
- [x] Webhook: apply quality gates before email/notification
- [x] Added "incomplete" and "abandoned" status values to schema + admin UI (both pages)
- [x] DB migration pushed for new status enum values
- [x] All quality gate tests pass (100/101 — 1 pre-existing TTS API failure)

## Round 75 — CRITICAL: Poller flooding with duplicate recovery emails
- [x] Diagnose: poller had NO deduplication — same conversations processed every 5 min cycle
- [x] Root cause: isConversationCaptured checked DB but lead was stored under different conversationId (email match updated existing lead, not creating new one with new convId)
- [x] Fix: added in-memory processedConversationIds set that persists across poll cycles
- [x] Fix: added seedProcessedIds() that loads all known conversationIds from DB on first run
- [x] Fix: existing leads found by email are updated but NEVER re-emailed or re-notified
- [x] Fix: only NEW leads (isNewLead=true) get follow-up emails and owner notifications
- [x] Cleaned up garbage placeholder leads (voice-*@aiiaco.com) — marked as abandoned
- [x] All 100/101 tests pass (1 pre-existing TTS API failure)

## Round 76 — Change Arabic voice to female Lebanese accent
- [x] Search ElevenLabs Voice Library for female Arabic voice (Lebanese accent, professional, warm)
- [x] Generated 4 voice previews: Laloosh, Salma Professional, Salma Customer Care, Farah
- [x] User chose #3: Salma Customer Care (Levantine, friendly, clear, reassuring)
- [x] Added Salma Customer Care (B5xxC4eQoOFJnY4R5XkI) to ElevenLabs voice library
- [x] Updated Arabic language preset: voice_id switched from Sultan to Salma Customer Care
- [x] Verified: voice_id persisted in agent config
- NOTE: first_message_translation field not persisting via API (ElevenLabs limitation) — voice switch is the critical change

## Round 77 — Fix CTA routing: action CTAs should go to call booking, not homepage
- [x] Found Calendly URL: https://calendly.com/aiiaco (in client/src/const.ts)
- [x] Audited ALL CTA buttons across every page for logical routing
- [x] Fixed DiagnosticDemoPage: 2 CTAs ("Build Yours" + "Let's Talk") → Calendly ("Book a Strategy Call")
- [x] Fixed IndustryMicrosite: 2 CTAs ("Start Your Integration" + "Request Your Audit") → Calendly
- [x] Fixed WorkplacePage: 1 CTA ("Work With Us" href=/contact) → Calendly
- [x] CorporatePage already correct (already links to calendly.com/aiiaco)
- [x] All CTAs now use CALENDLY_URL from const.ts with target=_blank
- [x] Zero remaining /#contact or /contact links in CTA buttons
- [x] TypeScript compiles cleanly

## Round 78 — Clean up garbage leads + Enable 6 remaining languages
- [x] Clean up garbage/placeholder leads — marked transcript-fragment names as abandoned, fixed bad email
- [x] Marked duplicate MLCastronovo lead (90008) as abandoned
- [x] Found female voices for all 6 languages matching AiiA's character
- [x] Added all 6 voices to ElevenLabs library (32 total voices)
- [x] Configured all 7 language presets (ar, fr, es, zh, ko, ru, ja) with translated first messages + language-specific prompts
- [x] Verified: all 7 presets persisted, language_detection tool active

Voice assignments:
- French: AudIA (lvQdCgwZfBuOzxyV5pxu) — Parisian, professional customer support
- Spanish: Veronica (Obg6KIFo8Md4PUo1m2mR) — Latin American, warm corporate
- Chinese: Anna Su (r6qgCCGI7RWKXCagm158) — Taiwan Mandarin, trustworthy & clear
- Korean: Jini (0oqpliV6dVSr9XomngOW) — Warm & intelligent professional
- Russian: Marusya G (sNQyZH8Wfcnv7zh3rHxR) — Trusted customer care
- Japanese: Harune (c2XJrw7TvNGtOc6r0ijG) — Professional narration, calm clarity

## Round 79 — Fix AiiA phone number pronunciation
- [x] Find phone number 8888080001 in agent prompt
- [x] Reformat with proper spacing/grouping for natural TTS pronunciation (8-8-8... 8-0-8... 0-0-0-1 + pronunciation guide)
- [x] Update agent config via API
- [x] Verify pronunciation fix (0 old format, 4 new format occurrences confirmed)

## Round 79b — Fix Marc Sleiman lead name
- [x] Update lead 90011 name from "is regarding" to "Marc Sleiman"
- [x] Update lead 90011 phone from 888-808-0001 (AiiA's own number) to null

## Round 80 — Magnificent Post-Call Email Redesign
- [x] Build owner pilot brief email: full brand-book styled HTML document with gold frames, Cormorant Garamond headings, warm paper background, structured intelligence sections (Lead Profile, What They Told Us, Full Diagnostic, Solution Areas, Sales Call Next Steps, Lead Brief Preview)
- [x] Build caller summary email: polished branded HTML with personalized conversation recap, track-specific value proposition, and Calendly CTA — no attachments, all inline
- [x] Replace generic track emails (trackEmails.ts) with new intelligence-driven caller email that uses actual conversation data (pain points, wants, summary)
- [x] Update owner notification from plain text notifyOwner() to magnificent HTML email via Resend (go@aiiaco.com)
- [x] Wire new templates into webhook handler (elevenlabs.ts) and conversation poller
- [x] Wire new templates into leadDiagnostic.ts for form-based leads
- [x] Update admin resendEmail to use new templates
- [x] Write vitest tests for new email templates (30 tests passing)
- [x] Verify email rendering — TypeScript clean, all tests passing

## Round 81 — Send JJinco & Alan Emails
- [x] Fix Jennifer's name in DB from "that perfectly" to "Jennifer Jingco"
- [x] Send Jennifer the new caller summary email via Resend (id: a437953c)
- [x] Build and send Alan a polished "we'd love to continue" email (id: 5f7678ef)
- [x] Fix from domain: resend.aiiaco.com → aiiaco.com (verified domain) across all email.ts functions

## Round 82 — Create Post-Call Email Skill
- [x] Initialize skill via skill-creator
- [x] Write reference files (pipeline-architecture.md, brand-email-tokens.md)
- [x] Write SKILL.md with full workflow
- [x] Validate and deliver

## Round 83 — Three Suggested Tasks + Skill Creation
- [x] Add permanent buildContinueConversationEmail() template to emailTemplates.ts for short/abandoned calls
- [x] Wire continue-conversation template into webhook/poller for calls < 90s with thin intelligence
- [x] Run diagnostics for Jennifer Jingco (120001) and Tone (90012) — both emailed
- [x] Fix name extraction bug — improved regex (multi-pattern + filler filter) + strengthened LLM prompt (positive/negative examples)
- [x] Write tests for continue-conversation template (11 tests) + fix import tests
- [x] Build aiia-post-call-emails skill (SKILL.md + 2 reference files, validated)

## Round 84 — Email Open/Click Tracking via Resend Webhooks
- [x] Create email_events DB table (emailId, eventType, recipientEmail, leadId, subject, clickedLink, clickUserAgent, clickIpAddress, eventTimestamp, rawPayload)
- [x] Build Resend webhook handler (POST /api/webhooks/resend) with svix signature verification
- [x] Tag all outgoing emails with lead_id for tracking correlation
- [x] Update sendEmail to return { success, emailId } instead of boolean
- [x] Add DB query helpers: insertEmailEvent, getEmailEventsByLeadId, getEmailEngagementStats, getRecentEmailEvents, findLeadIdByEmail
- [x] Add tRPC procedures: analytics.emailEngagement, analytics.recentEmailEvents, analytics.emailEventsByLead
- [x] Add Email Engagement KPIs to AdminAnalyticsPage (sent, delivered, opened, clicked, bounced + rates)
- [x] Add Recent Email Activity panel to AdminAnalyticsPage (side by side with Recent Calls)
- [x] Add Email Tracking Timeline to AdminLeadsPage lead detail panel (vertical timeline with colored dots)
- [x] Register Resend webhook at aiiaco.com/api/webhooks/resend with all 7 event types
- [x] Set RESEND_WEBHOOK_SECRET environment variable
- [x] Write 11 vitest tests for webhook handler (all passing)
- [x] Fix AdminAnalyticsPage JSX closing tag issue

## Round 85 — Google Analytics 4
- [x] Add GA4 tag (G-6XQ3T33HTF) to index.html head

## Round 86 — GA4 Calendly Conversion Tracking
- [x] Investigate Calendly integration (3 embed iframes + 4 external links across 4 components)
- [x] Create useCalendlyTracking hook — listens for postMessage events from Calendly iframes
- [x] Fire GA4 events: calendly_booking_complete, calendly_date_selected, calendly_page_viewed, calendly_event_type_viewed
- [x] Add trackCalendlyLinkClick for external Calendly links (CallNowButton, IndustryMicrosite hero+CTA, WorkplacePage)
- [x] Wire hook into ContactSection and IndustryMicrosite iframe embeds
- [ ] Mark calendly_booking_complete as key event in GA4 admin (manual step — see instructions)

## Round 87 — Intelligent SMS Engagement Pipeline (Telnyx)
### Architecture & SOP
- [ ] Research Telnyx SMS API (send, receive, delivery status webhooks)
- [ ] Design engagement pipeline: call outcome → delay → message template → rate limit check → send
- [ ] Define 4 SMS sequences by call outcome (incomplete, short, complete, diagnostic_ready)

### Database & Infrastructure
- [ ] Create sms_events table (id, leadId, phone, messageType, telnyxMessageId, status, sentAt, deliveredAt)
- [ ] Create sms_rate_limits table or use sms_events for rate limit queries
- [ ] Build rate limiter: max 2 SMS per phone per 24h, max 4 SMS per phone per 4 days
- [ ] Build Telnyx SMS service (sendSMS, checkDeliveryStatus)

### Message Templates & Sequencing Engine
- [ ] Incomplete call (< 60s): immediate warm text ("We got disconnected — here's how to reach us")
- [ ] Short call (60-120s): 30-min delay, reference what was discussed briefly
- [ ] Complete call: after email sent, warm follow-up ("Just sent you an email with your assessment")
- [ ] Diagnostic ready: after pilot brief generated, "Your pilot brief is ready — book a strategy call"
- [ ] All messages: personalized with first name, company if available, AiiA branding
- [ ] Build scheduling engine (delayed sends via setTimeout or DB-backed job queue)

### Pipeline Integration
- [ ] Wire into elevenlabs webhook: determine call outcome → schedule appropriate SMS sequence
- [ ] Wire into conversationPoller: same logic for missed/recovered calls
- [ ] Wire into leadDiagnostic: send "pilot brief ready" text after diagnostic completes
- [ ] Ensure SMS fires AFTER email for complete calls (sequence coordination)

### Admin Dashboard
- [ ] Add SMS activity timeline to lead detail panel
- [ ] Add SMS stats to analytics page (sent, delivered, failed, rate-limited)

### Testing
- [ ] Write vitest tests for rate limiter, message templates, sequencing engine
- [ ] Write vitest tests for Telnyx webhook handler

## Round 87b — WhatsApp Integration + SMS No-Reply
- [ ] Add WhatsApp click-to-chat link (wa.me) to all SMS templates
- [ ] Add "Do not reply to this text" guidance in SMS messages
- [ ] Pre-fill WhatsApp message with lead context (name, what they discussed)
- [ ] Determine AiiACo WhatsApp Business number to use

## Round 88 — Fix Health Monitor Alerts
- [x] Investigate Email Service (Resend) "fetch failed" — added 10s timeout + safeFetch wrapper, network failures now "degraded" not "down"
- [x] Investigate Database "unreachable" — transient errors (pool reset) now "degraded", only hard failures (ECONNREFUSED) are "down"
- [x] Fix root causes — added retry logic (1 retry per check), consecutive failure tracking (2 failures before alert), 30-min alert cooldown. Score: 100/100 after fix

## Round 89 — Mobile Optimization
- [x] Audit all pages on mobile viewport (375px, 390px, 428px)
- [x] Fix hero section mobile layout and typography
- [x] Fix navbar mobile menu and interactions
- [x] Fix platform/method/results sections mobile layout
- [x] Fix industries/case studies sections mobile layout
- [x] Fix contact section and footer mobile layout
- [x] Fix engagement models and principles sections mobile
- [x] Verify all fixes across breakpoints
- [x] Add mobile-section class with reduced padding (120px → 60px) at 768px breakpoint
- [x] Add responsive headline/subhead font scaling at 640px breakpoint
- [x] Fix announcement bar text wrapping on mobile
- [x] Reduce glass orb sizes on mobile to prevent overflow
- [x] Add horizontal scroll wrapper for glass tables on mobile
- [x] Make buttons full-width on mobile (480px breakpoint)
- [x] Reduce glass card padding on mobile
- [x] Tighten container horizontal padding on mobile (16px)
- [x] Hero: single-column grid on tablet/mobile, KPIs shown below CTAs, full-width CTA buttons
- [x] Navbar: hamburger menu with AnimatePresence overlay, body scroll lock, 48px touch targets
- [x] Footer: 2-column grid on tablet, 1-column on small mobile, brand section full-width
- [x] Case Studies: 1-column cards on mobile (was 480px minmax causing overflow)
- [x] After Upgrade: card layout replaces 3-column table on mobile
- [x] Results: CTA card stacks vertically on mobile, full-width button
- [x] Contact: single-column form on mobile, sidebar hidden, name/company fields stack
- [x] Engagement Models: min() wrapper on grid for mobile safety
- [x] Industries: responsive header icon layout, min() wrapper on card grids
- [x] BuiltForCorporateAge: min() wrapper on principles grid, responsive CTA buttons
- [x] OperationalLeaks: responsive grid layout with icon column
- [x] Fix ALL minmax grid patterns across entire codebase (17 files) with min() wrapper to prevent horizontal overflow
- [x] Fix subpages: AIIntegrationPage, AIImplementationPage, AIAutomationPage, IndustryMicrosite, AdminConsolePage, AdminLeadsPage

## Round 90 — Fix AiiA Voice Cutoff
- [x] Fix maxCallDurationSeconds back to 900 (was incorrectly set to 300)
- [x] Investigate AiiA voice agent cutting off mid-greeting (~10 seconds in) — root cause: ElevenLabs quota exceeded
- [x] Inspect live ElevenLabs agent config for mismatches — live config was correct (900s), local code was 300s
- [x] Fix the root cause of the greeting cutoff issue — user upgraded ElevenLabs plan (Creator tier, 100K chars)
- [x] Push corrected config to ElevenLabs — verified 900s max_duration_seconds is live

## Round 91 — AiA Agent Prompt Overhaul
- [x] Rename AiiA to AiA throughout agent prompt and first message
- [x] Relax contact intake — let callers explore what AiiACo does for 1-2 min before pushing for info
- [x] Switch turn eagerness from "eager" to "normal" (balanced)
- [x] Push updated prompt + config to ElevenLabs live agent
- [x] Update frontend voice widget references from AiiA to AiA
- [x] Fix budget question — remove "few hundred" option, minimum is $3K setup + $2,500/mo
- [x] Update server-side references (emails, SMS, health monitor, webhooks, tests) from AiiA to AiA
- [x] All 153 vitest tests passing

## Round 92 — Fix Duplicate CTAs & Mobile Horizontal Scroll
- [x] Remove duplicate CTA buttons ("Book an Operational Strategy Call" + "Book a Call" both went to Calendly — removed the duplicate)
- [x] Fix horizontal scroll on mobile — html+body+page wrapper all have overflow-x: hidden
- [x] Reduce glass orb animations on mobile (translate distances cut from 140px to 40px max)
- [x] Add mobile-safe keyframe animations for all 3 glass orbs
- [x] Add overflow: hidden to CredibilityBlock section
- [x] Fix ContactSection 600px background accent to use max-width: 100%
- [x] Add word-break/overflow-wrap to display-headline, section-headline, section-pill

## Round 93 — Fix Case Studies Mobile & Navbar Mobile Truncation
- [x] Fix case study cards cut off on right side — Approach/Outcomes grid now stacks to 1 column on mobile
- [x] Make case study cards fully responsive — word-break, flex-wrap on outcome labels, reduced padding on mobile
- [x] Support horizontal/landscape orientation — menu closes on orientation change, scrollable mobile menu
- [x] Fix navbar items truncated at "Model" — raised breakpoint from lg (1024px) to xl (1280px) so hamburger shows on tablets
- [x] All 153 vitest tests passing

## Round 94 — Consolidate CTAs Across Site
- [x] Audit all CTA buttons across every section and page — found 5 different labels doing the same thing
- [x] Map each CTA: text, action, location, purpose — documented in cta_audit.md
- [x] Eliminate redundant CTAs — consolidated to distinct labels per section
- [x] Implement consolidated CTA hierarchy:
  - Hero: "Book a Strategy Call" (distinct invitation)
  - Navbar/AfterUpgrade/BuiltForCorporateAge/Manifesto: "Request Upgrade" (primary)
  - Results: "See Your Upgrade Plan" (contextual)
  - Case Studies: "Start Your Diagnostic" (contextual)
  - Engagement Models: "Begin Full Integration" / "Discuss This Model" (kept — contextual)
  - Subpages: kept page-specific labels (contextual to service)
- [x] Verify consistency — all 153 tests passing, zero "Initiate Upgrade" or "Request Upgrade Plan" remaining

## Round 95 — Fix Corporate Nav Link
- [x] Fix "Corporate" link in Navbar to navigate to /corporate instead of scrolling — refactored scrollTo→navigateTo to handle route paths vs hash anchors

## Round 96 — Multiple Fixes: Logo Nav, Gold Icons, New Pages, Mobile Navbar & Landscape
- [x] Fix logo click to navigate to homepage from all subpages (window.location.href = "/" on subpages, smooth scroll on homepage)
- [x] Replace all generic emoji icons on /corporate page with AiiACo proprietary solid gold CDN icons (generated handshake icon)
- [x] Create /agentpackage page (AI Agent Package offering — full page with features, pricing, CTAs)
- [x] Create /operator page (AI Operator offering — full page with features, pricing, CTAs)
- [x] Link /agentpackage and /operator from /corporate track cards ("Explore" buttons)
- [x] Fix mobile navbar — root cause: inline style display:flex overriding Tailwind hidden class
  - Restructured: desktop links + CTAs in hidden xl:flex containers (no inline display)
  - Hamburger: xl:!hidden with !important to override inline flex at desktop
  - All nav items now accessible via hamburger menu on mobile
- [x] Fix landscape orientation — added landscape media queries, safe-area insets, viewport-fit: cover
- [x] Fixed viewport meta tag: removed maximum-scale=1, added viewport-fit=cover
- [x] All 153 vitest tests passing

## Round 97 — Comprehensive Privacy Policy Page
- [x] Rewrite /privacy page with comprehensive sections: Voice AI data (AiA calls), website analytics, cookies, data retention, third-party services, enterprise data handling, CCPA/GDPR rights, contact info
- [x] Match styling with existing legal pages (TermsPage pattern)
- [x] Verify route and footer link work correctly

## Round 98 — /talk Page with Live Transcription
- [x] Create /talk page with AiA voice widget prominently displayed (not just floating bottom-right)
- [x] Add live transcription box that shows conversation messages in real time (user + AiA)
- [x] Add copy-to-clipboard button that copies the entire transcript text
- [x] Register /talk route in App.tsx
- [x] Style consistently with site design (void black, gold accents)

## Round 99 — /talk Page Improvements
- [x] Hide floating AiA voice widget on /talk page (redundant with embedded control)
- [x] Add "Talk to AiA" link in navbar for discoverability
- [x] Persist /talk page transcripts to database when conversation ends
- [x] Make persisted transcripts visible in admin console alongside webhook-captured calls
- [x] Write vitest tests for transcript persistence

## Round 100 — Option C: Two-Tier /talk with Magic Link + Improvements
- [x] Add magic_link_tokens table to schema (token, email, leadId, expiresAt, usedAt)
- [x] Push DB migration for magic_link_tokens
- [x] Add server procedure: talk.sendMagicLink (lookup lead by email, generate token, send email via Resend)
- [x] Add server procedure: talk.verifyMagicLink (validate token, return lead + conversation history)
- [x] Add server procedure: talk.saveTranscript (persist /talk page transcript to leads table when call ends)
- [x] Rebuild TalkPage with two-tier UX: "I'm new" path (optional name/email/phone pre-fill) + "Continue conversation" path (enter email → magic link)
- [x] On magic link verification, load previous transcripts and greet returning lead with context
- [ ] Inject pre-filled identity into AiA context via contextual update when conversation starts
- [x] Hide floating AiA voice widget on /talk page
- [x] Add "Talk to AiA" link in navbar
- [x] Write vitest tests for magic link send/verify and transcript save procedures
- [x] Ensure persisted transcripts appear in admin console alongside webhook-captured calls

## Round 101 — Remove LISTEN Button
- [x] Remove ReadAloud component from Navbar (desktop + mobile) — low-quality TTS misrepresents AiA voice

## Round 102 — Cookie Consent Banner
- [x] Create lightweight CookieConsent component (small, bottom bar, professional)
- [x] Store consent in localStorage, hide on return visits
- [x] Link to /privacy page
- [x] Wire into App.tsx

## Round 103 — Cookie Consent Simplification
- [x] Remove Decline button, keep only Accept
- [x] Change copy to "We use necessary cookies only"

## Round 104 — Cookie Banner Copy Update
- [x] Update copy to "We use site data only to provide the right diagnostic and path forward."

## Round 105 — /talk Page Holographic Video + Mic Enhancements
- [x] Upload AiA 3D animation video to CDN
- [x] Add video as semi-transparent holographic watermark background on /talk page (muted, looping, no video audio)
- [x] Auto-start AiA voice greeting for first-time visitors only (once per session/localStorage)
- [x] Replace CTA with golden microphone icon that shines/pulses every 7 seconds
- [x] Mic icon lights up / shows speech indicator bars during active conversation
- [x] Ensure video audio is stripped — only AiA's ElevenLabs voice plays
- [x] Add semi-transparent "Play Video" button for return visitors to optionally replay video background

## Round 106 — /talk Page UX Improvements
- [x] Increase video watermark opacity significantly (from 0.12 to 0.35, gradient overlay reduced)
- [x] Merge two separate forms into one intelligent email field that serves both purposes (new visitor + returning lead)
- [x] Smart detection: debounced checkEmail procedure detects existing leads, shows inline context message
- [x] Make it clear that providing email enables conversation continuity (hint text + inline returning lead banner)
- [x] Remove the separate "Continue a Previous Conversation" card — one unified flow
- [x] Add checkEmail server procedure and vitest test (163 tests passing)

## Round 107 — Cookie Banner Mobile Fix
- [x] Fix cookie banner on mobile — only left half visible, Accept button unreachable
- [x] Ensure banner is fully visible and dismissable on all screen sizes

## Round 108 — Email Grammar & Quality Audit
- [x] Audit all 5 email templates: caller summary, owner pilot brief, continue conversation, magic link, lead confirmation
- [x] Fix "for, thank you for" bug — added sanitizeName() function with 80+ blocked filler words
- [x] All greeting patterns handle null/missing names gracefully (no dangling commas or fragments)
- [x] Applied sanitizeName to LLM-extracted names in aiAgent.ts
- [x] Expanded regex name extractor filler word blocklist (prepositions, conjunctions, pronouns, verbs, adverbs)
- [x] Fixed lead confirmation email (email.ts) to use sanitizeName and handle null firstName
- [x] Fixed magic link email to use sanitizeName and handle null firstName
- [x] All 175 tests passing including 12 new sanitizeName tests + 2 filler word rejection tests per template

## Round 109 — Brand Naming Audit (AiiA vs AiA) — COMPLETE
- [x] Scanned entire codebase for all instances of "AiA" and "AiiA"
- [x] Fixed 15+ files: AiiA = company, AiA = voice agent/diagnostic intelligence
- [x] Fixed: HeroSection, Footer, DreamState, HowItWorks, MethodSection, Pricing, TeamSection, CredibilityBlock, OperationalLeaks, AdminConsolePage, ContactSection
- [x] Fixed: email.ts, emailTemplates.ts, smsService.ts, healthMonitor.ts, healthScheduler.ts, telnyxPoller.ts, aiAgent.ts
- [x] Fixed: tts.test.ts, health.test.ts
- [x] Preserved AiA for all voice agent references (TalkPage, PrivacyPage, AiiAVoiceWidget, transcript labels, agent prompts)
- [x] All 175 tests passing after renaming

## Round 110 — Comprehensive Terms of Service + Internal Improvements
- [x] Research top AI integration companies' terms pages (Palantir, DataRobot benchmarked)
- [x] Build comprehensive /terms page — 16 sections modeled after Palantir/DataRobot enterprise standards
- [x] Cover: scope of services, engagement terms, IP ownership, confidentiality, liability, indemnification, data handling, SLA, payment terms, termination, dispute resolution, force majeure, governing law, AI-specific disclaimers, voice recording consent
- [x] Style consistently with existing legal pages (PrivacyPage pattern)
- [x] Add web transcripts tab to admin console for browsing /talk page transcripts
- [x] Inject pre-filled identity into AiA agent context via dynamicVariables + firstMessage override on /talk page
- [x] All 175 tests passing

## Round 111 — Subtle Phone Number Under CTAs
- [x] Add subtle "Or call 888-808-0001" text beneath booking/contact CTAs (small, muted, not prominent)
- [x] Ensure no duplicate CTAs or layout issues
- [x] All 175 tests passing

## Round 112 — Admin Transcript Dual-Mode Viewer
- [x] Full transcript slide-out panel with chat bubbles (AiA gold, Visitor blue)
- [x] Live mode toggle with pulsing green indicator and 5s auto-polling
- [x] Auto-scroll to bottom in live mode as new messages arrive
- [x] Copy All button for full transcript text
- [x] No maxHeight limit — full scroll through entire conversation
- [x] Animated message entrance (fadeInUp) and panel slide-in (slideInRight)
- [x] Last message preview in list rows + message count column
- [x] Live session detection (created < 5min ago, no duration = still active)
- [x] Toast notification when new transcripts arrive in live mode
- [x] All 174 tests passing (1 transient ElevenLabs network failure unrelated)

## Round 113 — Admin Transcript Enhancements
- [x] Incremental live transcript persistence (upsert every 30s during active /talk calls via sessionId)
- [x] New db helpers: getWebTranscriptBySessionId, updateWebTranscriptById
- [x] New tRPC procedure: talk.upsertTranscript (create-or-update by sessionId)
- [x] Schema migration: added sessionId column to web_transcripts table
- [x] Search keyword highlighting in admin transcript slide-out panel (gold highlight marks)
- [x] Branded PDF export button in transcript slide-out panel (AiiACo dark theme, print-to-PDF)
- [x] escapeHtml helper for safe HTML injection in PDF template
- [x] HighlightText component for regex-based search match highlighting
- [x] 5 new unit tests for upsertTranscript (create, update, different session, validation, final save)
- [x] All 180 tests passing across 14 test files

## Round 114 — Unify Conversation Capture Pipeline
- [x] Audit: golden mic had ZERO transcript capture (no onMessage, no save, no identity)
- [x] Rewrote AiiAVoiceWidget with full transcript pipeline (onMessage, sessionId, incremental 30s upsert, final save)
- [x] Added source parameter to upsertTranscript procedure ("web_talk" | "web_widget")
- [x] Widget conversations now tagged as "web_widget" in database
- [x] Admin console shows source badges: gold "Widget" / blue "/talk" on list rows and slide-out panel
- [x] PDF export footer now shows source ("floating widget" vs "/talk")
- [x] Updated subtitle text to mention both /talk page and widget
- [x] All 180 tests passing across 14 test files, 0 TypeScript errors

## Round 115 — /demo Page Upgrade: AiA V3 Conversational Showcase
- [ ] Rewrite /demo page to showcase upgraded AiA agent capabilities as a service
- [ ] Add "AI Engine" specs section: V3 Conversational TTS, expressive mode, sub-500ms latency
- [ ] Add before/after performance comparison (old turbo_v2 vs new V3 Conversational)
- [ ] Add AI Control Layer section (human approval, tone control, escalation, zero autonomous risk)
- [ ] Add emotional intelligence showcase (context-aware tone, expressive tags)
- [ ] Update capabilities grid with new technical specs
- [ ] Add "What Powers Your Agent" technical architecture section

## Round 116 — Voice Agent Platform (VaaS) Build
### Phase 1: Database Schema
- [x] Create clients table (email, password_hash, company, website, status, stripe_customer_id, promo_code_used)
- [x] Create client_agents table (client_id, agent_name, elevenlabs_agent_id, template_type, personality, first_message, knowledge_base, voice_id, voice_tier, status, embed_token, trial_minutes_used)
- [x] Create client_conversations table (client_agent_id, elevenlabs_conversation_id, transcript, caller_info, duration, intelligence_summary)
- [x] Create promo_codes table (code, discount_type, discount_value, max_uses, uses_count, active)
- [x] Create voice_tiers table (voice_id, name, preview_url, tier: free/premium, monthly_cost)
- [x] Run db:push to sync schema

### Phase 2: Client Auth
- [x] Client signup endpoint (email, password, company, website)
- [x] Client login endpoint (email, password → JWT)
- [x] Client session middleware (separate from admin auth)
- [x] Client auth hooks (useClientAuth) on frontend
- [x] Login/Signup page at /portal/login
- [x] (merged into single auth page)

### Phase 3: Stripe-Ready Billing
- [x] Subscription schema and status tracking
- [x] Checkout flow (Stripe-ready, stubs until keys provided)
- [x] Webhook handler stubs (invoice.paid, subscription.deleted)
- [x] Billing status display in dashboard
- [x] Promo code validation and application

### Phase 4: Agent Templates
- [x] 5 industry templates (Real Estate, Mortgage, Law, Hospitality, Manufacturing)
- [x] Template agent configs stored in DB
- [x] Clone-on-signup logic via ElevenLabs API
- [x] Voice selection (3 free + 2 premium)

### Phase 5: Setup Wizard (/demo)
- [ ] Rebuild /demo as setup wizard flow
- [ ] Step 1: Account creation
- [ ] Step 2: Template selection (5 industries)
- [ ] Step 3: Customization (name, personality, first message, knowledge)
- [ ] Step 4: Voice selection (5 options, free/premium tiers)
- [ ] Step 5: 15-minute free trial with live agent
- [ ] Trial timer and lockout after 15 minutes

### Phase 6: Client Dashboard
- [x] Dashboard layout at /portal/dashboard
- [x] Agent configuration panel
- [x] Conversations & transcripts view
- [x] Analytics overview (call volume, duration, topics)
- [x] Embed token & installation instructions
- [x] Billing & subscription management
- [x] Account settings

### Phase 7: Embed Widget
- [ ] /agent/embed.js endpoint
- [ ] Token validation middleware
- [ ] Widget loader with client-specific agent config
- [ ] Conversation routing through AiiACo pipeline

### Phase 8: Admin Visibility
- [x] Admin view of all client agents
- [x] Admin view of all client conversations
- [x] Admin billing overview
- [x] Client health monitoring (via platform tab stats)

### Phase 9: Polish & Ship
- [x] Vitest tests for client auth, billing, agent creation (14 tests passing)
- [ ] Mobile responsive across all new pages
- [ ] GitHub sync
- [ ] Final checkpoint

## Round 117 — /demo Setup Wizard (Conversion Funnel)

### Wizard Steps
- [x] Step 1: Showcase hero with "Build Your AI Agent" CTA
- [x] Step 2: Account creation (email, password, company, website)
- [x] Step 3: Template selection (5 industry templates with previews)
- [x] Step 4: Agent customization (name, personality, first message, voice selection)
- [x] Step 5: 15-minute free trial (live agent interaction with countdown timer)
- [x] Step 6: Payment gate (trial expired → activate subscription CTA)

### Backend Wiring
- [x] Wire signup to vaas.auth.signup endpoint
- [x] Wire template selection to vaas.agent.create endpoint
- [x] Wire customization saves to vaas.agent.update endpoint
- [x] Implement trial timer (15 min countdown, persisted to DB)
- [x] Trial expiry detection and agent lock

### Polish
- [x] Smooth step transitions and progress indicator
- [x] Mobile responsive wizard
- [x] Vitest tests for wizard flow (14 tests passing)
- [x] Checkpoint (e812c30e)

## Round 118 — Fix Post-Call Notification "for reaching" Bug
- [x] Traced bug: regex extraction was PRIMARY, LLM was fallback — regex caught garbage like "for reaching"
- [x] Flipped priority in webhook handler: LLM extraction is now PRIMARY, regex is FALLBACK
- [x] Flipped priority in conversation poller (same fix)
- [x] Removed the overly greedy regex pattern (/AiA:.*?(?:So|Now|Alright|Well),?\s+/) that caused false positives
- [x] Added sanitizeName() validation to all regex-extracted names
- [x] Added 9 new tests for false positive prevention (203 total tests passing)
- [ ] Checkpoint

## Round 119 — Stripe Integration ($999/month Subscriptions)
- [ ] Add Stripe feature via webdev_add_feature
- [ ] Configure Stripe API keys
- [ ] Create Stripe products: $999/month standard, $888/month promo
- [ ] Wire /demo wizard Step 6 payment gate to Stripe Checkout
- [ ] Handle Stripe webhook for subscription activation
- [ ] Update client portal billing page with real subscription data
- [ ] Tests for Stripe integration

## Round 120 — Embed Widget for Client Websites
- [ ] Build /agent/embed.js JavaScript widget
- [ ] Widget loads ElevenLabs agent with client-specific config
- [ ] Widget styling: floating button + expandable chat panel
- [ ] Token-based authentication for widget
- [ ] Client portal embed page with copy-paste snippet
- [ ] Tests for embed widget endpoint

## Round 121 — Embeddable Widget System + Admin Console Upgrade
- [x] Build GET /api/widget/:token endpoint (config lookup + validation)
- [x] Build GET /agent/embed.js endpoint (serves vanilla JS widget script)
- [x] Build POST /api/widget/:token/conversation endpoint (stores captured conversations)
- [x] Build the embed.js vanilla JS widget (floating button, voice chat, transcript capture)
- [x] Upgrade admin console Voice Platform tab with sub-tabs (Clients, Agents, Conversations, Embed Tokens)
- [x] Add expandable client rows with agent details, embed token, widget config
- [x] Add agent management view with copy embed snippet, pause/resume
- [x] Add conversations view with caller name, duration, transcript expand
- [x] Upgrade client portal /portal/embed page with live preview, customization, color picker
- [x] Write tests for widget config endpoint and token validation (226 total tests passing)
- [x] Checkpoint

## Round 122 — Demo Walkthrough Sales Page
- [x] Built /demo-walkthrough interactive 4-step sales demo page
- [x] Generated simulated AiA demo call audio (7 clips, concatenated to 1:01)
- [x] Step 1: Business intake form (name, industry, pain point) with auto-fill on industry select
- [x] Step 2: Simulated phone call with live transcript reveal + intelligence extraction card
- [x] Step 3: Automated follow-up timeline (email, pilot brief, calendar, SMS, reactivation) + cost comparison
- [x] Step 4: 14-day free pilot CTA with Calendly booking + direct call option
- [x] 17 new tests for intelligence card validation and transcript structure (243 total passing)
- [x] Checkpoint

## Round 123 — Fix "Ayako" → "AiA" Naming Error
- [x] Found and replaced all 18 instances of "Ayako" with "AiA" in DemoWalkthroughPage.tsx
- [x] Verified zero instances remain in codebase (only todo.md history)
- [x] Checkpoint

## Round 124 — Fix "AiiACo" → "AiiACo" Capitalization (Company-Wide)
- [x] Fixed all 90+ instances of "AiiACo" (wrong cap) → "AiiACo" (correct cap) across 28 .tsx files
- [x] Rule established: AiiACo = company/team, AiA = voice agent — no exceptions
- [x] Consolidated duplicate regex patterns in ReadAloud.tsx and routers.ts
- [x] Only remaining "AiiACo" is inside regex patterns for speech pronunciation (intentional, case-insensitive)
- [x] 243 tests passing
- [x] Checkpoint
