# GSR Dashboard

Next.js 15 + shadcn/ui + Supabase. Feature 1 lives here.

## Local dev

```bash
cd apps/dashboard
cp .env.example .env.local      # then fill in the real publishable key
npm install
npm run dev
```

Then open http://localhost:3000. Unauthenticated requests redirect to `/login`.

## Auth

Magic-link auth via Supabase. The login page sends an OTP email; clicking the link returns to `/auth/callback`, which exchanges the code for a session cookie and redirects to `/lower-thirds`.

## Routes (Feature 1)

- `/login` - magic-link email submit
- `/auth/callback` - server-side code exchange
- `/lower-thirds` - placeholder review grid (Stage 4 fills it in)
- `/upload` - planned (Stage 3)
- `/import` - planned (Stage 6.5, bootstrap import)
- `/approved` - planned (Stage 6)

## Deploy

Vercel, pointed at this subdirectory. Set the same two env vars in the Vercel project settings.

## Heads-up on Next.js 15

`AGENTS.md` warns that Next.js 15 has breaking changes from earlier versions: `cookies()`, `params`, and `searchParams` are async; route patterns and conventions may differ from training data. Confirm against `node_modules/next/dist/docs/` when in doubt.
