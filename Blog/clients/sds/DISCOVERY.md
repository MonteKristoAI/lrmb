# SDS / Warrior — Discovery Document

**Client:** Scientific Data Systems, Inc. (SDS) — Warrior platform
**Prepared:** 2026-04-11
**Prepared by:** MonteKristo AI (operating as "Alex Srdic")
**Launch deadline:** 2026-05-05 (SDS Mixer event)

This is the single source of truth for every research and strategy decision about the SDS blog. Every other file in `/Blog/clients/sds/` pulls from here.

---

## 1. Business Context

### Company
Scientific Data Systems, Inc. has built wireline data acquisition hardware and software in Houston for 34 years. Their product is **Warrior** — a surface acquisition platform that connects to virtually any downhole wireline tool from any manufacturer through a single surface unit and a unified software interface.

### The launch event
SDS is launching the **Warrior Universal Panel** (ULPP) on May 5, 2026 at a Houston mixer event. The Universal Panel consolidates multiple legacy wireline surface panels into a single hardware unit. It runs multiple switches, tool strings, and surface sensors simultaneously, with Auto-Perf mode for perforating firing sequences.

### The engagement
MonteKristo AI is subcontracted via **GetStuffDone LLC** (agency), operating to SDS as **"Alex Srdic"**. The SDS-side approver is **Christopher M Knight**. The agency PM is **Maxine Aitkenhead**. Billing is via GetStuffDone. See `/clients/sds/CLIENT.md` for full contacts and operating rules.

### Scope for the blog
- **8 pre-launch blog posts** live before May 5, 2026
- Post-launch editorial pipeline of ~4 posts per month through Q2–Q3 2026
- Content must align to the SDS 2026 Brand Voice Manifesto v4
- LinkedIn April post series is already drafted by GetStuffDone — blog content must reinforce, not duplicate it
- No chatbot (vetoed by Christopher)

---

## 2. Audience (ICP)

The SDS Brand Voice Manifesto v4 identifies **9 buyer personas**. These are the exact same personas our blog content must speak to. Full detail in `PERSONAS.md`. Summary:

| Persona | Role | Emotional job | Search behavior |
|---|---|---|---|
| **Field Service Manager (FSM)** | Runs wireline crews at the wellsite / across a fleet | Keep every truck running profitably, protect reputation with operators | Reads trade pubs, searches for "what failed" analysis |
| **Perforating Engineer ("The Shooter")** | Runs stage-by-stage perforating operations | Deliver consistent, well-executed stages so frac keeps running | Googles failure modes, gun systems, stage issues |
| **Field Logging Engineer** | Runs cased-hole and open-hole logging jobs | Deliver clean logs the company man trusts | Searches for tool troubleshooting, log QC |
| **Electronics Technician / Tech Manager** | Shop bench — tests panels and tools, identifies field failures | Close the gap between "tests good in shop, fails in field" | Googles electrical and diagnostic questions |
| **Tool Technician** | Assembles, calibrates, repairs downhole tools | Send tools out reliable; diagnose returns fast | Searches for tool-specific service info |
| **Operator Company Man** | Company representative at the wellsite | Get the job done safely, trust the data | Looks for "what to demand from my wireline crew" |
| **Service Company Leader** | Owner / VP Ops at a wireline service company | Buy equipment that protects reputation AND bottom line | Searches for equipment ROI, new tech |
| **Completion Engineer** | Operator-side, designs completions | Specify tools that deliver the needed data | Looks for tool capability matrices |
| **Fleet / Procurement Lead** | Operator or service co procurement | Total cost of ownership, leasing vs buying | Searches for pricing, TCO, OEM comparisons |

**Where they read:** JPT, Rigzone, World Oil, SPE Connect, LinkedIn, r/oilfield, Hart Energy. They do NOT live on general Google. This is why AI citation and LinkedIn distribution matter more than organic ranking.

---

## 3. Research Foundations

Full research in `_research/research-findings.md`. Key reframings for the strategy:

### Finding 1 — This niche is too small for volume-driven SEO
All 120 target keywords combined = 15,590/mo. The single biggest keyword is "fervo energy" (6,600/mo) which belongs to a geothermal company, not a wireline system.

**Strategy implication:** Stop optimizing for volume. Optimize for **citation surface** (the chance of being pulled into an AI answer) and **lead quality** (the chance that the 30 people who read a post this month are decision-makers).

### Finding 2 — Geothermal is where the volume lives
Fervo Energy, EGS, and enhanced geothermal combined: 9,200/mo. SDS already serves geothermal per their About copy. The Warrior platform is uniquely suited for geothermal because geothermal wells need mixed-manufacturer tool runs.

**Strategy implication:** Create a "Wireline → Geothermal Transition" sub-cluster. This is a Trojan horse — it captures adjacent high-volume search intent and delivers it to SDS's real buyer.

### Finding 3 — Weatherford distributes SDS Warrior
Confirmed at [weatherford.com](https://www.weatherford.com/products-and-services/drilling-and-evaluation/wireline-products/telemetry-systems/scientific-data-systems-warrior-well-logging-system-panel/). One of the "big four" wireline service companies resells SDS hardware.

**Strategy implication:** This is the single most valuable positioning asset SDS has. It makes every "vendor-agnostic" claim provable — "if Weatherford runs our panel, it's not a marketing claim." This fact should appear in at least 4 of the 8 launch posts.

### Finding 4 — API RP 67 4th edition is the regulatory event of the decade
The 4th edition introduces strict RF-distance arming rules that make RF-safe addressable systems effectively mandatory. That is exactly what Warrior + DynaStage-compatible setups deliver. The search demand will spike when the 4th edition drops.

**Strategy implication:** Build a definitive "What API RP 67 4th Edition Means for Your Operations" pillar post *before* the 4th edition publishes. Be the #1 citation source when buyers go looking.

### Finding 5 — LAS 2.0 is 34 years old, still dominant, same age as SDS
LAS 2.0 was released in September 1992. SDS has been building wireline systems since 1993. The parallel is perfect: "the format that still runs the industry and the company that has supported it since day one."

**Strategy implication:** A pillar post on "LAS vs DLIS vs WITSML for wireline practitioners" becomes a heritage play — SDS is positioned as the company that has seen every format come and go.

---

## 4. Positioning & Unique Angle

**The SDS blog voice in one line:**
> *Written by the engineers in Houston who designed your wireline system — for the crews who actually run it.*

### The wedges (in priority order)

1. **Vendor-agnostic, provably.** Warrior runs ~60% of open-hole tools, ~85% of cased-hole tools, and ~90% of addressable switches. Weatherford — a competitor — distributes the panel. No other surface system in the industry has this provable claim.
2. **34 years in Houston, in-house.** Every panel is manufactured and tested in the same building where the engineers take support calls. "When you call us, you talk to the Houston engineers who designed your system."
3. **Built for the field, not the marketing deck.** No "guided workflows", no "intelligent automation", no buzzwords. The system does exactly what the manifesto says, nothing more. This is a differentiator — competitors over-promise, SDS under-promises and over-delivers.
4. **Leasing at $2,500/month.** Removes the "too expensive to switch" objection. No other major wireline system has a comparable leasing play.
5. **The only wireline platform that already serves oil, geothermal, water well, environmental, and mining.** Energy transition buyers are already Warrior customers.

### Voice guardrails
- Zero AI tells, zero buzzwords (enforced by banned vocab list in `BRAND.md`)
- Zero em dashes (MonteKristo global rule)
- Every post passes the **truck-stop test**: would a wireline hand scrolling on his phone recognize this as his job? If no, rewrite.
- Tone: authoritative but accessible. Engineer-to-engineer. Peer-to-peer.
- Never write down to the reader. Never corporate speak. Never sales language.

---

## 5. What "Level 10" Looks Like For This Blog

Because the audience is small and the search volume is small, "Level 10" here does not mean "more words per post." It means:

1. **Every post is citation-grade.** Every claim has a source. Every statistic has a year. Every definition is a passage designed to be lifted whole by an AI model.
2. **Every post has a failure mode.** A named scenario where the wrong choice causes a real consequence (lost well, injured crew, failed stage). No abstract theory.
3. **Every post has a named expert.** Even if it's Christopher Knight or an SPE paper author. Named voices outrank anonymous blog copy in both Google's Helpful Content rubric and AI citation models.
4. **Every post has a comparison.** A table, a before/after, a side-by-side. AI models preferentially cite passages with structured comparisons because they resolve ambiguity.
5. **Every post has a diagram or chart.** Wireline is a visual industry. Text alone loses the reader. SVG charts or inline infographics mandatory.
6. **Every post has a technical reviewer line.** A credibility signal: "Technical review: [name] — 28 years in downhole diagnostics." Names to be provided by SDS once known; until then, placeholder.
7. **Every post has a distribution plan.** LinkedIn post, email newsletter snippet, SPE Connect discussion seed, and a repurposed version for WorldOil/JPT pitching. See `DISTRIBUTION.md`.

### What Level 10 explicitly does NOT mean
- It does not mean 3,500-word posts. Many topics are tight and deserve 1,500 words. Quality beats length.
- It does not mean daily publishing. The audience does not consume daily. Weekly is the max.
- It does not mean keyword stuffing. Focus keyword density will be carefully tuned to 0.65–0.9% per the Blog CLAUDE.md rule.

---

## 6. Strategy Inputs (where each downstream file gets its data)

| Downstream file | Feeds from |
|---|---|
| `KEYWORD-DATABASE.md` | `_research/research-findings.md` §2, `_research/dfs-keywords-raw.json` |
| `COMPETITORS.md` | `_research/research-findings.md` §5, §8 |
| `SOURCES.md` | `_research/research-findings.md` §11 |
| `PERSONAS.md` | SDS Manifesto v4 (9 personas section), this file §2 |
| `BLOG-STRATEGY.md` | This file §3, §4, §5 |
| `CITATIONS.md` | `_research/research-findings.md` §9 |
| `CONTENT.md` | This file §4, `_research/research-findings.md` §8 |
| `briefs/*` | This file §5, `_research/research-findings.md` §11 |

---

## 7. Pending Research / Open Questions

1. SDS leadership names and bios — blocked on SDS photo shoot (per `clients/sds/PROJECT.md`)
2. Current DynaStage operation count (2024-2026) — need press release
3. Warrior customer list beyond Weatherford — ask Maxine for permission
4. BSEE wireline-specific safety alerts — direct BSEE scrape needed
5. Geothermal wireline pricing delta — no public data, would need operator interview
6. Christopher's 2 quote-builder files from Gmail `19d6dafed9307d19`
7. Competitor pricing on MAXIS, InSite, CIRRUS wireline systems — not public

These are deliberately left in the file so future sessions know exactly what's missing.
