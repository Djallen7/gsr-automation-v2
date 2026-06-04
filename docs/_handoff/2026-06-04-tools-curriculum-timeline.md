# GSR Automation - Tools, Curriculum, and Build Timeline

*Date: 2026-06-04. Purpose: a single place that says which tools are live, which are deferred, which are barred, what a new builder needs to learn first, and what order to build in.*

## 1. Tool inventory (live / deferred / barred)

### Live and in use
| Tool | Role | Notes |
|---|---|---|
| **Supabase** (`lafkbxypmciopebentxp`) | Database, auth, storage, Edge Functions | The single source of truth (ADR-0012). 45 migrations applied. |
| **Next.js 16.2.6 + shadcn on Vercel** | The dashboard app | Not the Next.js in training data - read `apps/dashboard/AGENTS.md` first. |
| **Anthropic SDK** (`claude-opus-4-7`) | L3 extraction + regeneration | Server-side only; key never reaches the browser. Env override `ANTHROPIC_REGENERATE_MODEL`. |
| **Rundown Creator** (in-app via `/api/rc-*`) | Pull rundown segments into `scripts` | API needs `RundownID` (capital R/D); returns errors as HTTP 200 with `{"error":...}`. Frequent timeouts. |
| **MCP servers (`.mcp.json`)**: supabase, playwright, vercel | Dev tooling | Note: RC and Google Sheets are described as MCPs in CLAUDE.md but are not configured here (RC is now in-app). |
| **1Password CLI** | All credentials | `op item get "<item>" --fields password --reveal`. Vault `GSR Automation`. Never paste creds. |
| **QNAP SMB** | Read-only episode archive | Read-only. No writes, no watchers, no admin. |

### Deferred (designed or researched, not built)
| Tool | Intended role | Why deferred |
|---|---|---|
| **n8n** | Workflow orchestration | Wait until 3+ workflows need it (ADR-0012). Only `workflows/templates/*.json` exist today; `workflows/n8n/` is empty. |
| **YouTube Data API v3** | Auto-publish + read recent uploads | Needs a one-time Google audit to leave private-only. Daniel must clear it. |
| **Whisper** (local faster-whisper or API) | Transcription | Trivial cost; gated behind the Dropbox/audio-companion decision. |
| Fireside / Transistor, StreamHoster / Cloudflare Stream, Cuez | Platform + tooling swaps | Research, not roadmap. Do not act without a decision. |

### Barred (non-negotiable)
- **ProPresenter production machine** `GSN-PropRes` / `100.98.215.7` - "The David Rule." Test machine only, only after David approves.
- **ATEM / Bitfocus Companion** - production hardware.
- **Tailscale / SSH / direct server tools / file-watchers** - permanently barred after the 2026-05-20 security incident.
- **QNAP write access** and **Notion as a backend** (wiki-only after ADR-0012).

## 2. Curriculum - what a new builder must learn before touching code

In order:

1. **The rules.** Read the repo `CLAUDE.md` and this `_handoff/` folder (`HANDOFF.md`, `VERIFIED-FACTS.md`, `2026-06-04-SYSTEM-EVOLUTION.md`). Internalize the barred infrastructure and "The David Rule."
2. **Next.js 16 specifics.** Read `apps/dashboard/AGENTS.md` and the local `node_modules/next/dist/docs/`. Do not assume training-data Next.js patterns; heed build deprecation notices.
3. **Supabase conventions.** RLS on every table before policies; service role server-side only; atomic mutations via RPC; run `list_migrations` before writing SQL; regenerate TS types + run advisors after schema changes; idempotent DDL.
4. **The lower-thirds domain rules.** From `VERIFIED-FACTS.md` section E: ALL CAPS, 55-65 chars (65 ceiling), punctuation bans, the 15 `l3_type` values, the 12 segment values, the locked CTA card, the guest chyron format.
5. **The extraction pipeline.** Understand both paths in `HANDOFF.md` section 4 (manual `/extract` -> `/api/import`; automatic trigger -> Edge Function). Know that the auto-path lands `pending_review` and bypasses the import "Type YES" gate.
6. **Editorial / voice.** The hard bans in `VERIFIED-FACTS.md` section F (no em-dashes, no fact-first hooks, one draft, sign as Daniel not David).
7. **Working with Daniel.** Non-developer, often on mobile. Brief and scannable, recommend don't poll, plain English, no jargon, flag fragile automation and credibility risks loudly, never make him re-enter data that exists somewhere.

## 3. Build timeline

### Done (verified on this branch)
- Feature 1 dashboard: login (magic-link + password), import, lower-thirds review grid, approved queue + ProPresenter copy, font editor.
- Episodes / guests / workflow / toolkit pages.
- Script -> lower-thirds extraction (manual `/extract` + automatic trigger/Edge Function).
- Rundown Creator in-app import (`/api/rc-*`).
- 45 migrations: full schema for episodes, graphics, guests, distributions, transcripts, content/social, production tracking, outreach.

### Now (close out Stage 7)
1. **Decide the auto-extraction governance question** (`HANDOFF.md` section 4).
2. **One real episode end-to-end**: script -> extract -> import (dry-run then YES) -> review -> approved -> ProPresenter copy. That formally closes Stage 7.
3. **Refresh stale docs** per `VERIFIED-FACTS.md` (CLAUDE.md blocker line + route list, BUILD_STATUS counts, production.json episode count, `.env.example` missing vars).

### Next (post-Stage-7 roadmap, from `docs/AUTOMATION_ROADMAP.md`)
4. **YouTube RSS poller** Edge Function - flip `youtube_published_at` when an episode goes live.
5. **Distribution pipeline #1**: Dropbox folder-watch (public endpoint via Edge Function) -> small audio companion -> Whisper transcription -> metadata (video + podcast profiles) -> YouTube auto-publish (after the API audit) -> Rumble via YouTube sync -> Fireside/GSN handoff cards.
6. **Content clips + social posts** UI (schema already exists).
7. **Source-of-Truth map + auto-fill** for guests/dates/deceased status. The DNC-from-email field is the fragile part; best-effort + manual override.

### Risk-card discipline (apply to every new feature)
Score each on **Weight** (1-5 dashboard/runtime load), **Fragility** (1-5 likelihood of breaking), and **API cost** ($/run or none), with a one-line "why." The cleanest entry points are deterministic and cheap (parsing a fixed block); the fragile ones are large-file streaming, third-party APIs that gate or time out, and email parsing.

## 4. Recurring difficulties to design around

From the archaeology of 879 prior conversations - the things that keep biting this project:

1. Conversation truncation mid-task on long script sessions.
2. Iterative rewrite churn (intros/tosses/teases need many passes).
3. Tool/file failures (Drive writes blocked, base64 limits, MCP timeouts, silent tool failures).
4. No cross-session memory (re-pasting scripts, episode-number confusion) - **this is why the handoff folder exists**.
5. Character-count overshoot on chyrons; titles ignoring the 30%-shorter rule.
6. Hook-framework drift (fact-first instead of tension-first).
7. MCP/API timeouts (Rundown Creator especially).
8. Em-dashes sneaking into copy.
9. Suggesting too-recently-aired guests (no air-date check) and fabricating sources/plugs.

Design defensively against these: keep prompts bounded, keep one source of truth, verify before asking Daniel to re-enter anything, and never invent a credential, source, or plug.
