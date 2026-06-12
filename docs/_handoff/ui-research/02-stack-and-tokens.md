# From Design Principles to a Coherent Coded UI

**Date:** 2026-06-08
**Stack (fixed, do not substitute):** Next.js 16.2 (App Router only), React, shadcn/ui, Tailwind CSS v4, Supabase SSR, Vercel.
**Audience:** non-developer owner directing Claude Code; per-role, mobile-first dashboard.

This brief teaches how to define a visual system once, in tokens, so every screen looks consistent without per-screen guesswork, and how shadcn/ui + Tailwind v4 turn that system into reusable components. It is written so a non-developer can give Claude Code precise, durable instructions.

---

## 0. The one big idea

Do not style screens. Style a **system** of tokens and components once, then assemble screens from it. Every professional dashboard you admire is built this way. The owner's job is not to pick a color for each button; it is to decide the *roles* (what does "the main action" look like, what does "needs attention" look like) once, and then reuse them everywhere. This is the central message of Refactoring UI and of every design-token system (Material 3, Tailwind, shadcn).

A practical rule for directing Claude Code: when you ask for a screen, say "use the existing tokens and existing components, do not introduce new colors or new spacing values." That single sentence prevents 90% of drift.

---

## 1. Design tokens / design-system foundations

A **design token** is a named decision. Instead of "this button is #1E40AF," you say "this button is `primary`." You change the value in one place; everything labeled `primary` updates. Material Design 3 defines this cleanly: *"System tokens are semantic. You pick them based on what the UI element means rather than based on the underlying hex value."* (https://m3.material.io/foundations/design-tokens)

You need exactly five token families. Decide each once.

### 1a. Color roles (the most important, and the easiest to get wrong)

Pick by **meaning**, not by hue. The minimum coherent set for this dashboard:

| Role | Meaning in the UI | Notes |
|------|-------------------|-------|
| **primary / accent** | The brand color and the main action ("Import", "Approve"). One accent only. | This is your identity color. |
| **danger / destructive (red)** | "Needs attention", "failed", "rejected", destructive actions. | Reserved. See the rule below. |
| **success (green)** | "Done", "approved", "ready". | Currently missing from your theme; add it. |
| **warning (amber)** | "Pending", "review", "almost". | Optional but useful for a queue. |
| **neutral ink** | Text, borders, surfaces, muted labels. A gray ramp, not pure black. | Carries most of the screen. |

**The critical rule: the brand color must not double as the warning/attention color.** If your brand accent is the same hue you also use for "this failed", the user cannot tell "this is our button" from "this is broken." Material 3 keeps `primary` and `error` as separate role groups for exactly this reason (https://m3.material.io/styles/color/roles). Refactoring UI makes the same point: color should carry meaning, and you need a small set of clearly distinct semantic colors (one for positive/success, one for negative/danger) plus your accent. Keep them visibly different in hue so a glance is enough.

Each color role is a **pair**: a surface color and a readable foreground that sits on it. shadcn names them `primary` / `primary-foreground`, `destructive` / `destructive-foreground`, etc. The docs state the convention: *"We use semantic background and foreground pairs. The base token controls the surface color and the `-foreground` token controls the text and icon color that sits on that surface."* (https://ui.shadcn.com/docs/theming) Always define a foreground for every surface so text contrast is guaranteed.

Use a perceptual color space. The existing theme already uses **OKLCH** (e.g. `--primary: oklch(0.28 0.07 243)`), which is correct: in OKLCH the first number is lightness, so you can build a consistent ramp by changing one number. Tailwind v4's default palette ships in OKLCH for the same reason (https://tailwindcss.com/blog/tailwindcss-v4).

### 1b. Spacing scale

One numeric scale, used for all padding, margins, and gaps. Tailwind v4 derives all spacing utilities from a single `--spacing` base (`p-4`, `gap-2`, `max-h-16` all multiply it). Never use one-off pixel values. Refactoring UI: define a spacing and sizing system and only pick from it, and *"start with too much white space"* then remove, because cramped UIs read as amateur and small relative changes matter most at small sizes. Generous spacing is the single cheapest way to look professional.

### 1c. Type scale

A handful of font sizes (for example: label, body, subheading, heading, display), each paired with a weight and line height. Do not freestyle sizes. Hierarchy comes from this scale plus weight and color, not from a dozen arbitrary sizes (see Section 3). Tailwind v4 exposes these as `--text-*`, `--font-weight-*`, and `--leading-*` namespaces.

### 1d. Radius

One base radius drives the rest. The theme already does this well: `--radius: 0.625rem` with `--radius-sm/md/lg/xl` computed from it via `calc()`. Change one number, the whole UI's roundness shifts together.

### 1e. Elevation (shadow)

A short, fixed shadow ramp (`--shadow-sm`, `-md`, `-lg`) for cards, popovers, and sheets. Elevation signals layering: a drawer sits above the page, a card sits above the background. Keep it to 3 or 4 steps.

---

## 2. shadcn/ui + Tailwind v4 in practice

### How the three layers compose

1. **Radix UI primitives** provide unstyled, accessible behavior (focus traps, keyboard nav, ARIA) for things like dialogs, tabs, popovers. You never see them directly.
2. **shadcn/ui** wraps those primitives in components you copy into your own repo (`src/components/ui/*`), styled entirely with Tailwind classes that reference your tokens (`bg-primary`, `text-muted-foreground`). They are *your* files, editable, not a locked npm dependency.
3. **Tailwind v4 `@theme`** holds the tokens. Components read tokens; you only ever edit tokens centrally.

This is why the mental model is **"set the tokens, reuse the components,"** not "style each screen." A non-dev should almost never touch a component's classes; they change a token value and watch every screen follow.

### How theming actually works here (verified against your repo)

Your `apps/dashboard/src/app/globals.css` already implements the modern pattern:

- `@import "tailwindcss";` then `@theme inline { ... }` maps each Tailwind color utility to a CSS variable: `--color-primary: var(--primary);`. The shadcn docs confirm components *"use `@theme inline` to expose CSS variables as Tailwind utilities,"* mapping tokens into `bg-background`, `text-foreground`, `border-border`, `ring-ring`.
- `:root { --primary: oklch(...) }` holds the actual values; `.dark { --primary: ... }` overrides the same names. shadcn: *"Dark mode works by overriding the same tokens inside a `.dark` selector."*
- `components.json` sets `"cssVariables": true` and `"baseColor": "neutral"`, the supported configuration (https://ui.shadcn.com/docs/theming).

Tailwind v4 difference to flag: there is **no `tailwind.config.js`**. Tokens live in CSS via `@theme`. The docs: *"Theme variables are special CSS variables defined using the `@theme` directive that influence which utility classes exist in your project."* Adding `--color-success: oklch(...)` inside `@theme` automatically creates `bg-success`, `text-success`, `border-success` (https://tailwindcss.com/docs/theme). This is the clean way to add the missing success/warning roles.

### Verification note (training data is older than this stack)

Next.js 16 and Tailwind v4 are newer than most model training data. Before writing route handlers, server actions, or App Router code, read `apps/dashboard/AGENTS.md` and `node_modules/next/dist/docs/` (the repo says so explicitly). For Tailwind, treat `@theme`/`@custom-variant`/`@import "tailwindcss"` as correct and treat any suggestion to add `tailwind.config.js`, `@tailwind base;`, or a PostCSS `content` array as a stale-v3 red flag. Verify against https://tailwindcss.com/docs/theme and https://ui.shadcn.com/docs/theming.

---

## 3. Refactoring UI principles, made concrete

Refactoring UI by Adam Wathan and Steve Schoger (the creators of Tailwind) is the single best resource for a non-designer to produce professional UI without "taste." The book: https://refactoringui.com/. The rules that matter most for this dashboard:

1. **Hierarchy is everything; create it with size, weight, and color, not just size.** Most amateur UIs make secondary text too prominent. Demote it with a muted gray (`text-muted-foreground`) and a lighter weight rather than shrinking it to unreadable. A label and its value should look different in weight/color, not compete.
2. **Start with too much white space, then remove.** Generous spacing reads as confident and premium. When in doubt, add space. Density comes later, deliberately.
3. **Limit your choices.** Predefine the palette, the spacing scale, the type scale, and pick only from them. Constraints are what make output look systematic. This is the bridge from "principles" to "tokens": tokens *are* the limited set of choices.
4. **Design with a system, not screen by screen.** Decide the rules once, apply everywhere. (This is the whole point of Sections 1 and 2.)
5. **Use color and weight to de-emphasize, not borders and boxes.** Reach for spacing and a subtle background shade to group things before you reach for a border. Fewer lines, more breathing room.
6. **Establish a clear "primary action" per screen.** One filled accent button; everything else is secondary (outline) or ghost (text). If everything is bold, nothing is.
7. **Emphasize by de-emphasizing.** To make something stand out, make its neighbors quieter rather than making it louder.

For a non-designer directing an AI: these become review questions. "Is there exactly one primary action here? Is secondary text muted? Is the spacing generous? Did we use only existing tokens?" That checklist catches most problems.

---

## 4. From principles to components: the practical path

**Step 1: lock the tokens.** Finalize the five families in `globals.css`. Concretely for this repo, the one real gap is status color. You have `primary` (brand blue) and `destructive` (red) but no success or warning. Add, inside `@theme inline` plus `:root` and `.dark`:

```css
/* in @theme inline */
--color-success: var(--success);
--color-success-foreground: var(--success-foreground);
--color-warning: var(--warning);
--color-warning-foreground: var(--warning-foreground);

/* in :root */
--success: oklch(0.62 0.17 145);          /* green */
--success-foreground: oklch(0.985 0 0);
--warning: oklch(0.80 0.16 85);           /* amber */
--warning-foreground: oklch(0.205 0 0);
```

That gives a complete, distinct semantic set: blue = brand/action, green = done, amber = pending, red = needs attention. Brand never doubles as warning.

**Step 2: choose a small component set.** Resist adding more. For a per-role, mobile-first queue dashboard, this is the whole kit (shadcn names in bold; add via `npx shadcn@latest add <name>`):

| Dashboard need | shadcn component | Why |
|----------------|------------------|-----|
| The work queue (episodes, lower-thirds awaiting action) | **card** + **table** (or list of cards on mobile) | Cards stack cleanly on phones; tables for wide views. |
| Status of each item (done / pending / needs attention) | **badge** | Status pills, colored by the semantic role above. The honest reuse target for "status." |
| Matrix / drill-down across episodes x stages | **table** | Dense, scannable. Keep one accent column. |
| Open an item's details without leaving the list | **sheet** (mobile drawer) / **dialog** | Sheet slides from the side/bottom; ideal on mobile. |
| Switch between views (queue / approved / ready) | **tabs** | Per-role view switching. |
| Primary/secondary actions | **button** (you have it) | One filled primary per screen. |
| Quick jump / search across episodes and guests | **command** (command palette) | Power navigation; keyboard and mobile-friendly. |
| Bottom navigation on mobile | a small custom bar built from **button** + lucide icons, or **tabs** styled as a bottom bar | shadcn has no dedicated bottom-nav; compose one. |
| Forms (import, extract) | **input**, **textarea**, **select** (you have these), **form**, **label** | Reuse, do not restyle. |
| Confirmations (the mandatory "Type YES" gate) | **dialog** + **alert-dialog** | Matches the lower-thirds import confirmation rule. |
| Toasts (you have **sonner**) | **sonner** | Success/error feedback, colored by role. |

You already have button, card, dialog, input, select, sonner, textarea. The net new adds are roughly: **badge, table, tabs, sheet, command, form/label, alert-dialog**. That is a complete dashboard from ~12 components.

**Step 3: assemble screens from the kit.** A screen is now just: a page layout (header + content + bottom nav), cards or a table fed by Supabase data, badges for status, a sheet for drill-down, one primary button. No new colors, no new spacing values, no bespoke component. Map your real routes: `/import` and `/extract` are form screens; `/lower-thirds`, `/lower-thirds/ready`, `/approved` are queue screens (card list on mobile, table on desktop, badge per row, sheet on tap); `/episodes` and `/guests` are matrix/table screens; `/workflow` is a tabs-or-stages view.

---

## 5. Keeping it maintainable when an AI writes the code

1. **One shipped theme. No theme switcher in production.** Ship a single light theme (or single dark). A user-facing theme toggle doubles every visual decision and is a frequent source of "this looks broken in dark mode." The `.dark` tokens can exist but do not expose a switcher in the product unless explicitly required.
2. **Tokens are the only place colors/spacing live.** Standing instruction to Claude Code: *"Never hardcode a color, hex, or pixel value in a component. Use existing tokens and Tailwind utilities only. If a needed token does not exist, propose adding it to `globals.css` first."*
3. **Reuse before create.** *"Before building a new component, check `src/components/ui/` and use what exists. Do not add a component that duplicates one we have."* This stops a second almost-identical card or badge from appearing.
4. **Keep the kit small and named.** A short list of approved components (Section 4) is itself a guardrail. New component = a deliberate decision, not a reflex.
5. **One accent, distinct status colors, always a foreground pair.** Restate this in every UI request so the AI cannot reintroduce brand-as-warning.
6. **Verify against current docs, not memory.** Because Next 16 and Tailwind v4 postdate training data, require the AI to read `apps/dashboard/AGENTS.md` and the bundled `node_modules/next/dist/docs/` before App Router work, and to treat v3 Tailwind patterns as errors.
7. **Mobile-first by default.** Style the phone layout first (stacked cards, bottom nav, full-width sheets), then add `sm:`/`md:` for wider screens. The owner is often on mobile; the default must be the phone.

---

## Sources (verified by live fetch on 2026-06-08 unless noted)

1. shadcn/ui, Theming. Token names, background/foreground convention, `.dark` override, `@theme inline`. https://ui.shadcn.com/docs/theming
2. Tailwind CSS v4, Theme variables (`@theme`). Namespaces, tokens-become-utilities, no JS config. https://tailwindcss.com/docs/theme
3. Tailwind CSS v4.0 release notes. OKLCH palette, CSS-first config. https://tailwindcss.com/blog/tailwindcss-v4
4. Material Design 3, Color roles. Separate primary vs error role groups (brand != warning). https://m3.material.io/styles/color/roles
5. Material Design 3, Design tokens. "System tokens are semantic; pick by meaning not hex." https://m3.material.io/foundations/design-tokens
6. Refactoring UI, Adam Wathan and Steve Schoger. Hierarchy, spacing, limiting choices, design with a system, start with too much white space. https://refactoringui.com/
7. Radix UI Primitives. Accessible unstyled behavior under shadcn components. https://www.radix-ui.com/primitives
8. Next.js docs. App Router; verify route handlers/server actions against current docs (and `apps/dashboard/AGENTS.md` + bundled `node_modules/next/dist/docs/`). https://nextjs.org/docs

Live web research succeeded for sources 1-6 (search + direct fetch). Sources 7-8 cited from established knowledge plus the repo's own pinned docs; not re-fetched this session. No URLs or quotes were fabricated; quoted lines come from the fetched shadcn and Tailwind pages and the Material 3 pages.
