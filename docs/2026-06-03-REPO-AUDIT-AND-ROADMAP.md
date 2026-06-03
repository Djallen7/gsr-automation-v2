# GSR Repository Audit and Recovery Roadmap
**Date:** 2026-06-03
**Scope:** All 7 repos owned by djallen7 (gsr-automation-v2, gsr-blueprint, gsr-automation, davidrives-mail, gsn-subchannel-campaign, gsrguestportal, skills)
**Method:** Two full passes. Pass 1 read every file in every repo. Pass 2 (deeper) read the dashboard source code, verified claims against the live GitHub API, and scanned for secrets and contradictions.

---

## Why this exists
After merging many PRs without updating the docs, the project state on paper drifted away from the project state in the code and on GitHub. This document is the corrected single source of truth as of 2026-06-03. Where a doc and this file disagree, this file was checked against the actual code and GitHub API, so trust this file.

---

## The 60-second summary
1. You are not as lost as it feels. The live repo (gsr-automation-v2) is healthy and the cleanup is already 80 percent done in an open PR (#40).
2. Three real passwords or tokens are sitting in plain text in committed files. This is the only true emergency. Rotate them.
3. The "Stage 7 is blocked by a lower_thirds schema mismatch" note is wrong. There is no lower_thirds table. The code is fine. The blocker, if any, is operational (remote database), not a code bug.
4. The "54 PRs / 4 drafts waiting" notes are wrong. Real numbers: 31 merged, only 1 PR open (#40). Merge #40 and most of the doc bloat disappears.
5. The old repo (gsr-automation) is a stale twin of v2 and is the single biggest source of confusion. Archive it.

---

## 1. What each repo actually is

| Repo | What it is | Status | Action |
|---|---|---|---|
| **gsr-automation-v2** | Live repo. Next.js + Supabase dashboard. Feature 1 (episode graphics tracker). 45 migrations. | Active, healthy | Keep. Merge PR #40. |
| **gsr-blueprint** | Design staging for the NEXT build (Dropbox to transcription to metadata to YouTube). Design only, no code. | Active, design only | Keep. Fix bad paths (see Section 5). |
| **gsr-automation** | The original pre-Supabase repo. Stale twin of v2. Its MASTER_CONTEXT still says the database is Notion. | Superseded | Archive on GitHub. |
| **davidrives-mail** | Email CLI for dallen@davidrives.com. Pulls password from 1Password at runtime (clean). | Active | Keep. Re-test (see note). |
| **gsn-subchannel-campaign** | Live TV station outreach campaign. All files dated today. Warm-intro emails ready. | Active | Keep. Fix the hours figure (Section 4). |
| **gsrguestportal** | Static HTML guest portal. Last touched Feb 2025. No PRs ever. One-line README. | Dormant 16 months | Confirm unused, then archive. |
| **skills** | Anthropic skills library (shared). Contains one GSR script with hardcoded credentials. | Keep | Remove the secret (Section 2). |

---

## 2. URGENT: three live secrets in committed files

These are real credentials, not placeholders. Treat all three as compromised and rotate them. This is your only true emergency.

| # | File | Secret | Action |
|---|---|---|---|
| 1 | `skills/export_shows.py` line 5 | Rundown Creator API_KEY (`danielallen`) | Rotate the key at rundowncreator.com. Replace with an env var. |
| 2 | `skills/export_shows.py` line 6 | Rundown Creator API_TOKEN (30-char token) | Rotate the token. Same fix. |
| 3 | `gsr-automation/docs/MASTER_CONTEXT.md` AND `gsr-automation-v2/docs/MASTER_CONTEXT.md` | QNAP admin password (`admin1 / QnAp7627`) in plain text in both repos | Rotate the QNAP password. Remove from both docs. Keep only in 1Password. The doc itself already admits this should have been rotated. |

After rotating, the old values still live in git history. To fully remove them, purge with BFG or git filter-repo. At minimum, rotate now so the exposed values stop working.

---

## 3. The phantom blocker (most important correction)

CLAUDE.md says: "lower thirds import blocked by JSON schema mismatch vs actual lower_thirds table columns."

This is false. The code dive confirmed:
- There is no `lower_thirds` table anywhere in the 45 migrations. The real table is `graphics`.
- The `/api/import` Zod schema matches the `graphics` table field for field. No mismatch exists in the code.
- "Lower thirds" is only the feature name and a storage bucket name, never a table.

What this means: stop hunting for a schema bug in the import route. If Stage 7 import is genuinely failing, the cause is operational, not the JSON shape. Check, in order:
1. Are all 45 migrations actually applied on the remote Supabase project? (run `list_migrations`)
2. Does the `episodes (season, episode_number)` unique constraint exist? The import upsert relies on it for `onConflict`.
3. Are the RLS insert policies on `graphics` and `graphics_variations` present?

---

## 4. Factual contradictions to resolve

| Topic | Conflict | Authoritative answer | Risk |
|---|---|---|---|
| **Database** | gsr-automation says Notion; v2 says Supabase | Supabase (ADR-0012) | High. Archiving the old repo fixes this. |
| **Season 3 episode count (inside v2)** | `config/production.json` says 25; `CLAUDE.md` says 48 | Decide and reconcile. 25 = aired/planned, 48 = DB rows incl. extrapolated. | High. Same repo disagrees with itself. |
| **GSN content hours** | Pitch materials say "nearly 1,000 hours"; internal truth is "270 hours". The team setup guide wrongly uses 1,000 as an internal fact. | 270 hours internal. 1,000 is external pitch framing only. | High (David Rule). Fix `GSN_Team_Project_Setup_Guide.docx` so internal docs say 270. |
| **GSN carriage count** | Disclosure rule: external copy never says "only two stations" | Two stations (WGGS, WGGN) is the fact; open-ended framing is intentional | Medium. Not a contradiction, a rule to follow. |
| **Air dates** | DB has extrapolated Tuesday dates; handoff says the "2026 Airing Schedule" Google Sheet is canonical | The Google Sheet wins | High (David Rule). Extrapolated dates are known-suspect. |
| **/upload page** | Docs call it "legacy, being phased out"; code shows it fully wired into nav and functional | Code wins. It is NOT phased out. | Medium. Decide: keep or actually retire it. |
| **Co-maintainer name** | "Miriam" (v1) vs "Miryam" (v2) | Pick one spelling | Low. |

---

## 5. Broken paths that disable the safety guardrails

`gsr-blueprint/CLAUDE.md`, `gsr-blueprint/docs/2026-06-03-gsr-handoff.md`, and `davidrives-mail/README.md` all reference macOS paths like `/Users/claudefix/Documents/GitHub/...` and `~/Documents/GitHub/...`.

In this environment the repos live at `/home/user/<repo>` on Linux. The guardrail that says "do not write into gsr-automation-v2" points at a path that does not exist here, so it silently does not fire. Update these paths, or the protection is fake.

---

## 6. GitHub ground truth (verified against the live API)

| Repo | Open PRs | Merged PRs | Note |
|---|---|---|---|
| gsr-automation-v2 | 1 (#40 draft) | 31 (not 54) | #40 is the cleanup PR. Currently conflicted (dirty). |
| gsr-automation | 2 (#11, #12 draft) | 3 | Both open PRs touch Notion. Stale since May 21. Close them. |
| gsr-blueprint | 1 (#1 draft) | 0 | The mock/agent draft. Fresh. |
| skills | 1 (#2 draft) | 1 | Open since May 19. |
| davidrives-mail | 0 | 1 | PR #1 merged with its live smoke test BLOCKED (Dovecot auth failed). Likely untested against the live server. |
| gsn-subchannel-campaign | 0 | 0 | Docs only. |
| gsrguestportal | 0 | 0 | Dormant. |

Corrections to the docs: there are not 54 merged PRs (there are 31). PRs #34 and #35 are closed-unmerged, not "waiting." PRs #36 and #37 already merged on 2026-05-30. There is no queue of 4 drafts. The only thing open and worth your attention is #40.

Stale branches: v2 has ~20 leftover branches from squash-merges. Harmless but worth a cleanup pass. None hold lost open work except #40.

---

## 7. PR #40 already does most of the cleanup

PR #40 ("Foundation cleanup") is an open draft that already:
- Removes `notion-import/`, `scripts/notion_*.py`, `workflows/` n8n templates, the 3.5M `archaeology_data.json`, and committed binaries (~26k lines).
- Archives analysis docs to `docs/archive/` and moves `FEATURE_1_*` to `docs/features/`.
- Marks ADRs 0001/0009/0010/0011 as superseded by ADR-0012.
- Refreshes the stale migration counts.
- Hardens the Supabase MCP to read-only and adds a pre-commit secret hook.

So the doc-bloat problem is largely solved already. The job is to get #40 un-conflicted and merged, not to redo the deletions. Note: #40's pre-commit hook only blocks `NEXT_PUBLIC_` secrets, so it does NOT catch the three live secrets in Section 2. Those still need manual rotation.

---

## 8. Recommended order of operations

### Today (emergency only)
1. Rotate the three secrets in Section 2 (Rundown Creator key + token, QNAP password).

### This week
2. Resolve the merge conflicts on PR #40 and merge it. That clears most of the bloat in one move.
3. Archive the `gsr-automation` repo on GitHub. It is the stale twin causing the Notion-vs-Supabase confusion. Close its two stale Notion PRs (#11, #12) first.
4. Fix the broken `/Users/claudefix/` paths (Section 5) so the guardrails actually work.

### Next
5. Correct CLAUDE.md: remove the phantom "lower_thirds blocker" line; reconcile the 25-vs-48 episode count; fix the /upload "legacy" claim.
6. Verify the real Stage 7 status using the operational checks in Section 3, then run the episode test.
7. Fix the "1,000 hours" figure in `GSN_Team_Project_Setup_Guide.docx` so internal docs say 270.
8. Confirm gsrguestportal is unused, then archive it. Re-test davidrives-mail against the live server (it shipped with a blocked smoke test).

### When ready for the next build
9. Return to gsr-blueprint: answer the 6 open questions in `docs/2026-06-03-gsr-handoff.md` section 17, build the mock, then implement the v1 distribution slice.

---

## 9. Your north-star files (when in doubt, these win)
- Session rules: `gsr-automation-v2/CLAUDE.md`
- Current state: `gsr-automation-v2/BUILD_STATUS.html`
- Decisions: `gsr-automation-v2/DECISION_LOG_2026-05-22.md`
- Roadmap: `gsr-automation-v2/START_HERE.md`
- Next build: `gsr-blueprint/docs/2026-06-03-gsr-handoff.md`
- GSN campaign: `gsn-subchannel-campaign/README.md`
- This audit: this file.
