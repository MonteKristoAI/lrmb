# REIG Solar — Request a Post Queue

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
| 1 | rec2izcJWmPuURlf9 | Solar DAS Commissioning for Met Data: Irradiance + Weather QA | solar das commissioning | Done | 2026-04-01 | — |
| 2 | rec2jDYO5uSCUdCr9 | Utility Scale Solar Monitoring vs SCADA: What Each Should Do | utility scale solar monitoring | Done | 2026-04-01 | — |
| 3 | rec3NG9fRdVURyAty | Solar SCADA Alarm Rules: Cut Nuisance Alarms Fast | solar scada | Done | 2026-04-01 | — |
| 4 | rec7WdtMZg6QeJmBv | Fiber Optic Installation Solar Farm OTDR Testing: Acceptance Basics | fiber optic installation solar farm | Done | 2026-04-01 | — |
| 5 | rec8ryZ3yVkRZg5k4 | Solar SCADA Commissioning for Interconnection: Utility Witness Pack | solar scada commissioning | Done | 2026-04-01 | — |
| 6 | recALWcWGg3JjBtja | Solar Data Acquisition System (DAS) Networking: Fiber vs Copper vs Radio | solar data acquisition system (DAS) | Done | 2026-04-01 | — |
| 7 | recB3DjnEs5fCYEVT | Solar Plant SCADA System Modernization: Upgrade Triggers + Roadmap | solar plant scada system | Done | 2026-03-31 | — |
| 8 | recBdbiOHag44gr1j | SCADA Integration Services RFP: Questions That Prevent Change Orders | SCADA integration services | Not Yet | — | — |
| 9 | recGkjgXPtLw9Htwm | Utility Scale Solar Monitoring Data QA: Detect Drift Early | utility scale solar monitoring | Not Yet | — | — |
| 10 | recIESlU2IOTiMJWD | Pyranometer Selection for PV: First Class vs Secondary Standard | pyranometer | Not Yet | — | — |
| 11 | recIPFxM57f98ipe6 | Solar Data Acquisition System (DAS) Time Sync: NTP/PTP Without Drift | solar data acquisition system (DAS) | Not Yet | — | — |
| 12 | recJpj2S7aEtIV1mf | Solar SCADA Tag & Historian Standards: Naming, Sync, QA | solar scada | Not Yet | — | — |
| 13 | recKWZwaSNW0gdHcB | Solar DAS Commissioning Checklist: Sensors, Scaling, Timestamps | solar das commissioning | Not Yet | — | — |
| 14 | recLRapAn8pMH72j0 | Solar SCADA Commissioning Checklist: Controls, Alarms, Evidence | solar scada commissioning | Not Yet | — | — |
| 15 | recN7VF6hnl9KxFoZ | Solar SCADA Commissioning FAT vs SAT: What to Test Where | solar scada commissioning | Not Yet | — | — |
| 16 | recPc9EFy5CelyRfo | Fiber Optic Installation Solar Farm Fusion Splicing QA: Loss Budgets | fiber optic installation solar farm | Not Yet | — | — |
| 17 | recQaB1hhrzxcXmoi | Solar SCADA Commissioning Failures: Tag Mapping, Comms, Time Sync | solar scada commissioning | Not Yet | — | — |
| 18 | recSTs8jlnFMRSrp6 | Solar SCADA Integrator vs EPC vs OEM: Ownership Matrix | solar scada integrator | Not Yet | — | — |
| 19 | recSv1Kj8ADfxAuQq | Choosing a Solar SCADA Integrator: Field-Proven Scorecard | solar scada integrator | Not Yet | — | — |
| 20 | recVh4FOTUcxN9IAi | SCADA Integration Services Acceptance: FAT/SAT Evidence Checklist | SCADA integration services | Not Yet | — | — |
| 21 | recZxqihWDnlsl4SG | Solar DAS Commissioning Troubleshooting: Dropouts, Scaling, QC Flags | solar das commissioning | Not Yet | — | — |
| 22 | recaiV8nvBzAq85p0 | Solar SCADA Cybersecurity: Segmentation + Remote Access Basics | solar scada | Not Yet | — | — |
| 23 | receT2EyW7PptFElE | Solar SCADA Integrator Handover: Training, Access, Spares, O&M | solar scada integrator | Not Yet | — | — |
| 24 | recgAUkmAIoX8bCAo | Solar SCADA Integrator Docs Pack: As-Builts + Test Logs | solar scada integrator | Not Yet | — | — |
| 25 | reci14zWCsy9XQCjL | Solar Data Acquisition System (DAS) Troubleshooting: Fix Dropouts Fast | solar data acquisition system (DAS) | Not Yet | — | — |
| 26 | reckbVeznoIOPlM5E | Solar Plant SCADA System Historian: Sampling, Compression, Retention | solar plant scada system | Not Yet | — | — |
| 27 | recmjNvyxie4iDbR0 | Pyranometer Maintenance: Cleaning, Calibration, Drift Detection | pyranometer | Not Yet | — | — |
| 28 | reco8OBQun6NMcSXM | SCADA Integration Services Cost Drivers: Control Budget + Schedule | SCADA integration services | Not Yet | — | — |
| 29 | recpd9ypEg9gvXttO | Utility Scale Solar Monitoring Setup: Sampling, Retention, Alerts | utility scale solar monitoring | Not Yet | — | — |
| 30 | recpj4DmFSxECXW0u | Solar Plant SCADA System Network Topology: VLANs, Firewalls, OT Zones | solar plant scada system | Not Yet | — | — |
| 31 | recry2eXROtmrahyc | Fiber Optic Installation Solar Farm Documentation: Labels + As-Builts | fiber optic installation solar farm | Not Yet | — | — |
| 32 | rectnAXtviNnaceJF | Solar Plant SCADA System Signals: Must-Have Measurements + Controls | solar plant scada system | Not Yet | — | — |
| 33 | recuBGCMSboh7uFLu | Solar DAS Commissioning to SCADA: End-to-End Data Verification | solar das commissioning | Not Yet | — | — |
| 34 | recniBfY2HQveDE5p | Pyranometer Data Quality: QC Flags + Fixing Bad Irradiance | pyranometer | Not Yet | — | — |
| 35 | rec3yY7nCEmZf6eyu | Pyranometer for Utility-Scale PV: Accuracy Classes Explained | pyranometer | Done | 2026-03-26 | recUzo9eo0wpJwRfz |
| 36 | rec5cookBsD2AILh8 | Solar SCADA: Architecture + Control Signals for Utility-Scale PV | solar scada | Done | 2026-03-26 | recJZT03qamOz6di9 |
| 37 | rec8ZzBIRrRGisg6C | Utility Scale Solar Monitoring KPIs: PR, Availability, Curtailment | utility scale solar monitoring | Done | 2026-03-26 | recaWoNUDrtHaCYkM |
| 38 | recAGWnEaJ3miKTh2 | Solar SCADA Commissioning to COD: Timeline + Milestones | solar scada commissioning | Done | 2026-03-26 | recI7T8hi3ssfPImC |
| 39 | recBEMyeLUIX915JK | Utility Scale Solar Monitoring Dashboards: Ops vs Asset Managers | utility scale solar monitoring | Done | 2026-03-26 | recpYXDzJCDmCACt8 |
| 40 | recKcK4VSmFivGtkR | Solar SCADA Integrator: Roles + Deliverables That Matter | solar scada integrator | Done | 2026-03-26 | rec8IR0NpRAq18dWq |
| 41 | recL5ohw5MqJAvAZJ | SCADA Integration Services: Scope + Deliverables That Prevent Rework | SCADA integration services | Done | 2026-03-26 | recb8xcTD8YOttMzi |
| 42 | recP8wlSU2UdWEDbh | Solar Data Acquisition System (DAS): Sensor Map + Data Flow | solar data acquisition system | Done | 2026-03-26 | rec0LGCNShROrfnmP |
| 43 | recaHeWgP31b2U3gx | Fiber Optic Installation Solar Farm: Route Design + Splice Planning | fiber optic installation solar farm | Done | 2026-03-26 | recotMms1yc4iWdGo |
| 44 | reccSXvLYSD55nNfp | Solar Plant SCADA System: Reference Architecture in One Diagram | solar plant scada system | Done | 2026-03-26 | rec2y0dGBEPu9Mgs0 |
| 45 | reccoyJLHU2cz0bAB | Solar Data Acquisition System (DAS) Tagging: Units, Scaling, QC | solar data acquisition system (DAS) | Done | 2026-03-26 | recudcGMu0cH0nPAY |
| 46 | recm3U6oqnMUv0Lzq | SCADA Integration Services Testing: End-to-End Verification Plan | SCADA integration services | Done | 2026-03-26 | recs5jaRUVEznczNK |
| 47 | recqv8YtjdedXWzXR | Solar DAS Commissioning Targets: Completeness, Accuracy, Latency | solar das commissioning | Done | 2026-03-26 | recyz1QSoa0SIoC6O |
| 48 | recsWfuhbX3nZtLHc | Solar SCADA ROI: Controls + Data That Increase Revenue | solar scada | Done | 2026-03-26 | recrXClBbcc8uXsY8 |
| 49 | rectd2LH1qBFExZc4 | Pyranometer Installation: Mounting, Leveling, Shading Rules | pyranometer | Done | 2026-03-26 | recuiD0bIyCCv3Qna |
| 50 | recwQhc0mOcqRLXS2 | Fiber Optic Installation Solar Farm: Direct-Buried vs Conduit | fiber optic installation solar farm | Done | 2026-03-26 | recJvRhUOGox78Fv3 |
