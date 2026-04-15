---
type: topic-map
client: AiiACo
date: 2026-04-11
tags: [aiiaco, topic-clusters, hub-spoke]
---

# AiiACo Topic Cluster Map

**Purpose**: the hub-and-spoke architecture that organizes every post into a cluster, defines cluster anchors, and maps cross-cluster bridges. Used by writers to know which post links to which.

---

## Cluster overview

```
                    +------------------------+
                    |  Cluster 1: REVENUE    |
                    |   Hub: Post #1         |
                    |  (ai revenue system)   |
                    +------------+-----------+
                                 |
        +------------------------+------------------------+
        |                        |                        |
        v                        v                        v
+--------------+       +-------------------+     +------------------+
| Cluster 2:   |       | Cluster 3:        |     | Cluster 4:       |
| REAL ESTATE  |<----->| MORTGAGE          |<--->| VACATION RENTAL  |
| Hub: Post #2 |       | Hub: Post #5      |     | Hub: Post #12    |
+--------------+       +-------------------+     +------------------+
        |                        |                        |
        +------------------------+------------------------+
                                 |
                    +------------+-----------+
                    |  Cluster 5: PLATFORMS  |
                    |   Hub: Post #6         |
                    |  (what is an ai sdr)   |
                    +------------+-----------+
                                 |
               +-----------------+-----------------+
               |                                   |
               v                                   v
     +-------------------+              +---------------------+
     | Cluster 6:        |              | Cluster 7:          |
     | WORKFLOW / TOOLS  |              | GOVERNANCE          |
     | Hub: Post #14     |              | Hub: Post #19       |
     +-------------------+              +---------------------+
               |                                   |
               v                                   v
     +-------------------+              +---------------------+
     | Cluster 8:        |              | Cluster 9:          |
     | CRM NATIVE        |              | CONSULTING / FRAC   |
     | Hub: Post #43     |              | Hub: Post #8        |
     +-------------------+              +---------------------+
                                                   |
                                                   v
                                        +---------------------+
                                        | Cluster 10:         |
                                        | REACTIVATION        |
                                        | Hub: Post #7        |
                                        +---------------------+
```

## Cluster definitions

### Cluster 1: Revenue Systems (hub post #1)

**Hub**: Post 1 `what-is-an-ai-revenue-system` (shipped)

**Spoke posts (6)**:
- Post 7: AI Dormant Database Reactivation Math
- Post 24: AI Revenue System Rollout Playbook (Week by Week)
- Post 44: Best AI Sales Automation Software Compared
- Post 45: Integration Before Tools Operator Manifesto
- Post 49: The 90-Day AI Implementation Playbook
- Post 50: How to Measure AI ROI (Outcomes, Not Activity)

**Cluster narrative**: "An AI revenue system is the operational layer that sits on top of your CRM. These posts define it, show how to roll it out, compare it to tools, measure its ROI, and critique the tool-first alternative."

**Inbound links to hub**: every other cluster hub links back to Post 1.

### Cluster 2: Real Estate Brokerages (hub post #2)

**Hub**: Post 2 `how-to-integrate-ai-into-a-real-estate-crm` (shipped)

**Spoke posts (15)**:
- Post 3: Real Estate Brokerages AI Mistakes (opinion)
- Post 4: Follow Up Boss integration
- Post 9: kvCORE integration
- Post 13: FHA Compliance for AI Listings
- Post 15: AI for Commercial Real Estate
- Post 18: AI Voice Agent for Real Estate Showings
- Post 23: Build vs Buy AI for Real Estate
- Post 25: AI Lead Scoring Model Explained
- Post 26: BoomTown integration
- Post 27: Lofty integration
- Post 32: AI Chatbot for Real Estate Brokerage
- Post 33: AI Listing Content Generation FHA Compliant
- Post 34: AI Photo Enhancement Listings Reddit Problem
- Post 38: AI Tools for Real Estate Agents Honest Ranking
- Post 41: AI Data Entry Automation for Real Estate

**Cluster narrative**: the biggest cluster (16 posts total). Covers every angle of AI in real estate brokerages: CRM integrations, compliance, content generation, vertical niches (commercial, voice agents), and honest tool comparisons.

### Cluster 3: Mortgage Lending (hub post #5)

**Hub**: Post 5 `ai-for-mortgage-loan-officers` (note: rename per critic finding to lead with "Mortgage AI")

**Spoke posts (5)**:
- Post 10: AI Underwriting Inside Encompass
- Post 16: How to Reactivate a Cold Mortgage Database
- Post 29: Will AI Take Over Loan Officers
- Post 35: AI Refinance Outreach Playbook
- Post 48: AI for Mortgage Brokers

**Cluster narrative**: Mortgage LO + broker content. Encompass-specific walkthroughs, compliance, dormant reactivation, LO job market commentary.

### Cluster 4: Vacation Rental + Property Management (hub post #12)

**Hub**: Post 12 `ai-for-vacation-rental-operators`

**Spoke posts (4)**:
- Post 17: Custom AI Layer on Guesty
- Post 22: AI for Vacation Rental Dynamic Pricing
- Post 39: AI for Property Management Framework
- Post 47: AI Assistant for Property Management

**Cluster narrative**: vacation rental + traditional PM. Guesty/Hostaway/Buildium/AppFolio integrations. Dynamic pricing, guest messaging, maintenance coordination.

### Cluster 5: AI SDR / AI Sales (hub post #6)

**Hub**: Post 6 `what-is-an-ai-sdr`

**Spoke posts (2)**:
- Post 11: Best AI SDR Tools Ranked
- (future spokes from Silver/Bronze keyword list)

**Cluster narrative**: AI SDR as role vs tool. Vendor-neutral analysis.

### Cluster 6: AI Workflow + Tools (hub post #14)

**Hub**: Post 14 `ai-workflow-automation-tools-compared`

**Spoke posts (2)**:
- Post 41: AI Data Entry Automation for Real Estate (cross-linked to Cluster 2)
- Post 46: AI Agents vs AI Workflow Automation

**Cluster narrative**: platform-agnostic workflow automation. n8n, Make, Zapier, Gumloop.

### Cluster 7: AI Governance + Compliance (hub post #19)

**Hub**: Post 19 `eu-ai-act-for-us-real-estate-brokerages`

**Spoke posts (2)**:
- Post 20: NIST AI RMF for Mortgage Lenders
- Post 31: AI Governance Template for Small Firms

**Cluster narrative**: compliance as competitive moat. EU AI Act, NIST, ISO 42001. Smaller cluster but high-trust-value.

### Cluster 8: CRM Native AI (hub post #43)

**Hub**: Post 43 `ai-native-crm-explained`

**Spoke posts (2)**:
- Post 28: AI for GoHighLevel Agencies
- Post 30: AI CRM Comparison (Salesforce Einstein vs HubSpot Breeze vs Follow Up Boss Zap)

**Cluster narrative**: native CRM AI features analysis. When to use vs when to bolt on a custom layer.

### Cluster 9: Consulting / Fractional (hub post #8)

**Hub**: Post 8 `ai-consultants-for-small-business`

**Spoke posts (4)**:
- Post 21: Fractional AI Team 90-Day Playbook
- Post 36: AI Agent for Small Business
- Post 37: AI for Management Consulting Firms
- Post 40: Why Big Four AI Consulting Fails for Mid-Market
- Post 42: AI Receptionist for Small Business

**Cluster narrative**: consulting / small business AI. Fractional team framing. Contra Big 4.

### Cluster 10: Dormant Database Reactivation (hub post #7)

**Hub**: Post 7 `ai-dormant-database-reactivation-math`

**Spoke posts (2)**:
- Post 16: How to Reactivate a Cold Mortgage Database (cross-linked to Cluster 3)
- (future spokes)

**Cluster narrative**: the single highest-ROI AI use case. Math + mechanics + specific case studies.

## Inter-cluster bridges (important)

Every cluster hub should link to at least 2 other cluster hubs:

- Cluster 1 (Revenue) → Cluster 2, 3, 4 (all verticals)
- Cluster 2 (Real Estate) → Cluster 1, 3 (revenue + mortgage)
- Cluster 3 (Mortgage) → Cluster 1, 2 (revenue + real estate)
- Cluster 4 (Vacation Rental) → Cluster 1, 6 (revenue + workflow)
- Cluster 5 (AI SDR) → Cluster 1, 8 (revenue + CRM)
- Cluster 6 (Workflow) → Cluster 1, 8 (revenue + CRM)
- Cluster 7 (Governance) → Cluster 2, 3 (real estate + mortgage)
- Cluster 8 (CRM Native) → Cluster 1, 5 (revenue + SDR)
- Cluster 9 (Consulting) → Cluster 1, 7 (revenue + governance)
- Cluster 10 (Reactivation) → Cluster 1, 2, 3 (revenue + real estate + mortgage)

## Cluster index pages (to build in Phase 2 week 10)

Per critic L100 D1, add browsable cluster pages:

- `/blog/real-estate/` → Cluster 2 (16 posts)
- `/blog/mortgage/` → Cluster 3 (6 posts)
- `/blog/vacation-rental/` → Cluster 4 (5 posts)
- `/blog/ai-sdr/` → Cluster 5 (2 posts, will grow)
- `/blog/workflow/` → Cluster 6 + Cluster 8 (merged, 4 posts)
- `/blog/governance/` → Cluster 7 (3 posts)
- `/blog/consulting/` → Cluster 9 (5 posts)

Each cluster index page is a static HTML file emitted by `build.js` (future enhancement) that lists posts in the cluster with excerpts and cluster-specific intro copy.

## Authority flow

Goal: build pagerank from the low-volume-but-winnable Platinum posts up to the high-volume head terms.

Phase 1: Platinum keyword posts rank first (KD 0-11). They build initial links from external citations.

Phase 2: Gold and Silver posts link to Platinum hubs. The hubs accumulate internal link equity.

Phase 3-4: head terms (Silver and Bronze) benefit from accumulated cluster authority and start ranking.

This takes 6-12 months. It requires consistent weekly publishing and disciplined internal linking.
