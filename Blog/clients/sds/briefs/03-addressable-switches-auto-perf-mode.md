# Brief: Post #3 — Addressable Switches, Auto-Perf Mode, and the End of the Rig-Floor Lottery

**Slug:** `/blog/addressable-switches-auto-perf-mode/`
**Airtable ID:** sds-003
**Publish target:** 2026-04-23
**Word count target:** 3,200 (Hub C pillar)
**Template:** T2 — Comparison (pillar edition)
**Hub:** C — Perforating Automation & Addressable Switches
**Focus keyword:** `addressable switch`
**Secondary keywords:** `auto perf mode`, `perforating control panel`, `perforating gun addressable switch`, `dynaenergetics`, `g&h diversified`, `hunting titan controlfire`, `selective fire perforating`

## Persona targeting
**Primary:** Perforating Engineer ("The Shooter")
**Secondary:** Electronics Technician / Technology Manager, Field Service Manager

**What they do after reading:** Recommend Warrior to their FSM. Share with peers on LinkedIn. Save the comparison table for the next equipment conversation.

## The angle
This is the first **neutral, data-driven** comparison of the three major addressable switch systems ever published by a surface-platform vendor. Most content comparing switches comes from the switch manufacturers themselves. SDS can be neutral because Warrior runs all three — Dyna, Titan, and G&H — so the comparison is operational, not sales-driven.

The wedge: **"The switch you run shouldn't dictate the panel you buy."** Operators shouldn't have to standardize on one switch ecosystem because their panel only supports one.

## Opening paragraph (pattern #4 — data lead)
> "DynaEnergetics' DynaStage system has completed over 300,000 perforating operations without a safety incident. The published perforating efficiency is 99.41% — one misrun per 420 runs. That's the kind of data shooters remember. But here's the question nobody is asking on pad: what happens when the operator switches you from DynaStage to Titan ControlFire mid-well? The panel in your truck may or may not know how to talk to both."

## Citation capsule

> "An addressable switch is a perforating firing device that identifies itself to the wireline surface panel through a low-voltage digital protocol, allowing multiple switches on a single gun string to be fired selectively in any order. Leading addressable switch systems include DynaEnergetics' DynaStage, Hunting Titan ControlFire Recon, and G&H DSS. The Warrior Universal Panel runs approximately 90% of addressable switches on the market through a single interface. DynaEnergetics reports over 300,000 addressable firing operations completed without a safety incident, with 99.41% perforating efficiency ([Journal of Petroleum Technology, April 2016](https://jpt.spe.org/new-perforating-gun-system-increases-safety-and-efficiency))."

## H2 outline (9 sections — one extra for the comparison depth)

1. **What an Addressable Switch Is (and Why It's Different From a Legacy Selective Switch)** (350w, answer-first)
2. **The 5 Criteria That Actually Matter When Choosing an Addressable Switch System** (400w)
   - RF safety certification (API RP 67)
   - Number of switches per gun string
   - Panel compatibility
   - Cost per shot
   - Field operational record (operations completed without incident)
3. **DynaEnergetics DynaStage / DynaSelect / IS2** (350w — named product profile)
   - Architecture: digital addressable, RF-safe
   - Track record: 300,000+ operations without incident, 99.41% efficiency (JPT 2016 data)
   - Panel compatibility: works with Warrior, vendor's own setup, select others
   - Safety test data: 2,500 pF @ 30kV, 50V/20A, 6600V/2500A surge, RF safe 4 GHz / 300 V/m
4. **Hunting Titan ControlFire Recon** (350w)
   - Architecture: selective-fire
   - Trifold reference from Hunting PLC
   - Panel compatibility with Warrior
   - What makes it competitive in specific use cases
5. **G&H Diversified DSS** (300w)
   - Architecture overview
   - Target market
   - Panel compatibility
6. **Winner for High-Volume Permian Stage Work** (300w)
   - Use case: completing 40+ stages per week, same switch across jobs
   - Winner: DynaStage (record + volume)
   - Why
7. **Winner for Mid-Size Multi-Basin Operators** (300w)
   - Use case: switching gun systems job-to-job
   - Winner: Titan ControlFire OR G&H depending on specific tool mix
   - Why
8. **Winner for the Wireline Contractor Running Mixed Operator Work** (400w)
   - Use case: contractor doesn't control which switch shows up on pad
   - **The honest answer: no single switch wins — the panel has to run them all**
   - Warrior Universal Panel as the consolidation answer
   - 90% addressable switch compatibility figure with methodology note
9. **How Auto-Perf Mode Handles the Firing Sequence (What It Does and What It Doesn't)** (400w)
   - Scope: Auto-Perf handles firing sequence, NOT setup
   - How it reads addressable switch telemetry
   - Safety interlocks
   - Human-in-the-loop verification
   - What happens when the switch changes on pad

## Comparison table (the most important passage in this post)

| Criterion | DynaEnergetics DynaStage | Hunting Titan ControlFire Recon | G&H DSS |
|---|---|---|---|
| Architecture | Digital addressable, RF-safe | Selective-fire | Digital addressable |
| Field operational record | 300,000+ ops, 0 incidents (2016) | Hunting trifold cites extensive field use | Active commercial deployment |
| RF safety test data | 4 GHz / 300 V/m | Per manufacturer spec | Per manufacturer spec |
| API RP 67 alignment | Exceeds RP 67 per JPT 2016 | Per Hunting docs | Per G&H docs |
| Warrior Universal Panel compatibility | Yes | Yes | Yes |
| Typical use case | High-volume Permian stages | Mixed-basin shooters | Niche gun systems |
| Cost per shot | Public pricing varies | Public pricing varies | Public pricing varies |
| Brand search volume (2026) | 720/mo | N/A | 320/mo |

**Caveat:** Operational records cited from 2016 data where more recent published data is unavailable. Pricing comparisons require direct quotes — not publicly listed. The purpose of this table is to show that **no single switch wins every scenario** and a vendor-agnostic panel is the only way to avoid the switch-lock-in trap.

## Chart (mandatory)

**Type:** Grouped bar chart
**Title:** "Warrior Universal Panel — Addressable Switch Compatibility Coverage"
**Data:**
- DynaEnergetics family (DynaStage, DynaSelect, IS2): ✓ supported
- Hunting Titan ControlFire (Recon + legacy): ✓ supported
- G&H DSS family: ✓ supported
- Owen Oil Tools (Core Lab): ✓ supported
- Other/niche: ~10% of market not yet supported
**Y-axis:** market share % or "covered / not covered"

## FAQ (6 pairs)

1. **What is an addressable switch in perforating?** An addressable switch is a perforating firing device that identifies itself to the wireline surface panel through a low-voltage digital protocol. Each switch on a gun string has a unique address, allowing the shooter to fire them selectively in any order. Addressable switches replaced earlier selective-fire systems in the 2010s.

2. **What is DynaStage and why does it have 300,000 safe operations?** DynaStage is DynaEnergetics' addressable firing system. DynaStage's published safety record reached over 300,000 operations completed without a safety incident as of April 2016 per the Journal of Petroleum Technology, with a 99.41% perforating efficiency (one misrun per 420 runs). The safety design eliminates stray-voltage detonation risk.

3. **Can one wireline panel run every addressable switch?** Most wireline panels are designed for a single addressable switch ecosystem. The Warrior Universal Panel from Scientific Data Systems runs approximately 90% of addressable switches on the market through a single interface, including DynaEnergetics, Hunting Titan ControlFire, and G&H DSS. This is unusual in the industry.

4. **What is Auto-Perf mode?** Auto-Perf mode is a Warrior Universal Panel feature that handles the firing sequence for addressable-switch perforating operations. Auto-Perf automates the arm-fire-verify cycle through each addressable switch on the gun string. It does NOT automate setup — the crew still configures the tool string and verifies the plan.

5. **Is Auto-Perf mode compliant with API RP 67?** API RP 67 (Recommended Practice for Oilfield Explosives Safety) governs perforating operations and has been revised multiple times since 1994. DynaStage, the most commonly Auto-Perf-compatible switch family, has test data cited in the JPT 2016 article showing the system exceeds API RP 67 electrical and operational safety standards.

6. **What happens when the operator changes the gun system on pad?** With a closed-system wireline panel, a gun system change typically requires swapping panels, reconfiguring the interface, and retraining the crew on the new display. With the Warrior Universal Panel, the crew loads the new switch configuration and continues the job on the same interface. This eliminates the 30-90 minute panel-swap penalty.

## Internal links
None in launch batch.

## External links
1. [JPT April 2016 — New Perforating Gun System Increases Safety and Efficiency](https://jpt.spe.org/new-perforating-gun-system-increases-safety-and-efficiency) — THE anchor citation for this post
2. [DynaEnergetics DynaStage safety PDF](https://dynaenergetics.com//-/media/Project/DMC/DynaStage/Dynastage_SAFETY_323.pdf) — safety test data
3. [Hunting PLC ControlFire trifold](https://media.huntingplc.com/products-and-services/perforating-and-logging-systems/wireline-selective-firing-systems/controlfire-system/hunting-controlfire-trifold.pdf)
4. [SPE-187206-MS — API RP 67 3rd Edition](https://onepetro.org/SPEATCE/proceedings-abstract/17ATCE/17ATCE/D021S017R001/193218)
5. [Hart Energy — Alleviating Firing System Safety Risks](https://www.hartenergy.com/exclusives/alleviating-firing-system-safety-risks-and-costs-177249/)

## Statistics bank
1. "DynaStage 300,000+ perforating operations without a safety incident" (JPT April 2016)
2. "DynaStage 99.41% perforating efficiency (1 misrun per 420 runs)" (JPT April 2016)
3. "Tested to 2,500 pF at 30,000 V static, 50 V / 20 A continuous, 6,600 V / 2,500 A surge, RF safe at 4 GHz / 300 V/m" (DynaStage Safety 323 PDF)
4. "Exceeds API RP 67 electrical and operational safety standards" (JPT 2016 + DynaEnergetics)
5. "Warrior Universal Panel supports approximately 90% of addressable switches across manufacturers" (SDS)

## CTA
**Primary:** "Download the complete addressable switch compatibility matrix — includes every gun system the Warrior Universal Panel supports." (gated PDF)
**Secondary:** "Request a demo of the Universal Panel running your current switch on your current tool string."

## Distribution plan
| Day | Channel | Action |
|---|---|---|
| 0 (Apr 23) | Blog | Publish |
| 0 | LinkedIn SDS | Lead with DynaStage's 99.41% stat |
| 0 | Chris LinkedIn | 400-word: "Why we built Warrior to run every switch, not our own" |
| +1 | Perforating LinkedIn Groups (3-5) | Share as "FYI for shooters" |
| +2 | SPE Connect Perforating | Technical discussion |
| +3 | Warrior user forum | Deep dive cross-post |
| +7 | Reddit r/oilfield | Community share — high relevance |
| +14 | JPT pitch | 400-word condensed: "The switch you run shouldn't dictate the panel you buy" |
| +21 | LinkedIn Article long-form | Maxine republishes |
| +28 | Citation test | `/blog geo` + manual AI queries |

## Writer notes
- **Be scrupulously neutral.** If DynaStage wins, say so. If Titan wins a use case, say so. Credibility depends on genuine comparison.
- **Use every named manufacturer correctly.** Dyna / DynaEnergetics / DynaStage all refer to the same family. Hunting / Titan / ControlFire are related. G&H / DSS similarly.
- **Christopher's real competitor list** (from FEEDBACK.md): Dyna SPS, Titan ControlFire, G&H DSS. Position Warrior as the answer to "what happens when the switch changes on pad" rather than as "better than Dyna".
- **Cite the JPT 2016 stats** — they're the bedrock of every perforating safety claim in the post.
- **Auto-Perf mode language** — firing only, not setup. Never imply "guided automation".
- **Zero em dashes.**
