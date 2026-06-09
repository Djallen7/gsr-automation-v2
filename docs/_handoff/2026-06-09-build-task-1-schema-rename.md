# Build Task 1 — Lower-thirds / graphics table split (the spine, do FIRST)

**Status:** QUEUED as the first task of the next stable build session. Decisions locked 2026-06-09; do not re-litigate them, just execute.

**Why first:** the Lower Thirds page is the first vertical slice and sits on this table. Renaming after the page (and more code) reference the old name costs more. Both tables are at or near zero rows (pre-launch), so now is the cheapest and safest time.

## Prerequisites, in order
0. **Sync to origin first.** The environment reset and wiped local state ~4 times on 2026-06-08. Every session: `git fetch origin <branch> && git reset --hard origin/<branch>` before doing anything.
1. **Strip the review-only static files** from `apps/dashboard/public/` (`course.html`, `course-overview.html`, `review.html`, `gsr-flight-worksheet.html` if present) and revert the middleware carve-out that exempts them. They were for mobile review only and should not ship to production.
2. **Merge PR #47 to main** (tsc + eslint clean first), then branch fresh off main as `feat/lower-thirds-table`.

## The migration (one concern, idempotent DDL)
- **Rename** table `graphics` -> `production_lower_thirds`. KEEP `production_graphics` as the graphics tracker; do NOT rename it.
- **Drop columns** from `production_lower_thirds`: `current_image_url`, `asset_source_urls` (lower thirds are text-only, confirmed 2026-06-09). Confirm nothing else depends on them first.
- **Add ordering columns** to `production_lower_thirds`: `segment_order int`, `l3_type_order int`, `line_number int` (so rows always export in order).
- **Variations storage, decide by READING THE CODE first.** Both `var_1`/`var_2` columns on the row AND a `graphics_variations` child table currently exist (redundant). The regenerate / import / upload code uses `graphics_variations`. Recommended: keep the child table, rename it `lower_thirds_variations`, repoint its FK to `production_lower_thirds`, and drop the redundant `var_1`/`var_2` columns. But verify against `lower-thirds/review-grid.tsx`, `lower-thirds/actions.ts`, `api/regenerate/route.ts`, `upload/upload-form.tsx` before committing to it. Do NOT drop the variations table blindly (that was an earlier mistaken call).
- **`production_graphics`: add** `display_duration` (graphic on-screen duration; match the unit RC consumes, likely int seconds or a "~N sentences" text) and `last_line text` (the last script line before the next graphic). Reconcile with the existing `lastline_trigger boolean` (the boolean flags trigger rows; the new column holds the actual text).
- **`production_graphics.graphic_type` CHECK:** add "Intro Graphic" and "Book Cover"; retire "Title Graphic" and migrate any existing "Title Graphic" rows to "Intro Graphic". Confirm the `status` CHECK order is Not Started -> In Progress -> Created -> Loaded In (canon).
- **App-side, not schema:** set the lower-thirds character validator to 55-70 (60-65 ideal); Topic L3 60-65.

## Code update (must land WITH the migration; ~20 call sites)
- Replace `.from('graphics')` -> `.from('production_lower_thirds')` in: `api/import/route.ts` (x2), `api/regenerate/route.ts`, `api/scripts/confirm-extraction/route.ts` (x2), `approved/page.tsx`, `lower-thirds/actions.ts` (x4), `lower-thirds/ready/page.tsx`, `lower-thirds/review-grid.tsx` (x2), `upload/upload-form.tsx` (x2).
- Update `.from('graphics_variations')` per the variations decision (likely `-> lower_thirds_variations`): `regenerate` (x2), `lower-thirds/actions.ts`, `upload-form.tsx`, `import`.
- Update TS types/interfaces that mean lower thirds; regenerate Supabase types.
- Grep the 17 files that mention "graphics" for stray string/comment references that mean the LT table.

## Verify (all must pass before merge)
- `cd apps/dashboard && npx tsc --noEmit` and `npx eslint src/` clean.
- `list_migrations` shows the new migration applied remotely.
- `get_advisors` (security + performance) clean.
- Read-back: both table structures correct; `/lower-thirds`, `/approved`, `/import` pages load.
- Update `CLAUDE.md` "Project State" (the "lower-thirds table is `graphics`" note becomes `production_lower_thirds`) and canon section 0's DB-table line.

## Then
Build the Lower Thirds vertical slice on the clean `production_lower_thirds` table (the first page), wired to a stub of the home view.
