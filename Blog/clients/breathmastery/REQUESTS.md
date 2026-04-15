# BreathMastery — Request a Post Queue

**Airtable Base:** `appZaD3T174afBSaq` — *Blog Agency In a Box Solar*
**Airtable Table:** `tblyq7MN2svfMrZNy` — *Request a post*

> **Workflow automation note:** The n8n generation workflow should filter rows where `Status = Not Yet`, process them in order, set `Status → Processing` while running, then `Status → Done` on completion, and write the `Generated Post ID` back to link the two tables.

---

## Status Legend

| Status | Meaning |
|--------|---------|
| `Not Yet` | Queued — not started |
| `Processing` | Currently being generated |
| `Done` | Generated — see Generated Post ID for linked post |

---

## Queue

| # | Airtable ID | Title | Primary Keyword | Status | Completed At | Generated Post ID |
|---|-------------|-------|----------------|--------|--------------|-------------------|
| 1 | rec4IlLocm4vbxTcV | Breathing Meditation for Busy Minds: A Simple Practice You Can Actually Stick To | breathing meditation | Not Yet | — | — |
| 2 | rec6TpS3oF3oIGoso | Breathing for Stress vs Breathing for Anxiety: Same Tool, Different Settings | breathing exercises for stress | Not Yet | — | — |
| 3 | rec7a6ghfGPONTKeb | Breath and Nervous System Regulation: The Quick Guide to Vagal Tone (No Jargon) | breath and nervous system | Not Yet | — | — |
| 4 | rec8blVtQSBWlr15v | Science of Breathing: CO2, Calm, and Why Slow Breathing Works So Fast | science of breathing | Done | 2026-03-28 | reciNcR8LaXKCAW9X |
| 5 | recBcK1209KnlVIRp | Breathing Techniques for Energy: How to Wake Up Your System Without Caffeine | breathing techniques for energy | Not Yet | — | — |
| 6 | recCpb4znKpMXpmx1 | Breathwork Certification: What Makes a Program Legit (Safety, Skill, Structure) | breathwork certification | Done | 2026-03-28 | recq43Upud1Ix6KwN |
| 7 | recD5HK4JAD6ALudk | Breathing Techniques for Relaxation: A Soft Belly Routine for Tension Release | breathing techniques for relaxation | Not Yet | — | — |
| 8 | recDQBavSKjyVHeBp | Breathing Meditation: The One Breath Method for Instant Presence | breathing meditation | Not Yet | — | — |
| 9 | recGtGPPzzEMkhGkg | Breathwork for Emotional Release: The Aftercare Checklist (So You Feel Better, Not Raw) | breathwork for emotional release | Not Yet | — | — |
| 10 | recGuGHcOXEpn0Hhg | Breathwork 101: What It Is, How It Works, and What People Get Wrong | breathwork | Not Yet | — | — |
| 11 | recJ5ohk8NtkIlyPc | Power of Breath in Everyday Life: Better Conversations, Better Boundaries, Less Reactivity | power of breath | Not Yet | — | — |
| 12 | recLMheiekWbFuqaW | Breathwork Training Online: How to Practice Safely When You're Learning Remotely | breathwork training | Not Yet | — | — |
| 13 | recN5SBUtWHIZRahz | Conscious Breathing in Real Life: A 3-Phase Routine for Meetings, Traffic, and Stress | conscious breathing | Not Yet | — | — |
| 14 | recNNR8Q1SXGrweEs | Science of Breathing: What Modern Physiology Confirms About Ancient Practices | science of breathing | Not Yet | — | — |
| 15 | recQnY3VS7aIHVl3U | Breathing Techniques: Your Personal Library (Calm, Energy, Sleep, and Reset) | breathing techniques | Not Yet | — | — |
| 16 | recYBeBP9fAWQNPRH | Breathwork Training: What You Actually Learn (Beyond Just Breathe) | breathwork training | Not Yet | — | — |
| 17 | recYWZa8gd6BBV6w3 | Breathwork for Emotional Release: What's Normal, What's Not, and How to Integrate | breathwork for emotional release | Not Yet | — | — |
| 18 | recaDKHfw4lkE0lfC | Power of Breath: Why Breath Is the Most Underrated Performance Tool | power of breath | Not Yet | — | — |
| 19 | recfVN0QkF15BpRbm | Breathing Exercises for Stress: A 5-Minute Reset You Can Use Anywhere | breathing exercises for stress | Done | 2026-03-28 | receTRxc6tY9rEIU5 |
| 20 | recfxq15LoZwKLtAB | Online Breathwork Course: How to Choose One That Actually Helps You Improve | online breathwork course | Not Yet | — | — |
| 21 | rech6fJy6CVv4TCS6 | Breathwork for Nervous System Regulation: A Weekly Plan (Beginner to Intermediate) | breathwork for nervous system regulation | Not Yet | — | — |
| 22 | recjaTjtbFmf5Qc5I | Breathing Techniques for Relaxation: The Downshift Sequence Before Sleep | breathing techniques for relaxation | Not Yet | — | — |
| 23 | reclbs6LXpae4IDbl | Benefits of Breathwork for Focus: Why Calm Creates Better Decisions | benefits of breathwork | Not Yet | — | — |
| 24 | recmzosxmuE7s3ekz | Conscious Breathwork vs Regular Breathwork: What's the Difference (Really)? | conscious breathwork | Not Yet | — | — |
| 25 | recs9Rz60xmifQdxS | Breathing Techniques for Anxiety at Night: How to Stop the Spiral and Sleep | breathing techniques for anxiety | Done | 2026-03-28 | recqUsw00br2Vv3gG |
| 26 | rectmN1ieEss2Cl1r | Benefits of Breathwork: 12 Changes People Notice When They Practice Consistently | benefits of breathwork | Not Yet | — | — |
| 27 | recwH1u40dOBxvMJ0 | Breathing Techniques: How to Know If You're Doing It Right (Simple Self-Checks) | breathing techniques | Not Yet | — | — |
| 28 | rec55WAa7myR6vbsH | Breathing Techniques for Anxiety: The 3 Patterns That Calm the Body Fastest | breathing techniques for anxiety | Done | 2026-03-26 | rec97uqqiiiqwR2n2 |
| 29 | recaaFpK2FKQJGTWN | Pineal Gland Activation: What People Mean (and What's Realistic) | pineal gland activation | Done | 2026-03-26 | recPHk8dWowkBbxcn |
| 30 | receehfZEoE3uSm6t | Conscious Breathing: The Fastest Way to Shift Your State (Without Overthinking It) | conscious breathing | Done | 2026-03-26 | rec3sFoA7PdfofC0Q |
| 31 | recuqZX5bS8B51fSy | Breathwork for Beginners: The 5 Most Common Mistakes (and Quick Fixes) | breathwork course | Done | 2026-03-26 | reclL6MWPflO7lzPP |
| 32 | recvj1uQG0a5PoFnc | Breath and the Nervous System: Why Your Exhale Changes Everything | breath and nervous system | Done | 2026-03-26 | recDFvmWLYwUJE28N |
