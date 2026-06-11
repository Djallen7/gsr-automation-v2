# GSR Dashboard

Next.js 16.2.6 (App Router) + shadcn/ui + Supabase. Feature 1 (Episode Graphics & Asset Tracker) lives here.

## Local dev

```bash
cd apps/dashboard
cp ../../.env.example .env.local   # then fill in the real keys
npm install
npm run dev
```

Then open http://localhost:3000. Unauthenticated requests redirect to `/login`.

## Auth

Supabase Auth via `@supabase/ssr` (magic link + password). The login page sends an OTP email; clicking the link returns to `/auth/callback`, which exchanges the code for a session cookie. Recovery routes to `/update-password`.

## Routes (live)

- `/login`, `/update-password`, `/auth/callback` — auth
- `/lower-thirds`, `/lower-thirds/ready`, `/approved` — review and output
- `/extract` — paste a script, run AI extraction (returns a payload for `/api/import`)
- `/import` — Zod-validated bulk ingest (dry-run then type YES)
- `/episodes`, `/guests`, `/workflow`, `/toolkit` — tracking + prompt library
- `/upload` — legacy PNG upload
- API: `/api/import`, `/api/extract-lower-thirds`, `/api/regenerate`, `/api/scripts`, `/api/scripts/confirm-extraction`, `/api/rc-explore`, `/api/rc-import`

## Deploy

Vercel, pointed at this subdirectory. Set the env vars from `.env.example` in the Vercel project settings.

## Heads-up on Next.js 16

This is **not** the Next.js in your training data. `cookies()`, `params`, and `searchParams` are async; App Router only (no `pages/`), `@supabase/ssr` (not the deprecated `@supabase/auth-helpers-nextjs`). Read `AGENTS.md` and `node_modules/next/dist/docs/` before writing route handlers or server actions.
