# GSR Hub — Design Bible

Living reference for the GSR Hub production tool. Three role-based frontends (Producer, Myriam, Isaac) pulling from a shared Notion data layer, built on Next.js with an Apple Liquid Glass aesthetic merged toward a "Cosmic Liquid Glass" signature.

This folder is the single source of truth for design direction and technical patterns. Implementation lives in `/app`, `/components`, etc.

## Documents

| File | What's inside | When to open it |
|---|---|---|
| [`00-ui-bible-foundation.md`](./00-ui-bible-foundation.md) | Round 1 Bible. Liquid Glass design language, role-based dashboard patterns, Notion-as-CMS, Next.js architecture, component libraries, typography, color palette, 10-week roadmap. The "what to build" reference. | First read. Answers most "how should I design X?" questions. |
| [`01-design-direction-exploration.md`](./01-design-direction-exploration.md) | Round 2 wide-stretch aesthetic survey. 14 directions evaluated (editorial, broadcast graphics, brutalist, ambient 3D, museum, sacred geometry, etc.) with verdicts. Recommends **Cosmic Liquid Glass** as the signature aesthetic. | When picking aesthetic moves or merging styles. Before committing to a visual direction. |
| [`02-technical-knowledge-base.md`](./02-technical-knowledge-base.md) | Round 2 durable technical reference. 17 chapters: App Router patterns, Notion API integration, real-time data (SSE, webhooks, polling), TanStack Query, auth, AI metadata generation, component libraries, animation perf, accessibility for glass UIs, state management, role-based routing, mobile gestures, deployment. | During implementation. Reference when you hit a specific engineering decision. |

## Reading order

- **Designing:** `00` → `01` → mock up
- **Building:** `00` → `02` → ship
- **Stuck:** Search all three. Round 2 docs are intentionally non-redundant with Round 1 — they reference back when overlap occurs.

## Status

- [x] Round 1 research (foundation)
- [x] Round 2 research (wide direction + deep technical)
- [ ] Aesthetic direction locked in (currently leaning Cosmic Liquid Glass)
- [ ] Producer dashboard mockups
- [ ] Myriam upload queue mockups
- [ ] Isaac graphics tracker mockups
- [ ] Next.js + Notion data layer scaffold

## Notes

- Don't rewrite these docs in-place when something changes — add an ADR in `/docs/adrs/` and link to it from the relevant section. Keeps the research trail intact.
- These are research artifacts, not specifications. Opinions in them are starting points, not commitments.
