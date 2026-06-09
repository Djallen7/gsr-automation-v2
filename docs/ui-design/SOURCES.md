# UI Sources To Look Into Going Forward

**Date:** 2026-06-07
Curated, high-signal, non-generic. Stack-matched to Next.js 16 / shadcn / Tailwind v4 / Vercel. All URLs verified live. **Start-here picks for a non-developer are marked with a star.**

---

## 1. Design education and principles
- **(star) Refactoring UI** — the book by Tailwind's creators on making things look good without a design degree. Best ROI for a non-dev; turns "looks off" into specific fixes. https://www.refactoringui.com
- **(star) Laws of UX** — 30+ psychology principles (Hick's, Miller's, Fitts's) as plain-English cards. Great for ADHD-friendly reduction of choices. https://lawsofux.com
- **Nielsen Norman Group** — the usability research authority. The "10 Heuristics" article is the one to hand the AI when reviewing a screen. https://www.nngroup.com
- **Edward Tufte, data-ink / chartjunk** — why to erase non-data ink. https://www.edwardtufte.com/notebook/chartjunk/

## 2. Inspiration galleries
- **(star) Mobbin** — 600k+ real production app screens (mobile + web), searchable by flow. The "show me how good apps do this" reference. https://mobbin.com
- **Refero** — Mobbin's complement for B2B SaaS dashboards and AI-app patterns, exactly GSR's category. https://refero.design
- **Godly** — bold, distinctive web design when you want a non-generic look. https://godly.website
- **Land-book** — landing pages filterable by section. https://land-book.com

## 3. Component ecosystems (shadcn / Tailwind v4 compatible)
- **(star) shadcn/ui registry + Blocks** — your foundation; copy-paste dashboard and form blocks. https://ui.shadcn.com
- **Origin UI** — 500+ shadcn-compatible components for compact, dense UIs. https://originui.com
- **Kibo UI** — fills shadcn gaps (Kanban, Gantt, dropzone), `npx kibo-ui add`. https://www.kibo-ui.com
- **Aceternity UI** — motion-rich hero/marketing components. Use for brand pages, not data screens. https://ui.aceternity.com
- **Magic UI** — animated accents and landing blocks, same stack. https://magicui.design

## 4. Color and theme tooling
- **(star) tweakcn** — visual theme editor that exports shadcn + Tailwind v4 CSS variables. Fastest way for a non-dev to dial in the GSR navy/gold palette and hand it to the AI. https://tweakcn.com
- **Realtime Colors** — preview a palette + fonts on a real layout before committing. https://www.realtimecolors.com
- **Radix Colors** — accessible 12-step scales with guaranteed contrast and dark mode. https://www.radix-ui.com/colors
- **OKLCH Color Picker** — Tailwind v4 uses OKLCH natively; keeps colors perceptually even. https://oklch.com

## 5. Typography
- **Google Fonts** — reliable, free, fast on Vercel; where Saira and Geist live. https://fonts.google.com
- **Fontshare** — quality free typefaces beyond Google Fonts. https://www.fontshare.com
- **Utopia fluid type calculator** — clamp()-based responsive type scales, mobile-friendly without breakpoint juggling. https://utopia.fyi/type/calculator
- **Type Scale** — quick modular scale preview. https://typescale.com

## 6. Icons and illustration
- **(star) Lucide** — shadcn's default icon set; consistent, lightweight, already in your stack. https://lucide.dev
- **Phosphor** — 9,000+ icons in 6 weights for a more distinctive look. https://phosphoricons.com
- **Tabler** — 5,900+ MIT icons on a clean 24px grid. https://tabler.io/icons
- **Hugeicons** — 46k icons, 4,600 free, with a Lucide migration tool. https://hugeicons.com

## 7. Charts and data-viz (tradeoff each)
- **Tremor** — now part of Vercel; dashboard charts matching Tailwind/shadcn out of the box. Easiest fit. https://tremor.so
- **Recharts** — simple, declarative; what shadcn Charts wraps. Good default, limited for exotic viz. https://recharts.org
- **nivo** — beautiful presets, heavier bundle; polish fast. https://nivo.rocks
- **visx** — Airbnb's low-level primitives; maximum control, most code. Skip unless a chart truly needs it. https://airbnb.io/visx

## 8. Motion
- **Motion (formerly Framer Motion)** — the React animation standard; subtle transitions, not noise. https://motion.dev
- **tw-animate-css** — the Tailwind v4 replacement for `tailwindcss-animate`; already in your repo. https://github.com/Wombosvideo/tw-animate-css
- **CSS View Transitions (MDN)** — native page/element transitions, no library. https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API

## 9. Accessibility and testing
- **WCAG 2.2 Quick Reference** — the checklist to pass screens against. https://www.w3.org/WAI/WCAG22/quickref
- **WebAIM Contrast Checker** — instant color contrast pass/fail (test the navy/gold pairs). https://webaim.org/resources/contrastchecker
- **axe DevTools** — automated accessibility scanning in the browser. https://www.deque.com/axe

## 10. AI-design workflow (non-dev relevant)
- **(star) v0 by Vercel** — describe a UI in plain English, get shadcn/Tailwind code you can ship on your Vercel stack. Best AI-to-UI fit for GSR. https://v0.dev
- **tweakcn** (also above) — pair with v0: theme in tweakcn, generate in v0. https://tweakcn.com
- **Figma Dev Mode, caveat** — Figma/builder.io exports produce messy, non-shadcn markup. Treat as reference only; never paste into the codebase. Prefer describing intent to v0 or Claude. https://www.figma.com/dev-mode

---

## Domain-specific references the team used
- USWDS Step Indicator (the pipeline rail pattern): https://designsystem.digital.gov/components/step-indicator/
- GOV.UK Character Count (the char meter, show the count, tell how many over): https://design-system.service.gov.uk/components/character-count/
- Stephen Few bullet graphs (count-vs-target in a tiny footprint): https://www.fusioncharts.com/resources/chart-primers/bullet-graph
- Colorblind-safe palettes and redundant color+shape encoding: https://colorblind.io/guides/colorblind-safe-palettes
- NN/g Progressive Disclosure (the two-level rule): https://www.nngroup.com/articles/progressive-disclosure/
- The GSR / David Rives brand source pages: https://davidrivesministries.org/ , https://davidrivesministries.org/gsr/ , https://genesissciencenetwork.com/
</content>
