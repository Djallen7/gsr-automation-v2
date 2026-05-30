# Session Handoff — 2026-05-30

**For the next Claude session, contractor, or future Daniel reading this cold.**
**Project owner:** Daniel Allen — `danielallen.tn@gmail.com` / GitHub: `Djallen7`
**Active repo:** `github.com/Djallen7/gsr-automation-v2`

> **The authoritative visual overview is `BUILD_STATUS.html` at repo root — open it in a browser first.**
> This doc covers what BUILD_STATUS.html doesn't: PR state, blockers, and what to do next.

---

## What is running in production right now

**Live Vercel deployment** — Next.js 16 dashboard, Supabase backend (`lafkbxypmciopebentxp`).

| Route | What it does | Status |
|---|---|---|
| `/login` | Magic link + password auth | ✅ Live |
| `/upload` | Legacy PNG upload (being phased out) | ✅ Live — legacy |
| `/import` | Paste JSON → bulk ingest lower thirds | ✅ Live |
| `/lower-thirds` | Review grid — approve / reject / regenerate | ✅ Live |
| `/approved` | Approved queue with ProPresenter copy button | ✅ Live |
| `/toolkit` | 20 production-grounded AI prompts | ✅ Live |
| `/update-password` | Post-magic-link password reset | ✅ Live |
| `/api/import` | POST bulk ingest, dry-run + live modes | ✅ Live |
| `/api/regenerate` | POST Claude API call, rate-limited, deduped | ✅ Live |
| `/auth/callback` | Supabase auth redirect | ✅ Live |

**Database:** 43 migrations applied. Key tables: `episodes` (48 S3 rows), `guests` (175 seed guests), `lower_thirds`, `episode_guests`, `content_clips`, `social_posts`, `distributions`.

---

## The one thing blocking forward progress

**Stage 7 is blocked by a lower thirds JSON schema mismatch.**

The `/import` route exists. The Claude extraction prompt exists (PR #34 adds `/api/extract-lower-thirds`). They generate JSON that doesn't match the actual `lower_thirds` table column names. Error: "JSON parsed but no recognized fields found."

**To fix:** Run `list_tables` on the Supabase `lower_thirds` table, compare columns against what `/api/import` expects (Zod schema in `apps/dashboard/src/app/api/import/route.ts`), align them. Hours of work, not days.

**When Stage 7 passes:** Import one real episode (S03 Ep021-025 all filmed May 28-29) → review → approve → ProPresenter copy. Feature 1 is done.

---

## Open pull requests (all draft)

| PR | Branch | What it adds | Base | Action |
|---|---|---|---|---|
| #37 | `feat/gsr-voice-profile` | GSR voice profile, editorial agent, full project retrospective HTML doc, roadmap updates | main | **Ready to review** — merge when Daniel approves |
| #36 | `chore/health-check-automation` | Twice-daily GitHub Actions health checks, route checker, config validator, gsr-health agent | main | Ready — merge after #37 |
| #35 | `feat/dashboard-nav-guests-workflow-episodes` | `/guests`, `/workflow`, `/episodes` pages + nav links | ⚠️ non-main base | Needs rebase onto main before merge |
| #34 | `feat/script-extract-pipeline` | `/extract` page + `/api/extract-lower-thirds` (Stage 7 enabler) | main | **Merge this to unblock Stage 7** |

**Merge order:** #34 first (unblocks Stage 7), then #37 (docs), then #36 (health), then #35 after rebase.

---

## Key constraints to never forget

1. **No Tailscale or direct server access** — server incident May 20 makes this permanently off-limits. All automation is cloud APIs or read-only SMB.
2. **ProPresenter production machine off-limits** — "The David Rule." No automated connection to GSN-PropRes (100.98.215.7) until David Rives explicitly approves a test machine pathway.
3. **QNAP: read-only SMB only** — no writes, no chokidar watchers.
4. **Notion: wiki-only** — ADR-0012 (2026-05-23) closed Notion as a backend. Do not extend `scripts/notion_*.py`.
5. **RC MCP timeouts are normal** — Rundown Creator MCP times out frequently. Requires periodic restart. This is a known issue, not something to debug unless Daniel asks.
6. **Composio is unreliable** — went down May 28. Prefer native Google Sheets MCP if available.

---

## What was filmed in May 2026

S03 Ep021-025 filmed May 28-29. Rundown Creator RundownIDs: 79 (Ep021), 81 (Ep022), 83 (Ep023), 82 (Ep024), 84 (Ep025). Remaining interviews June 15: Jerry Bergman, Dan Janzen, Dr. Ming Wang, David Coppedge.

Last confirmed aired episode: S03 Ep015 (air 2026-05-19, YouTube 2026-05-25).

---

## After Stage 7: what's next in priority order

| Priority | Task | Notes |
|---|---|---|
| 1 | YouTube RSS poller Edge Function | Hourly cron → flip `youtube_published_at` for aired episodes. Schema ready. |
| 2 | Guest email workflow UI (`/workflow`) | Already built in PR #35 — just needs merge after rebase |
| 3 | Episode hub UI (`/episodes`) | Also in PR #35 |
| 4 | Content clips + social posts UI | Schema live; no UI yet |
| 5 | Timecode + title pipeline | Highest-volume repeated manual task |

---

## How to orient in a new session

```bash
git status
git log --oneline -5
git fetch origin main && git log --oneline origin/main -3
```

Then open `BUILD_STATUS.html` in a browser. Read CLAUDE.md for the full rules.
Read `docs/GSR_PIPELINE_HISTORY.html` in a browser for the full project backstory.

---

## What NOT to do

- Do not propose new tool evaluations or architecture changes. Stack is settled.
- Do not build new dashboard features until Stage 7 completes one full episode run.
- Do not write Notion-backend solutions. ADR-0012 closed that.
- Do not push directly to `main`. All work on feature branches + draft PRs.
- Do not SSH into any server without Daniel saying "yes, SSH into [machine]."
- Do not fabricate creationsuperstore.com product plugs — always verify against the real site.

---

## Key files quick reference

| File | Purpose |
|---|---|
| `CLAUDE.md` | Session rules, security, Anti-Churn Rule — read every session |
| `BUILD_STATUS.html` | Visual build overview — open in browser |
| `docs/AUTOMATION_ROADMAP.md` | Future task queue with priorities |
| `docs/GSR_PIPELINE_HISTORY.html` | Full project retrospective (open in browser) |
| `docs/GSR_VOICE_PROFILE.md` | David Rives writing voice reference |
| `docs/PROMPT_LIBRARY.md` | 20 production prompts |
| `apps/dashboard/AGENTS.md` | Next.js 16 caveats — read before any route work |
| `supabase/migrations/` | 43 applied migrations |
| `agents/gsr-editorial.md` | Editorial agent (copy to `~/.claude/agents/`) |
