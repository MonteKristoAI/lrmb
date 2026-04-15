# REIG Solar — Brand Guidelines

**Source:** Deep website crawl + full blog analysis (Feb–Mar 2026, 10 posts)

---

## Unique Angle / Positioning

REIG delivers a **commissioning-ready SCADA + DAS stack** that makes plant data trustworthy from day one — and keeps it dependable after COD. They differentiate on three axes:

1. **Evidence over assumption** — every claim backed by testable point lists, OTDR reports, end-to-end signal verification
2. **Full-stack ownership** — they own fiber, communications, DAS, SCADA, alarms, and documentation (no fragmented handoffs)
3. **Rework prevention** — they commission correctly so the EPC doesn't come back to fix "mystery data gaps" six months after COD

**Their stated differentiator (homepage):**
> *"SCADA & DAS Integration Built for Your Site: Aligns with EPC, OEM, and utility requirements while configuring DAS points, control logic, and monitoring dashboards."*

---

## Competitor Positioning (What They Position Against)

REIG implicitly positions against:
- Integrators who just "get it online" without proof of data quality
- Fragmented teams where fiber crew and SCADA team don't talk
- EPCs who commission SCADA last-minute and create post-COD rework
- Generic monitoring vendors who don't understand field-level commissioning

They never name competitors. They win by making the problem vivid ("mystery data gaps," "online but wrong") and showing their process is the antidote.

---

## Core Topics (Always In Scope)

**Solar SCADA:**
- SCADA system architecture (5 layers: Field, Network, Control/Compute, Presentation, Utility Interface)
- SCADA commissioning — FAT/SAT process, COD readiness, utility witness testing
- Alarm strategy (ANSI/ISA-18.2, actionable alarms, nuisance reduction)
- SCADA ROI: controls and data that protect revenue
- SCADA cybersecurity: OT network segmentation, remote access, ISA/IEC 62443
- SCADA tag & historian standards

**Solar DAS:**
- DAS sensor mapping and data flow
- Tagging: units, scaling, QC flags
- Time sync: NTP/PTP without drift
- Troubleshooting: dropouts, scaling errors, QC flags
- Commissioning targets: completeness, accuracy, latency

**Utility-Scale Solar Monitoring:**
- KPIs: PR (IEC 61724), availability categories, curtailment tracking
- Dashboards: ops view vs asset manager view
- Data quality assurance — drift detection
- Monitoring setup: sampling rates, retention policies, alert thresholds

**Fiber Optic:**
- Route design and splice planning
- Direct-buried vs conduit (when to use each)
- Fusion splicing QA and loss budgets
- OTDR testing and acceptance documentation
- Labels and as-builts

**Pyranometer:**
- Selection: ISO 9060 first class vs secondary standard
- Installation: mounting, leveling, shading rules
- Maintenance: cleaning, calibration, drift detection
- Data quality: QC flags, fixing bad irradiance

**SCADA Integration Services:**
- Scope definition and RFP questions
- Cost drivers
- FAT/SAT acceptance evidence checklist
- Testing verification plan

**Integrator selection:**
- Roles and deliverables that matter
- Handover: training, access, spares, O&M readiness
- Ownership matrix (REIG vs EPC vs OEM vs SCADA platform vendor)

---

## Off-Limits Topics

- Consumer/residential solar (they are utility-scale only)
- Anything that implies REIG is a generalist contractor
- Cost/price discussions not grounded in value (don't cheapen their positioning)
- Competitor brand names (they never name competitors)

---

## Preferred External Sources to Cite (Used on Their Blog)

| Source | What They Use It For |
|--------|---------------------|
| NIST SP 800-82 Rev. 2 | SCADA cybersecurity |
| NREL PV O&M Best Practices (3rd Ed.) | Monitoring and O&M |
| IEEE 1547-2018 | Grid interconnection |
| IEC 61724-1 | PV monitoring and KPIs (PR) |
| ANSI/ISA-18.2 | Alarm management |
| IEC 62682 | Alarm systems |
| ISA/IEC 62443 | OT cybersecurity |
| FOA OSP installation guidance | Fiber installation |
| ISO 9060 | Pyranometer classifications |

---

## Technology References (Hardware/Software to Know)

**Hardware regularly mentioned:**
- Moxa managed switches (NW enclosures)
- Sierra Wireless RV-50X / RV-55X cellular modems
- IPC-DAS MET hubs
- Nor-Cal Controls ES (DAS/SCADA systems on projects)
- SEL / RTAC (substation protection and control, DNP3/SCADA gateway)

**Protocols:** Modbus RTU/TCP (device-level), DNP3 (utility interface, North America), IEC 60870-5-104 (international), RS-485, Ethernet/TCP/IP

**Monitoring platform partner:** Wattch

**RenergyWare:** Their own product — always position as field-proven, commissioning-ready, NEMA 4, UL listed

---

## Product Mention Rules

- **RenergyWare** should be woven in naturally when discussing commissioning-ready configurations, standardized builds, or rugged hardware
- **Wattch** is the monitoring platform they currently partner with — mention in context of SCADA software
- Link to reig-us.com service pages where appropriate
- Always position RenergyWare as "field-proven" — never generic

---

## Legal / Compliance Notes

- Technical claims should be backed by the standards listed above
- Avoid making specific claims about third-party vendor products without citation
- ERCOT and utility-specific grid requirements vary — frame as general guidance unless referencing a specific project
