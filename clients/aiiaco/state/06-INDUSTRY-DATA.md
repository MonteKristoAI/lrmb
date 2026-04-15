# AiiAco — Industry Data Inventory

Complete reference for all 20 industries in `client/src/data/industries.ts`. Source of truth for any rebuild or cleanup.

---

## Removed industries (NEVER re-add)

These 5 were deleted in Round 2 for being off-brand or low-ICP:
1. `high-risk-merchant-services` - chargebacks/adult/CBD connotation
2. `beauty-health-wellness` - SMB wellness, off-brand
3. `cosmetics-personal-care` - low AI budget
4. `helium-specialty-gas` - programmatic SEO spam
5. `biofuel-sustainable-fuels` - commodity shell

## Current 20 industries

### Priority 1 (5 industries with full data population)

These have `directAnswer`, `relatedSlugs`, `faq` (6 Q&A), `regulations`, `platforms`, `roles`. Priority for rendering in IndustryMicrosite (Round 3 task will add visible regulation/platform/role sections).

#### 1. `real-estate-brokerage`
- **name**: Real Estate & Brokerage
- **headline**: AI Integration for Real Estate & Brokerage Operations
- **primary**: true
- **featuredCaseStudyId**: realestate-lead-ops
- **directAnswer**: "AI for real estate brokerages embeds artificial intelligence into lead qualification, listing content, transaction management, and agent productivity workflows. It replaces manual follow-up with automated multi-touch sequences, generates MLS-compliant listing copy at scale, and surfaces deal intelligence for brokers managing dozens of agents."
- **relatedSlugs**: commercial-real-estate, mortgage-lending, luxury-lifestyle-hospitality
- **regulations**: Fair Housing Act (FHA), National Association of Realtors (NAR) Code of Ethics, MLS IDX data-use rules, TILA-RESPA Integrated Disclosure (TRID), CAN-SPAM Act and TCPA for outbound outreach
- **platforms**: Follow Up Boss, kvCORE, BoomTown, Lofty (formerly Chime), BoldTrail, dotloop, SkySlope, Compass, Salesforce Real Estate Cloud
- **roles**: Listing agent, Buyer agent, Transaction coordinator, Brokerage owner, Operations manager, Marketing lead
- **faq (6 Q&A)**:
  1. "How does AI help real estate brokerages qualify leads faster?"
  2. "Can AI write MLS-compliant property descriptions?"
  3. "How does AI integration work with kvCORE, Follow Up Boss, or BoomTown?"
  4. "Does AI replace real estate agents?"
  5. "How long does AI integration take for a real estate brokerage?"
  6. "How does AiiAco handle data privacy and compliance for real estate clients?"

#### 2. `mortgage-lending`
- **name**: Mortgage & Lending
- **headline**: AI Integration for Mortgage & Lending Operations
- **primary**: true
- **featuredCaseStudyId**: mortgage-origination
- **directAnswer**: "AI for mortgage lending automates document extraction, borrower communication, pre-underwriting compliance checks, and pipeline intelligence across the origination lifecycle. It reduces clear-to-close time by 35 to 45 percent and cuts inbound borrower status calls by more than half, while maintaining RESPA, TRID, ECOA, and HMDA compliance on every loan file."
- **relatedSlugs**: real-estate-brokerage, financial-services, insurance
- **regulations**: TILA-RESPA Integrated Disclosure (TRID), Real Estate Settlement Procedures Act (RESPA), Equal Credit Opportunity Act (ECOA), Home Mortgage Disclosure Act (HMDA), Qualified Mortgage and Ability-to-Repay rules (QM/ATR), Uniform Residential Loan Application (URLA 1003), SAFE Mortgage Licensing Act
- **platforms**: ICE Mortgage Technology Encompass, Calyx Point, LendingPad, Blend, Optimal Blue, Fannie Mae Desktop Underwriter (DU), Freddie Mac Loan Product Advisor (LP), MortgageBot LOS, Mortgage Cadence
- **roles**: Loan officer (LO), Loan processor, Underwriter, Closer, Post-closer, Branch manager, Compliance officer
- **faq (6 Q&A)**:
  1. "How does AI reduce clear-to-close time for mortgage lenders?"
  2. "Is AI document extraction RESPA and TRID compliant?"
  3. "Can AI automate borrower communication without losing the personal touch?"
  4. "Which loan origination systems does AiiAco integrate with?"
  5. "Does AI replace underwriters or loan officers?"
  6. "How long does a mortgage AI integration engagement take?"

#### 3. `commercial-real-estate`
- **name**: Commercial Real Estate & Property Management
- **headline**: AI Integration for Commercial Real Estate & Property Management
- **primary**: true
- **directAnswer**: "AI for commercial real estate and property management automates tenant communication, lease administration, predictive maintenance, and portfolio performance reporting. It tracks critical lease dates across entire portfolios, surfaces renewal risk before it materializes, and routes tenant requests without human dispatchers, reducing operational overhead by 60 percent while improving tenant satisfaction."
- **relatedSlugs**: real-estate-brokerage, luxury-lifestyle-hospitality, financial-services
- **regulations**: Americans with Disabilities Act (ADA) compliance, State landlord-tenant laws, Fair Housing Act (for multi-family), OSHA workplace safety rules
- **platforms**: Yardi Voyager, MRI Software, VTS (leasing), CoStar, ARGUS Enterprise, AppFolio, RentCafe, Entrata, Building Engines
- **roles**: Asset manager, Property manager, Leasing director, Portfolio analyst, Maintenance coordinator, Accounting lead
- **faq (5 Q&A)**:
  1. "How does AI help commercial property managers reduce lease administration overhead?"
  2. "Can AI read and summarize commercial leases?"
  3. "How does AiiAco integrate AI with Yardi, MRI, or AppFolio?"
  4. "What does predictive maintenance look like for commercial real estate?"
  5. "How long does AI integration take for a property management firm?"

#### 4. `management-consulting`
- **name**: Management Consulting
- **headline**: AI Integration for Management Consulting Firms
- **primary**: true
- **directAnswer**: "AI for management consulting firms automates proposal and SOW generation, project risk monitoring, knowledge retrieval, and account expansion signals. It compresses proposal preparation time by 55 to 65 percent, surfaces at-risk engagements before they miss milestones, and turns the firm's accumulated delivery history into a searchable internal knowledge layer."
- **relatedSlugs**: financial-services, agency-operations, software-consulting
- **regulations**: Client confidentiality obligations, Data Processing Agreements (DPAs), GDPR and CCPA for EU and California client data, Industry-specific rules for regulated clients
- **platforms**: Kantata (formerly Mavenlink), BigTime, Replicon, Workday Professional Services Automation, Salesforce PSA, Deltek Vantagepoint, Microsoft Dynamics 365 Project Operations
- **roles**: Partner, Principal, Senior manager, Engagement manager, Consultant, Analyst, Knowledge lead
- **faq (5 Q&A)**:
  1. "How does AI help management consulting firms generate proposals faster?"
  2. "Can AI draft client deliverables without exposing confidential data?"
  3. "How does AI integration work with Kantata, BigTime, or Salesforce PSA?"
  4. "Does AI replace junior consultants and analysts?"
  5. "How long does a consulting firm AI integration engagement take?"

#### 5. `luxury-lifestyle-hospitality`
- **name**: Luxury, Lifestyle & Hospitality
- **headline**: AI Integration for Luxury, Lifestyle & Hospitality Operations
- **directAnswer**: "AI for luxury and hospitality operators personalizes guest experience across every touchpoint, automates pre-arrival and in-stay communication, surfaces repeat-guest preference intelligence, and coordinates concierge requests at scale. It preserves the white-glove service standard by removing administrative drag from staff, not replacing the human touch."
- **relatedSlugs**: commercial-real-estate, real-estate-brokerage, food-beverage
- **regulations**: Forbes Travel Guide service standards, Leading Hotels of the World standards, AAA Five Diamond Award criteria, PCI DSS compliance for guest payment data, GDPR and CCPA for guest data handling
- **platforms**: Opera PMS (Oracle Hospitality), Amadeus Central Reservations, Sabre SynXis, SevenRooms, Revinate, Cendyn, ALICE (hotel operations), Knowcross
- **roles**: General manager, Director of guest experience, Head concierge, Revenue manager, Front office manager, Housekeeping manager, Food and beverage director
- **faq (5 Q&A)**:
  1. "Does AI break the luxury service standard?"
  2. "How does AI personalize the guest experience at scale?"
  3. "How does AI integration work with Opera PMS or SevenRooms?"
  4. "Can AI handle VIP and loyalty tier recognition automatically?"
  5. "How long does a luxury hospitality AI integration take?"

### Priority 2 (15 industries with basic data population)

These have `directAnswer` and `relatedSlugs` populated (from Round 2 Phase D Python script). They do NOT have `faq`, `regulations`, `platforms`, or `roles`. Round 3 task is to add these for at least the next 5 (insurance, financial-services, investment-wealth-management, software-technology, agency-operations).

#### 6. `insurance`
- **name**: Insurance
- **directAnswer**: "AI for insurance operations automates claims triage, underwriting support, policy communication, and renewal risk monitoring. It reduces claims cycle time, eliminates manual document routing, and surfaces policy-lapse signals before they affect premium revenue while keeping human adjusters on exception decisions."
- **relatedSlugs**: financial-services, mortgage-lending, investment-wealth-management

#### 7. `financial-services`
- **name**: Financial Services
- **directAnswer**: "AI for financial services firms automates client onboarding, account reconciliation, compliance monitoring, and advisor productivity workflows. It eliminates manual KYC review, flags regulatory reporting gaps, and surfaces cross-sell signals across client portfolios without replacing advisor judgment."
- **relatedSlugs**: investment-wealth-management, insurance, mortgage-lending

#### 8. `investment-wealth-management`
- **name**: Investment & Wealth Management
- **directAnswer**: "AI for investment and wealth management automates client reporting, rebalancing alerts, portfolio analytics, and advisor productivity workflows. It compresses report generation time, surfaces client opportunity signals, and frees advisors to focus on relationship and planning work."
- **relatedSlugs**: financial-services, insurance, mortgage-lending

#### 9. `software-technology`
- **name**: Software & Technology
- **directAnswer**: "AI for software and technology companies automates customer success workflows, accelerates sales qualification, surfaces churn risk signals, and systematizes product feedback. It replaces manual CSM check-ins with automated health monitoring and frees revenue teams to focus on growth."
- **relatedSlugs**: software-engineering, software-consulting, agency-operations

#### 10. `agency-operations`
- **name**: Agency Operations
- **directAnswer**: "AI for agency operations automates client reporting, campaign performance analysis, new-business pitch generation, and account expansion signals. It compresses weekly reporting from hours to minutes and surfaces at-risk accounts before they churn."
- **relatedSlugs**: software-technology, management-consulting, software-consulting

#### 11. `energy`
- **name**: Energy
- **directAnswer**: "AI for the energy sector automates regulatory reporting, operational monitoring, supply chain coordination, and predictive maintenance. It compresses compliance cycles, surfaces equipment failure signals early, and turns siloed operational data into decision-ready intelligence."
- **relatedSlugs**: oil-gas, solar-renewable-energy, alternative-energy

#### 12. `solar-renewable-energy`
- **name**: Solar & Renewable Energy
- **directAnswer**: "AI for solar and renewable energy operators automates project lifecycle monitoring, interconnection status tracking, sustainability reporting, and customer communication. It compresses permitting cycles and surfaces performance degradation signals before they affect generation revenue."
- **relatedSlugs**: energy, alternative-energy, oil-gas

#### 13. `automotive-ev`
- **name**: Automotive & EV
- **directAnswer**: "AI for automotive and EV operators automates service scheduling, charging network coordination, fleet telematics analysis, and customer communication. It turns vehicle and charging data into operational decisions and keeps field teams focused on execution, not coordination."
- **relatedSlugs**: battery-ev-technology, energy, software-technology

#### 14. `food-beverage`
- **name**: Food & Beverage
- **directAnswer**: "AI for food and beverage operators automates supply chain coordination, production quality monitoring, distributor communication, and consumer trend analysis. It reduces waste, surfaces demand signals, and frees operations teams from spreadsheet work."
- **relatedSlugs**: luxury-lifestyle-hospitality, automotive-ev, software-technology

#### 15. `cryptocurrency-digital-assets`
- **name**: Cryptocurrency & Digital Assets
- **directAnswer**: "AI for cryptocurrency and digital asset operators automates compliance monitoring, on-chain transaction analysis, customer onboarding, and risk detection. It scales KYC, AML, and transaction monitoring workflows across high-volume environments without proportional headcount growth."
- **relatedSlugs**: financial-services, investment-wealth-management, software-technology

#### 16. `software-consulting`
- **name**: Software Consulting
- **directAnswer**: "AI for software consulting firms automates proposal generation, engagement risk monitoring, knowledge retrieval, and resource utilization analysis. It reduces proposal cycle time and surfaces delivery risk across active engagements."
- **relatedSlugs**: software-technology, management-consulting, agency-operations

#### 17. `software-engineering`
- **name**: Software Engineering
- **directAnswer**: "AI for software engineering teams automates code review, incident response, knowledge retrieval, and delivery velocity reporting. It frees senior engineers from boilerplate review work and surfaces system reliability signals early."
- **relatedSlugs**: software-technology, software-consulting, agency-operations

#### 18. `oil-gas`
- **name**: Oil & Gas
- **directAnswer**: "AI for oil and gas operators automates regulatory reporting, equipment monitoring, supply chain coordination, and production optimization. It compresses compliance cycles and surfaces operational risk signals across complex facility networks."
- **relatedSlugs**: energy, alternative-energy, solar-renewable-energy

#### 19. `alternative-energy`
- **name**: Alternative Energy
- **directAnswer**: "AI for alternative energy operators automates project reporting, regulatory compliance, performance monitoring, and stakeholder communication. It turns fragmented operational data into decision-ready intelligence without hiring additional data analysts."
- **relatedSlugs**: energy, solar-renewable-energy, oil-gas

#### 20. `battery-ev-technology`
- **name**: Battery & EV Technology
- **directAnswer**: "AI for battery and EV technology companies automates manufacturing quality monitoring, supply chain coordination, regulatory reporting, and customer deployment analysis. It surfaces cell performance signals, compresses compliance cycles, and scales field support operations."
- **relatedSlugs**: automotive-ev, energy, software-technology

---

## Population state matrix

| # | Slug | directAnswer | relatedSlugs | faq | regulations | platforms | roles | primary |
|---|---|---|---|---|---|---|---|---|
| 1 | real-estate-brokerage | ✓ | ✓ | ✓ (6) | ✓ | ✓ | ✓ | ✓ |
| 2 | mortgage-lending | ✓ | ✓ | ✓ (6) | ✓ | ✓ | ✓ | ✓ |
| 3 | commercial-real-estate | ✓ | ✓ | ✓ (5) | ✓ | ✓ | ✓ | ✓ |
| 4 | management-consulting | ✓ | ✓ | ✓ (5) | ✓ | ✓ | ✓ | ✓ |
| 5 | luxury-lifestyle-hospitality | ✓ | ✓ | ✓ (5) | ✓ | ✓ | ✓ | — |
| 6 | insurance | ✓ | ✓ | — | — | — | — | — |
| 7 | financial-services | ✓ | ✓ | — | — | — | — | — |
| 8 | investment-wealth-management | ✓ | ✓ | — | — | — | — | — |
| 9 | software-technology | ✓ | ✓ | — | — | — | — | — |
| 10 | agency-operations | ✓ | ✓ | — | — | — | — | — |
| 11 | energy | ✓ | ✓ | — | — | — | — | — |
| 12 | solar-renewable-energy | ✓ | ✓ | — | — | — | — | — |
| 13 | automotive-ev | ✓ | ✓ | — | — | — | — | — |
| 14 | food-beverage | ✓ | ✓ | — | — | — | — | — |
| 15 | cryptocurrency-digital-assets | ✓ | ✓ | — | — | — | — | — |
| 16 | software-consulting | ✓ | ✓ | — | — | — | — | — |
| 17 | software-engineering | ✓ | ✓ | — | — | — | — | — |
| 18 | oil-gas | ✓ | ✓ | — | — | — | — | — |
| 19 | alternative-energy | ✓ | ✓ | — | — | — | — | — |
| 20 | battery-ev-technology | ✓ | ✓ | — | — | — | — | — |

## Render status in IndustryMicrosite.tsx

Currently renders (all 20):
- `name`, `headline`, `subheadline`, `description` (hero)
- `kpis` (4-tile grid)
- `painPoints` (4-card grid)
- `useCases` (4-card grid)
- `featuredCaseStudyId` (conditional case study section, only for real-estate-brokerage and mortgage-lending)
- `faq` (NEW - conditional FAQ section via FAQSection component, only for priority 5)
- `relatedSlugs` → relatedIndustries (NEW - conditional Related Industries card grid)
- Inline JSON-LD schemas: Service, BreadcrumbList, FAQPage (NEW)

Currently does NOT render (Round 3 opportunity):
- `directAnswer` - should be rendered as prominent definition block at top of hero or after hero
- `regulations` - should be a "Compliance & Regulatory Context" badge grid section
- `platforms` - should be a "Platform Integrations" logo/name grid section
- `roles` - should be a "Who We Work With" list

Adding these sections would push priority 5 industry pages from ~500 words to ~1500-2000 words — closing the content gap vs competitors (audit found 1800-3500 word benchmark).
