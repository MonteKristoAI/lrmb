# Blog Agent — Reference Documentation

Read this file ON DEMAND only. It is NOT loaded at session startup.
Load specific sections when you need them mid-session.

---

## <a id="mcp"></a>MCP Reference for Blog Work

| MCP | Tool Call | When to Use |
|-----|-----------|-------------|
| **Perplexity** | `mcp__perplexity__perplexity_research` | Phase 0 — statistics, SERP analysis, source discovery |
| **Perplexity** | `mcp__perplexity__perplexity_ask` | Quick fact checks mid-writing |
| **Nanobanana** | `mcp__nanobanana-mcp__set_aspect_ratio` | Before image gen — set 16:9 for hero, 4:3 for inline |
| **Nanobanana** | `mcp__nanobanana-mcp__gemini_generate_image` | Phase 2 — generate hero + inline images |
| **Airtable** | `mcp__airtable__list_records` | Check queue: find next "Not Yet" post |
| **Airtable** | `mcp__airtable__update_records` | Phase 5 — mark post Done in both tables |
| **Google Workspace** | `mcp__google-workspace__createDocument` | Create Google Doc for client review |
| **n8n** | `mcp__n8n-mcp__n8n_test_workflow` | Trigger automation workflows |

---

## <a id="voice"></a>Per-Client Voice Quick Reference

> Note: The persona JSON file (loaded at STARTUP-C) and brief.json contain the authoritative voice rules.
> This section is a quick cross-reference only.

### Breath Mastery (Voice B — SEO/Admin Posts)

- **Opens with:** relatable problem + "why this happens" — never a dictionary definition
- **Mechanism before technique:** explain what is happening in the body before giving the fix
- **Science by institution name:** "Stanford researchers found..." not "(Chen et al., 2023)"
- **One-line wisdom after practical steps** — Dan's distillation style
- **Safety note:** ALWAYS on breathing technique posts (one consolidated note, never scattered)
- **Sentence rhythm:** short fragment / slightly longer explanation / one-liner insight
- **CTAs:** low-pressure and invitational — "start here," "try this tonight"
- **Lineage:** reference Dan's 50+ years, 73 countries, 300,000+ people at least once

### REIG Solar (Technical Voice)

- **Opens with:** specific failure mode or data gap — never background or history
- **Audience declaration:** first paragraph says who this guide is for
- **Definitions before depth:** define any term with engineering significance on first use
- **Standards by name:** IEC 61724-1, NIST SP 800-82, IEEE 1547, NREL reports
- **Five frameworks:** apply at least one per post (Measurement/Meaning/Control, DAS Triad, Five Layers, FAT/SAT/COD, Tiered Testing)
- **Tables required:** every post needs at least one table (comparison, checklist, or deliverables)
- **Where REIG fits:** one explicit subsection per post — practitioner-to-practitioner, not salesy
- **CTAs:** practical and specific — "share your point list," "talk to our team"

---

## <a id="airtable"></a>Airtable Sync Protocol

**Base:** `appZaD3T174afBSaq`
**Request table:** `tblyq7MN2svfMrZNy` — filter `Status = "Not Yet"` to find next post
**Generated table:** `tbl3yijxMg5P58Q6c` — verify row exists after writing

After each post is complete:

```
mcp__airtable__update_records:
  base: appZaD3T174afBSaq
  table: tblyq7MN2svfMrZNy
  record: [request row Airtable ID from REQUESTS.md]
  fields: { "Status": "Done", "Completed At": "YYYY-MM-DD" }
```

To find the next post to generate:

```
mcp__airtable__list_records:
  base: appZaD3T174afBSaq
  table: tblyq7MN2svfMrZNy
  filterByFormula: {Status} = "Not Yet"
  maxRecords: 1
```
