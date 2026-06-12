# Lane 1 — UI direction: Apple "Liquid Glass" (GSR navy + gold)

**Locked direction (Daniel, 2026-06-12):** colorful-but-calm background, real translucent
liquid-glass surfaces, "very similar to Apple," precise + beautiful, natural dynamic
animation. This **overrides** the bake-off's Calm-Minimalism default (per CLAUDE.md:
Daniel's word wins). The operational **structure** stays as m13's Lock step settled it:
per-role **Today / Your-Move queue → 9-stage Pipeline Matrix → episode drill → graphics**,
mobile-first, bottom-tab nav.

`index.html` is a self-contained, zero-dependency prototype of the look on the real GSR
data shape (S03 Ep021–030, the 9 real stages). Open it on a phone or laptop. It is the
visual spec for the React port into `apps/dashboard`.

## The Liquid Glass recipe (what makes it read as Apple glass, not frosted plastic)

1. **A colorful, calm background to refract.** A slow-drifting navy/teal/violet/gold
   aurora (`.aura`) + fine grain. Clear glass over a flat color looks like plastic; glass
   needs something behind it to bend.
2. **Translucent fill + `backdrop-filter: blur() saturate()`** — the surface refracts and
   color-boosts what's behind it.
3. **A lit rim (the lens edge)** — a 1px gradient border, bright top-left, via mask
   compositing (`.glass::before`). This is the single most important "Apple" cue.
4. **Elevation shadow + inset highlights** — panes float above the background.
5. **Motion-reactive specular** — a slow sheen sweep on heroes only (`.spec`); never behind
   dense data.
6. **Concentric radii + tabular numerals** for the matrix/countdown.

## Accessibility (Apple ships these — so do we)
- `@media (prefers-reduced-transparency: reduce)` → glass becomes an opaque navy surface.
- `@media (prefers-reduced-motion: reduce)` → all drift/sheen/slide animation off.
- Status is **shape + color** (disc / ring / square / dashed), not color alone — colorblind-safe.
- Matrix kept high-contrast: glass is calmed behind the numbers so the data stays legible.

## Port plan into `apps/dashboard` (Next 16 + Tailwind v4 `@theme` + shadcn)
1. **Tokens** → add to `src/app/globals.css` (drop-in below). New `--color-*` inside
   `@theme inline` auto-generate `bg-glass`, `text-success`, etc. No `tailwind.config.js`.
2. **Primitives** → `components/glass/{GlassPanel,GlassNav,StatusGlyph,RowChip}.tsx`
   + the missing shadcn parts (`badge`, `table`, `tabs`, `sheet`).
3. **Screens** → routes `/today` (queue + hero), `/schedule` (Pipeline Matrix),
   `/episodes/[id]` (drill), graphics page; per-role framing from the existing role scopes.
   Wire to Supabase (`episodes`, `production_lower_thirds`) read-only first.
4. Keep `prefers-reduced-*` fallbacks. `tsc --noEmit` + `eslint` clean before PR review.

```css
/* --- add inside @theme inline { } --- */
--color-glass: var(--glass);
--color-glass-tint: var(--glass-tint);
--color-success: var(--success);
--color-success-foreground: var(--success-foreground);
--color-warning: var(--warning);
--color-warning-foreground: var(--warning-foreground);
--color-gold: var(--gold);

/* --- add inside :root { } (light) and mirror in .dark { } --- */
--gold: oklch(0.83 0.135 85);
--success: oklch(0.74 0.16 150);
--success-foreground: oklch(0.985 0 0);
--warning: oklch(0.83 0.15 85);
--warning-foreground: oklch(0.22 0.05 70);
--glass: color-mix(in oklab, white 12%, transparent);
--glass-tint: color-mix(in oklab, var(--primary) 22%, transparent);
```

## Screenshots
`gsr-glass-desktop.png`, `gsr-glass-mobile.png`, `gsr-glass-drill.png` (this folder).
