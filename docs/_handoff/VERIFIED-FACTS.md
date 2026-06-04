# Verified facts (June 4, 2026) - baked into the course

Verdicts from a current-state verification pass. These are the deltas that matter for accuracy.

| # | Area | Verdict | The fact to stand behind |
|---|------|---------|--------------------------|
| 1 | WhisperKit | Corrected | v1.0.0 (May 2026). Repo RENAMED to `argmax-oss-swift`; bundles SpeakerKit. 2.2% WER is a VENDOR benchmark; independent leaderboards show ~7-13%. Mac-native. |
| 2 | YouTube quota | Confirmed | Upload cost cut ~1,600 -> ~100 units on Dec 4, 2025. ~100 uploads/day on the 10,000-unit free quota; videos.insert separately capped 100/day. |
| 3 | Make vs n8n | Confirmed | Make.com Core ~$10.59/mo (annual), most GUI-friendly. n8n Cloud Starter $24/mo, 2,500 execs, HALTS on cap (a 5-min poll burns it in ~9 days). n8n self-host free (Sustainable Use License, fair-code, not OSI). |
| 4 | Notion / Frame.io | Confirmed | Notion Plus $10/user/mo, ~3 req/sec; the 5MB cap is FREE-tier only. Frame.io V4 API in early access for non-enterprise; Pro $15/member/mo, Team $25. (Notion is wiki-only in v2; the SSOT is Supabase.) |
| 5 | Backblaze B2 | Confirmed (1 caveat) | ~$6/TB/mo; free egress to 3x stored; no retrieval fees; S3-compatible. Cloudflare Bandwidth Alliance still works but is deprecating - keep an R2/direct-egress fallback. |
| 6 | Fireside.fm | Confirmed | Read-only Metrics API only (March 2026); NO publish API. Transistor.fm and Buzzsprout DO have publish APIs (migration path if podcast publishing must be automated). |
| 7 | ProPresenter API | Confirmed | REST API in 7.9+ (now v21.x) at openapi.propresenter.com. Can trigger/clear Props (lower thirds); CANNOT author presentations. Bitfocus Companion module confirmed. |
| 8 | obs-localvocal | Mostly confirmed | Real, arm64-native, ~118k downloads. Default model is Tiny.en (not small.en). ~1-3s latency plausible but not officially spec'd. No diarization yet. |
| 9 | Claude Skills / antislop / Vale | Mixed | Skills launched Oct 16, 2025. "Skills 2.0" is unofficial shorthand - cite "skill-creator update March 2026." **"Antislop" is NOT an Anthropic concept** - use general few-shot guidance + Vale. Vale is brew-installable (confirmed). |
| 10 | youtubeuploader | Confirmed (stale) | porjo/youtubeuploader v1.25.5 (Aug 2025), ~10 months without a release. Pin it; budget for a maintenance pickup. |
| 11 | Framework currency | Confirmed | Next.js 16 App Router current (16.2 generates AGENTS.md/CLAUDE.md); Pages Router legacy. `@supabase/ssr` current; `@supabase/auth-helpers-nextjs` deprecated at 0.15.0. Tailwind v4 CSS-first. shadcn `npx shadcn@latest` (CLI v4, March 2026). Zod 4; SDK has `zodOutputFormat`. |
| 12 | MCP | Confirmed | Anthropic-created, OpenAI adopted (Mar 2025), donated to the Linux Foundation Agentic AI Foundation (Dec 9, 2025). Connects AI clients to Supabase, Sheets, filesystems, etc. |

**Three hedges to always apply:** WhisperKit WER is a vendor number; the Cloudflare-Backblaze egress deal is deprecating (have a fallback); "antislop" is a community term, not an Anthropic finding.
