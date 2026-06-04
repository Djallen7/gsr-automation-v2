# GSR Automation — Software Curriculum Map
**Date:** 2026-06-04
**Purpose:** Complete inventory of every software component in the GSR automation system, organized by layer, with learning priority order for curriculum development.

---

## Recommended Learning Order

| Priority | Software | Why first |
|---|---|---|
| 1 | TypeScript | Foundation — everything else in the dashboard is TypeScript |
| 2 | React + Next.js App Router | The entire dashboard front-end |
| 3 | SQL / PostgreSQL + Row Level Security | The data layer |
| 4 | Supabase | Auth + database + storage as one managed service |
| 5 | REST APIs + HTTP clients (fetch / requests) | How Claude connects to external services |
| 6 | Zod | How data is validated before touching the database |
| 7 | MCP (Model Context Protocol) | How Claude connects to tools |
| 8 | Python 3 basics | Scripts in `skills/` and `davidrives-mail/` |
| 9 | Git + GitHub workflow | Branches, PRs, squash merges |
| 10 | ffmpeg + Whisper | Future transcription pipeline (gsr-blueprint) |

---

## Layer 1 — Dashboard Front-End

*What you see in the browser. Lives in `gsr-automation-v2/apps/dashboard`.*

| Software | Version | Role in system | Key concepts |
|---|---|---|---|
| **Next.js** | 16 | React framework. Handles routing, server-side rendering, API routes, and server actions. **Not the Next.js in most training data** — App Router only, no Pages Router. | App Router, server components, server actions, route handlers |
| **React** | via Next.js | UI component model. Every page and button is a React component. | Components, hooks, state, props |
| **TypeScript** | required | Typed JavaScript. Catches bugs before code runs. All dashboard files are `.tsx`. | Types, interfaces, generics, enums |
| **shadcn/ui** | latest | Pre-built component library (buttons, tables, modals, forms). Built on Tailwind + Radix. | Component composition, theming |
| **Tailwind CSS** | latest | Utility-first CSS. All visual styling via class names in JSX. | Utility classes, responsive design |
| **Radix UI** | via shadcn | Headless accessible primitives under shadcn (dropdowns, dialogs, toggles). | Accessibility, headless components |

---

## Layer 2 — Back-End / Database

*Where all data lives. One Supabase project: `lafkbxypmciopebentxp`.*

| Software | Role in system | Key concepts |
|---|---|---|
| **Supabase** | The entire back-end: PostgreSQL database, authentication, file storage, and API. One project hosts all of it. | BaaS (Backend-as-a-Service), project management, MCP integration |
| **PostgreSQL** | The relational database inside Supabase. All episodes, graphics, and assets stored here. 45 migrations applied. | Tables, columns, foreign keys, enums, unique constraints, indexes |
| **Row Level Security (RLS)** | PostgreSQL feature controlling who can read/write each row. Enabled on every table — this is the security layer. | Policies, `auth.uid()`, service role vs. anon role |
| **Supabase Auth** | Magic-link email login. No passwords. Auth state handled server-side via SSR cookies. | Magic links, JWT, session cookies, SSR auth |
| **Supabase Storage** | File/asset bucket storage. Used for graphics assets. Bucket: `lower-thirds`. | Buckets, signed URLs, RLS on storage |
| **SQL (DDL + DML)** | Used for migrations (DDL) and queries (DML). All migrations are idempotent (`IF NOT EXISTS`, `OR REPLACE`). | `CREATE TABLE`, `ALTER TABLE`, `INSERT`, `SELECT`, `UPDATE`, `ON CONFLICT` upsert |
| **SQL RPCs (Functions)** | Atomic state mutations (e.g., toggling `propresenter_added`) go through SQL functions, not read-modify-write from a route handler. | `CREATE OR REPLACE FUNCTION`, `SECURITY DEFINER` |
| **Zod** | TypeScript schema validation library. Every bulk import is Zod-validated before touching the database. | `.parse()`, `.safeParse()`, object schemas, refinements |
| **Vercel** | Deployment platform. Runs Next.js in production via serverless functions. Manages environment variables. | Serverless functions, edge runtime, env vars, deploy previews |

---

## Layer 3 — AI / Intelligence

| Software | Role in system | Key concepts |
|---|---|---|
| **Anthropic Claude API** | Called server-side to regenerate lower-third graphics copy. Model: `claude-opus-4-7`. Never called from the browser — server only. | API keys, messages array, system prompts, streaming vs. batch |
| **Anthropic SDK** (`@anthropic-ai/sdk`) | Node.js library that calls the Claude API. Handles auth, retries, and streaming. | SDK initialization, `messages.create()`, rate limiting |
| **Claude Code** | The development environment used to build and maintain all repos. | Session context, tools, agents, MCP, hooks |
| **MCP (Model Context Protocol)** | Protocol connecting Claude to external tools (Supabase, Rundown Creator, Google Sheets). Analogous to USB — a standard plug for AI tool connections. | Server setup, tool definitions, tool calls, resources |

---

## Layer 4 — External APIs and Integrations

| Software | Role in system | Interface type | Key concepts |
|---|---|---|---|
| **Rundown Creator API** | Show rundown management. Claude reads/writes rundown rows via MCP. Known quirk: use numeric column IDs, not string names. | REST (HTTP GET with params) | API keys, query params, JSON responses, rate limits |
| **Google Sheets API** | Powers the graphics tracking spreadsheet. Accessed via Google Sheets MCP or Composio fallback. | REST + OAuth | OAuth 2.0, spreadsheet IDs, range notation, read vs. write scopes |
| **YouTube Data API v3** | Video uploads and scheduling to GSR YouTube channel (`UCNZS3IEQaAfwofwltbEBwuw`). | REST + OAuth | OAuth 2.0, resumable uploads, video metadata, scheduling |
| **Dropbox API** | File distribution target. Episodes uploaded here post-production. | REST + OAuth | OAuth 2.0, upload sessions, folder structure |
| **Composio** | API aggregation wrapper for Google Sheets. Unreliable as of 2026-05-28 — prefer native Google Sheets MCP. | Wrapper service | Third-party integrations, reliability tradeoffs |
| **Signiant Media Shuttle** | Broadcast-grade file transfer for episode delivery. Currently uses a Google Form submission interface. | Web form | Broadcast delivery standards |
| **Streamhoster API** | On-demand content streaming. One of the 6 weekly upload destinations. | REST | API key auth, upload endpoints |
| **Fireside.fm** | Podcast hosting for the GSR companion audio podcast. | Web/API | Podcast RSS, audio uploads |
| **Google Calendar API** | Filming schedule. Label: `PROD \| GSR Interviews`. | REST + OAuth | OAuth 2.0, event queries, calendar IDs |

---

## Layer 5 — Python Scripts

*Lives in `skills/` and `davidrives-mail/`.*

| Software | Role in system | Key concepts |
|---|---|---|
| **Python 3.11+** | Used for standalone scripts. Primary language for Rundown Creator export and the email CLI. | Variables, functions, error handling, `os.environ` |
| **`requests` library** | HTTP client. Used to call the Rundown Creator REST API from Python. | `requests.get()`, params, JSON parsing |
| **`os.environ`** (stdlib) | Reads API credentials from environment variables at runtime, not from hardcoded values. | `os.environ.get()`, `.env` files |
| **`imaplib`** (stdlib) | Python standard library for reading email via IMAP. Used in `davidrives-mail`. | IMAP protocol, SSL connections, folder navigation, UID-based message fetching |
| **`smtplib`** (stdlib) | Python standard library for sending email via SMTP. | SMTP AUTH, TLS, message construction |
| **`email`** (stdlib) | Parses and constructs email messages (MIME format). Works alongside `imaplib`/`smtplib`. | MIME types, headers, attachments |

---

## Layer 6 — Secrets Management and Infrastructure

| Software | Role in system | Key concepts |
|---|---|---|
| **1Password CLI (`op`)** | Retrieves credentials at runtime. Every sensitive value is fetched with `op item get "..." --fields password --reveal` — nothing hardcoded, nothing on disk. | CLI auth, item names, field references, `--reveal` flag |
| **GitHub** | Version control and hosting for all 7 repos. All feature work goes through branches + draft PRs. | Repos, branches, PRs, draft PRs, squash merge |
| **Git** | Distributed version control. Branch naming convention: `feat/`, `chore/`, `fix/`. Squash merges to keep main history clean. | Commits, branches, merge vs. squash, `.gitignore` |
| **`.env` files** | Local environment variable files (never committed). Used by Next.js and Python scripts to load API keys at runtime. | `.env`, `.env.local`, `.env.example`, `process.env` |

---

## Layer 7 — Development Toolchain

| Software | Role in system | Key concepts |
|---|---|---|
| **Node.js** | JavaScript runtime. Required to run the Next.js dashboard locally and to run build/lint tools. | Runtime environment, `node_modules`, npm scripts |
| **npm** | Package manager. Manages all Next.js, Supabase, and UI library dependencies. | `package.json`, `package-lock.json`, `npm install`, `npx` |
| **TypeScript Compiler (`tsc`)** | Run as `npx tsc --noEmit` before every commit. Finds type errors without generating output files. Must be clean before a PR. | `tsconfig.json`, `noEmit`, strict mode |
| **ESLint** | Linting for TypeScript/JavaScript. Run as `npx eslint src/`. Must be clean before a PR. | Lint rules, `eslint.config.js`, auto-fix |

---

## Layer 8 — Email

*Lives in `davidrives-mail/`. Mailbox: `dallen@davidrives.com` on cPanel at `mail.davidrives.com`.*

| Protocol / Software | Role | Details |
|---|---|---|
| **IMAP** | Email reading protocol. Used to fetch inbox, search messages, and read by UID. | Port 993, SSL, `imaplib` |
| **SMTP** | Email sending protocol. | Port 465, implicit TLS, `smtplib` |
| **cPanel Mail** | The mail server hosting `dallen@davidrives.com`. | Shared hosting mail, not Gmail |

> **Note:** `davidrives-mail` shipped with a blocked Dovecot auth smoke test. Re-test against the live server before relying on it.

---

## Layer 9 — Future Build (gsr-blueprint — not yet implemented)

*Planned for the next phase: Dropbox → transcription → metadata → YouTube pipeline.*

| Software | Planned role | Key concepts |
|---|---|---|
| **ffmpeg** | Audio/video processing and format conversion. Extracts audio from episode files for transcription. | CLI tool, codec flags, audio extraction |
| **faster-whisper** | Local AI transcription. Converts episode audio to text for metadata generation. Runs on the Edit Bay Mac Mini. | Whisper model sizes, word-level timestamps, GPU vs. CPU |
| **fswatch** | File system watcher on macOS. Detects when a new episode lands in a folder and triggers the pipeline. | Event-based watching, macOS FSEvents, callback patterns |

---

## Layer 10 — Production Hardware (not automated — architectural context)

These are in the system but permanently off-limits to automation. Understanding *why* explains many of the guardrails in the code.

| Hardware / Software | Current status | Why off-limits |
|---|---|---|
| **ProPresenter 7** | In production. Live-to-tape graphics display. | "The David Rule" — David Rives is on-air. A bad command during a live shoot falls on him. Test machine only until he explicitly approves a test pathway. |
| **QNAP NAS (SMB)** | Read-only file storage. | Admin access permanently revoked (ADR-0011, 2026-05-20 incident). SSH blocked by the NAS itself after failed attempts. SMB read-only only. |
| **ATEM** | Live broadcast video switcher. | Production hardware. No automation ever. |
| **Bitfocus Companion** | Control surface for ATEM and other broadcast gear. | Production hardware. No automation ever. |
| **Tailscale** | VPN for remote network access. | Permanently off-limits after server incident on 2026-05-20. All automation must go through cloud APIs. |

---

## System Data Flow (how all layers connect)

```
[Rundown Creator]
      │ MCP
      ▼
[Claude Code] ──────────────────────────────────────► [Google Sheets]
      │                                                     (graphics tracking)
      │ TypeScript / Next.js API routes
      ▼
[Zod validation]
      │
      ▼
[Supabase (PostgreSQL + RLS + Auth + Storage)]
      │
      ▼
[Next.js Dashboard — Vercel]
  /import          bulk JSON ingest
  /lower-thirds    review / approve / reject / regenerate
  /approved        ProPresenter copy queue
  /upload          PNG upload
  /api/import      dry-run + live import
  /api/regenerate  ──► Claude API (claude-opus-4-7)
      │
      ▼
[Human approval gate — Daniel or Miryam]
      │
      ▼
[Distribution: YouTube / Rumble / Dropbox / Fireside / Signiant / StreamHoster]
```

---

## Quick Reference: Where Each Technology Lives in the Repo

| Technology | Repo | Path |
|---|---|---|
| Next.js / React / TypeScript / shadcn | `gsr-automation-v2` | `apps/dashboard/src/` |
| Supabase migrations (SQL) | `gsr-automation-v2` | `supabase/migrations/` |
| Supabase schema design doc | `gsr-automation-v2` | `docs/SUPABASE_SCHEMA_DESIGN.md` |
| Anthropic SDK (Claude API) | `gsr-automation-v2` | `apps/dashboard/src/app/api/regenerate/` |
| Zod validation | `gsr-automation-v2` | `apps/dashboard/src/app/api/import/` |
| Production config (platforms, episode count) | `gsr-automation-v2` | `config/production.json` |
| Python / Rundown Creator export | `skills` | `export_shows.py` |
| Python / Email CLI | `davidrives-mail` | `dmail/imap_client.py`, `dmail/smtp_client.py` |
| Future pipeline design | `gsr-blueprint` | `docs/2026-06-03-gsr-handoff.md` |
| Architecture decisions (ADRs) | `gsr-automation-v2` | `docs/decisions/` |
