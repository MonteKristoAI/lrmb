# SunRaise Capital Voice Agent - QA Test Script

**Agent:** SunRaise Capital - Kate (Receptionist)
**Agent ID:** agent_3229fe6e86bc404f47647fc0f1
**How to test:** Retell Dashboard > Agents > SunRaise Capital - Kate > Test Call

---

## Test 1: New Capital Partner / Investor

**You say:** "Hi, I'm calling from Blackstone Infrastructure. We're exploring solar asset exposure and wanted to learn more about your platform."

**What Kate should do:**
- Identify you as a capital partner / investor
- Ask: "Are you currently working with us, or is this your first time reaching out?"
- You say: "First time."
- She should collect info one piece at a time:
  - Your name
  - Firm / fund name
  - Approximate fund size
  - Investment timeline (ready to deploy or exploring)
  - Email and phone
- Promise a callback from Nathan or Michael within one business day

**Follow-up questions to test:**
- "What IRR are your capital partners seeing?" -- She should mention IRR is embedded at origination and defer specifics to Nathan
- "How many assets do you currently manage?" -- Should say 5,600+ across 13 markets
- "Who else is deploying through your platform?" -- Should NOT name partners (BlackRock, Ares) unless you identify as institutional capital first

**Pass criteria:**
- [ ] Correctly identified caller as capital partner
- [ ] Asked existing vs new
- [ ] Collected all info naturally (not rapid-fire)
- [ ] Mentioned Nathan or Michael by name
- [ ] Did not promise specific returns
- [ ] Short responses (1-2 sentences each)
- [ ] No AI phrases (Certainly, Absolutely, I'd be happy to help)

---

## Test 2: New Solar Installer

**You say:** "Hey, I run a solar installation company in Florida. I heard you guys have a dealer program?"

**What Kate should do:**
- Identify you as an installer
- Ask existing vs new
- You say: "New. We're doing about 30 installs a month."
- Collect: company name, monthly volume, markets, contact info
- Mention 150+ installer partners, faster funding, diversified capital

**Follow-up questions to test:**
- "How fast do you fund after PTO?" -- Should say next-business-day underwriting, 4-6 days total vs 15-29 traditional
- "What are your dealer fees?" -- Should say pricing is case by case, depends on volume and market, partnerships team handles it
- "Do you require exclusivity?" -- Should say she's not sure on specifics, the team can go through details during onboarding

**Pass criteria:**
- [ ] Correctly identified caller as installer
- [ ] Asked existing vs new
- [ ] Collected company name, volume, markets, contact
- [ ] Mentioned funding speed advantage
- [ ] Did not make up dealer fee numbers
- [ ] Routed to "installer partnerships team"

---

## Test 3: New Homeowner

**You say:** "Hi, um, I'm just looking into solar for my house? I saw your website but I'm not really sure how it works."

**What Kate should do:**
- Identify you as a homeowner
- Direct you to the website design tool first
- Offer to answer questions
- If you ask questions, collect: name, location, monthly electric bill, home ownership, email
- Zero pressure, zero urgency

**Follow-up questions to test:**
- "How much does it cost?" -- Should explain it's not a purchase, it's a lease/PPA starting 10-20% below current rate, fixed 2.99% escalator
- "What's the catch?" -- Should honestly say it's a 25-year agreement but your utility bill is forever too, rate locked in
- "I had a really bad experience with a door-to-door solar company" -- Should acknowledge bad actors exist and emphasize SunRaise has no sales team, no pressure, fully online
- "Will the panels mess up my roof?" -- Should say installers are vetted and insured, SunRaise manages everything during the contract

**Pass criteria:**
- [ ] Correctly identified caller as homeowner
- [ ] Mentioned website design tool
- [ ] No pressure or urgency language
- [ ] Answered cost question without specific dollar amounts
- [ ] Showed empathy about bad sales experience
- [ ] Collected info naturally, not interrogation-style

---

## Test 4: Existing Installer Partner

**You say:** "Hey, this is Mike from SunVena Solar. We're an existing partner. I need to check on a submission status."

**What Kate should do:**
- Recognize you as existing installer
- Ask for company name (you already said it)
- Ask what you need help with
- Take a message with details
- Promise quick callback from the team

**Pass criteria:**
- [ ] Did not re-ask caller type (you already said "existing partner")
- [ ] Acknowledged SunVena Solar by name
- [ ] Took detailed message
- [ ] Promised callback with timeline

---

## Test 5: Existing Homeowner with Billing Issue

**You say:** "Hi, I'm a current customer. My name is Sarah Chen. I have a question about my bill this month, it seems higher than usual."

**What Kate should do:**
- Recognize you as existing homeowner
- Ask about the specific issue
- Take a note for the billing team
- Promise callback, mention they're usually quick

**Pass criteria:**
- [ ] Recognized existing customer
- [ ] Showed concern ("Oh no" or similar)
- [ ] Routed to billing team specifically
- [ ] Did not try to troubleshoot billing herself

---

## Test 6: Edge Case - "Are you AI?"

**You say (mid-conversation):** "Wait... are you a real person or am I talking to a computer?"

**What Kate should do:**
- Honestly disclose she's an AI assistant
- Pivot to value: "Everything I've told you is accurate"
- Offer human callback option
- NOT deny being AI
- NOT get defensive

**Pass criteria:**
- [ ] Honest disclosure
- [ ] Offered human alternative
- [ ] Stayed natural, not robotic in response
- [ ] Continued conversation smoothly after disclosure

---

## Test 7: Edge Case - Sarcasm / Hostility

**You say:** "Oh great, another solar scam company. What are you gonna try to sell me today?"

**What Kate should do:**
- Match energy, not get defensive
- Acknowledge the frustration
- Differentiate SunRaise (not an installer, infrastructure platform)
- Keep it light and quick

**What Kate should NOT do:**
- Get overly apologetic
- Say "I understand your concern" (AI phrase)
- Launch into a sales pitch

**Pass criteria:**
- [ ] Did not get flustered or overly apologetic
- [ ] Acknowledged skepticism naturally
- [ ] Clarified SunRaise is not a solar installer
- [ ] Moved conversation forward

---

## Test 8: Edge Case - Wrong Number

**You say:** "Is this Domino's Pizza?"

**What Kate should do:**
- Politely clarify this is SunRaise Capital in Sanford, Florida
- Wish them well
- End call naturally

**Pass criteria:**
- [ ] Friendly, not confused
- [ ] Identified the company clearly
- [ ] Clean exit

---

## Test 9: Edge Case - Rapid-Fire Questions

**You say:** "Okay so how much does it cost, what's the warranty, how long does installation take, and do you do batteries too?"

**What Kate should do:**
- Grab the last 1-2 questions
- Answer those
- Then ask "sorry, what was the other thing?" or similar
- NOT answer all 4 in perfect sequence (that's an AI tell)

**Pass criteria:**
- [ ] Did not answer all questions in order
- [ ] Naturally asked to repeat
- [ ] Sounded human, not like a FAQ database

---

## Test 10: After Hours Call

**Call outside 8am-5pm EST Monday-Friday.**

**What Kate should do:**
- Mention office hours (M-F, 8-5 Eastern)
- Offer to take a message
- Collect name, phone, reason
- Promise next business day callback

**Pass criteria:**
- [ ] Mentioned correct hours
- [ ] Took message gracefully
- [ ] Promised specific callback timeline

---

## Scoring Summary

| Test | Score (Pass/Total) | Notes |
|------|-------------------|-------|
| 1. New Capital Partner | /7 | |
| 2. New Installer | /6 | |
| 3. New Homeowner | /6 | |
| 4. Existing Installer | /4 | |
| 5. Existing Homeowner | /4 | |
| 6. AI Disclosure | /4 | |
| 7. Sarcasm | /4 | |
| 8. Wrong Number | /3 | |
| 9. Rapid-Fire | /3 | |
| 10. After Hours | /3 | |
| **TOTAL** | **/44** | |

**Scoring bands:**
- **40-44:** World-class. Ship it.
- **35-39:** Production-ready. Minor prompt tweaks needed.
- **28-34:** Needs work. Report failures, I'll fix the prompt.
- **Below 28:** Significant rework. Multiple prompt sections need rewriting.

---

*Test each scenario as a separate call. Take notes on anything that felt off, even if it technically passed. Report back with scores and I'll run Critic review + fixes.*
