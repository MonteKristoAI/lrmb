# REIG Solar Internal Linking Graph

**Purpose:** Hub-and-spoke internal linking per post. Prevents link repetition and maximizes pagerank flow across the 50+ published posts.

**Rule:** Every post body must use the link set in its row. Prioritize underused links from LINK-USAGE.md. No more than 2 links may overlap with the previous post's link set.

**URL format:** `https://www.reig-us.com/{slug}/` (ABSOLUTE URLs ONLY, full domain required)

---

## Topic Clusters & Hub Posts

| Cluster | Hub Post (slug) | Hub Authority |
|---------|----------------|---------------|
| Solar SCADA Architecture | solar-plant-scada-system-reference-architecture-diagram | Pillar, high authority |
| Solar SCADA Commissioning | solar-scada-commissioning-to-cod-timeline-milestones | Entry point |
| Solar SCADA Integrator | solar-scada-integrator-roles-deliverables | Entry point |
| SCADA Integration Services | scada-integration-services-scope-deliverables-prevent-rework | Entry point |
| Solar DAS | solar-data-acquisition-system-sensor-map-data-flow | Pillar, sensor focus |
| Utility-Scale Monitoring | utility-scale-solar-monitoring-kpis-pr-availability-and-curtailment | KPI focus |
| Fiber Optic Installation | fiber-optic-installation-solar-farm-direct-buried-vs-conduit | Entry point |
| Pyranometer | pyranometer-utility-scale-pv-accuracy-classes | Entry point |
| Older/General | the-importance-of-scada-and-das-systems-in-a-utility-scale-solar-pv-farm | Legacy pillar |

---

## Cross-Cluster Bridge Strategy

| From Cluster | Bridge To | Natural Connection |
|-------------|-----------|-------------------|
| SCADA Architecture → | DAS | "DAS feeds data into the SCADA system" |
| SCADA Architecture → | Monitoring | "SCADA enables the monitoring KPIs" |
| Commissioning → | Integrator | "The integrator manages commissioning" |
| Commissioning → | Integration Services | "Integration services scope includes commissioning" |
| DAS → | Fiber Optic | "Fiber carries the DAS signal to the control room" |
| DAS → | Pyranometer | "Pyranometers are a key DAS sensor" |
| Monitoring → | DAS | "Monitoring relies on DAS data quality" |
| Fiber → | DAS | "Fiber is the backbone of DAS networking" |
| Pyranometer → | Monitoring | "Pyranometer data feeds monitoring KPIs" |

---

## Per-Post Link Guidelines

For each new REIG post:

1. **Hub link (1):** Link to the cluster hub post listed above
2. **Spoke links (2):** Link to 2 other posts in the same cluster -- choose from LINK-USAGE.md underused list
3. **Bridge link (1):** Link to a post in a DIFFERENT cluster per the bridge strategy above
4. **Non-blog page (1):** Link to a service page (contact-us, services, products, or services/renergyware-hardware-packages)
5. **Older post inclusion (1):** Include at least 1 link to a pre-blog-system post (the older posts are consistently underlinked)

### Underlinked Older Posts (prioritize these)

These older posts rarely receive internal links. Use them when topically relevant:

| Slug | Topic | Good bridge from... |
|------|-------|-------------------|
| solar-das-and-scada-defined | DAS + SCADA basics | Any introductory section |
| the-importance-of-scada-and-das-systems-in-a-utility-scale-solar-pv-farm | Why SCADA matters | Business case / ROI sections |
| why-solar-pv-systems-need-monitoring | Monitoring justification | Monitoring cluster posts |
| its-more-than-a-big-grey-box-hardware-basics | Hardware overview | Architecture posts |
| overcoming-the-challenges-of-fiber-network | Fiber challenges | Fiber cluster posts |
| single-mode-vs-multi-mode-fiber-choosing-the-right-fit-for-your-project | Fiber selection | Fiber cluster posts |
| what-is-an-otdr | OTDR testing | Fiber testing sections |
| the-importance-of-reliable-fusion-splicing-in-modern-networks | Fusion splicing | Fiber QA sections |
| understanding-pyranometers-and-their-role-in-utility-scale-solar-performance | Pyranometer role | Pyranometer cluster posts |
| simplifying-solar-energy-management-the-reig-process | REIG process | CTA / company sections |
| elevating-renewable-energy-the-reig-advantage | REIG advantage | CTA / company sections |

---

## Anchor Text Rules

Use descriptive, keyword-rich anchor text. Never generic.

### Good examples
- "The [reference architecture diagram](https://www.reig-us.com/solar-plant-scada-system-reference-architecture-diagram/) shows where each signal originates."
- "Commissioning teams should follow the [FAT vs SAT testing protocol](https://www.reig-us.com/solar-scada-commissioning-fat-vs-sat-what-to-test-where/)."
- "For a deeper look at fiber path decisions, see [direct-buried vs conduit](https://www.reig-us.com/fiber-optic-installation-solar-farm-direct-buried-vs-conduit/)."

### Bad examples
- "[Read more](...)."
- "[See this article](...)."

---

## Link Density Rules

| Post type | Internal links | External links |
|-----------|---------------|----------------|
| Pillar / architecture | 6-8 | 5-8 |
| How-to / checklist | 4-6 | 3-5 |
| Comparison / selection guide | 4-6 | 3-5 |
| Troubleshooting | 3-5 | 3-5 |
