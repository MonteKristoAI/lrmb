# Money Clarity

## Overview

| Field | Value |
|-------|-------|
| **Client** | Tina Singh |
| **Company** | Money Clarity |
| **Domain** | moneyclarity.me |
| **Industry** | Personal finance education (divorce & loss of spouse niche) |
| **Relationship** | Existing partner |
| **Contact** | Tina Singh - Founder |

## About

Money Clarity is a personal finance education platform for people navigating divorce or the loss of a spouse. Founded by Tina Singh (25 years on Wall Street, $11B raised for Apollo, Brookfield & DoubleLine). The platform provides free interactive financial assessment tools and paid monthly memberships.

**Tagline:** "Know where you stand."

**Positioning:** Not a financial advisor. Educational guidance only. Fee-only advisor advocacy.

**Target audience:** Women going through divorce or who have lost a spouse, suddenly responsible for financial decisions they've never made alone.

## Active Services

| Service | Status | Details |
|---------|--------|---------|
| GHL CRM | Active | Lead capture from quiz tools |
| Website | Live | Static HTML, mobile-first (max-width 420px) |
| Lead Funnel | Active | 6 quiz tools -> n8n webhook -> GHL contact |
| PDF Lead Magnet | Active | "Your Financial First Steps" guide |

## Systems & Credentials

| System | Details |
|--------|---------|
| **GHL Location** | `eUasvZBDtX6BJxWBOahU` |
| **GHL PIT** | `pit-57a74b8d-8930-46c4-9cd8-22e5e281b946` |
| **GHL MCP** | `ghl-moneyclarity` in `.mcp.json` |
| **Payments** | Stripe Checkout (direct links) |
| **Video** | VEED.io embed |
| **n8n Webhook** | `moneyclarity-lead` (lead capture) |

## Brand

| Element | Value |
|---------|-------|
| Teal dark (primary) | `#0a2e2a` |
| Orange accent | `#ff5500` |
| Orange light | `#ff7733` |
| Teal bright (success) | `#00b8a0` |
| Teal pale (bg) | `#e0f5f2` |
| Cream (bg) | `#f8fffe` |
| Heading font | Lora (serif) |
| Body font | Source Sans 3 |

## Subscription Tiers (Stripe)

| Tier | Monthly | Annual |
|------|---------|--------|
| Clarity Starter | $27/mo | $22/mo ($264/yr) |
| Clarity Pro Deep Dive | $49/mo | $39/mo ($468/yr) |
| Inner Circle Direct Access | $199/mo | $159/mo ($1,908/yr) |

Inner Circle limited to 25 members. Application or invitation required.

## Website Structure

| Page | Purpose |
|------|---------|
| `index.html` | Homepage - hero video, Tina story, tool cards, trust metrics |
| `tools.html` | All 6 tools catalog |
| `life-changed.html` | Primary quiz - divorce & loss (5 questions) |
| `can-i-support-myself.html` | Divorce path - income vs expenses |
| `will-i-be-okay.html` | Loss path - financial stability |
| `what-do-i-do-with-this-money.html` | Settlement/inheritance/retirement |
| `money-clarity.html` | General financial snapshot |
| `what-should-i-do.html` | Priority finder |
| `subscribe.html` | Membership pricing (3 Stripe tiers) |

## Folder Structure

```
clients/moneyclarity/
  CLIENT.md          <- This file
  website/           <- All HTML, images, PDF for deployment
  documents/         <- PDF guide copy
  reports/           <- Performance reports
  assets/            <- Brand assets, images
```
