# Supabase migrations

Source-controlled SQL for the GSR dashboard database. Each file is idempotent — safe to apply against an empty dev project, the existing prod project, or replay after a partial failure.

## Migrations

| File | Purpose |
|---|---|
| `20260526120000_baseline_rls.sql` | Captures existing RLS policies as code (was previously only in `FEATURE_1_LOWER_THIRDS.md`). |
| `20260526120100_storage_bucket_hardening.sql` | Adds 5 MB cap + PNG-only mime restriction to the `lower-thirds` storage bucket. |
| `20260526120200_regenerate_rate_limit.sql` | New `regenerate_attempts` table for per-user rate limiting of `/api/regenerate`. |
| `20260526120300_propresenter_atomic_toggle.sql` | `toggle_propresenter_added` RPC for atomic, race-free flips of `graphics.propresenter_added`. |

## Applying

These files are not auto-applied. To push to the remote project:

```bash
# from repo root
supabase link --project-ref lafkbxypmciopebentxp   # one-time
supabase db push                                    # applies new migrations
```

Or paste each file into Supabase Studio → SQL Editor and run manually.

## Why idempotent

The dashboard's prod DB already has most of these policies — they were created by hand in Studio during Stage 1. These migrations use `drop policy if exists` / `create or replace` patterns so re-running them is a no-op when the target state matches.
