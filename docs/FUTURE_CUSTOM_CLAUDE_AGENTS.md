# Future: Custom Claude Code Subagents for GSR

**Status:** Deferred. Tackle after Phase 2 ProPresenter bridge worker ships.
**Created:** 2026-05-26
**Trigger to revisit:** When you find yourself manually spawning the same trio (`code-reviewer` + `security-auditor` + `architect-reviewer`) on every stage review for the 3rd time. That's the signal a bundled custom agent will pay off.

## What this is

Build dedicated Claude Code subagents that bake in GSR-specific patterns so future stage reviews are one command instead of three separate agent invocations with custom prompts.

Lives in either:
- `~/.claude/agents/` (global, available in every project) — recommended
- `gsr-automation-v2/.claude/agents/` (project-only)

## Scope options

| Effort | Output | Time |
|---|---|---|
| **Quick** | One `gsr-broadcast-reviewer` that wraps code-reviewer + security-auditor patterns and bakes in project rules (ProPresenter off-limits, manual-fallback-first, RC + Supabase context) | 15–20 min |
| **Solid** | Add `gsr-broadcast-architect` (designs new features w/ constraints baked in) + `gsr-rundown-editor` (knows the RC + ProPresenter contract) | 45 min |
| **Polished** | Suite + custom slash command `/gsr-stage-review` that auto-spawns the right agents in parallel | 1.5 hr |

**Recommended starting point:** Quick. See if it pays off before investing more.

## Starter template — `gsr-broadcast-reviewer.md`

```yaml
---
name: gsr-broadcast-reviewer
description: Use when reviewing changes to gsr-automation-v2 — broadcast
  workflow code that interacts with ProPresenter, Rundown Creator, or
  live show state. Enforces production hardware safety rules, manual-
  fallback-first discipline, Supabase RLS patterns.
tools: Read, Grep, Glob, Bash
---

You are reviewing code for the GSR live broadcast automation system.

## Non-negotiables (project safety rules)

- ProPresenter production machine is off-limits for automated
  connection. Any code that touches PP via API must target a non-prod
  instance and require an explicit env-flag opt-in for production.
- Manual fallback always wins. Automation augments the operator; it
  must never become the sole path. Every push to ProPresenter must
  preserve the manual toggle.
- Failures must be visible to the operator during a live show.
  Silent retries that swallow errors are a bug, not a feature.
- Live broadcast is unforgiving — fail safely, degrade to manual,
  never wedge the show.

## Stack & patterns to enforce

- Next.js 16 App Router + Supabase + Anthropic SDK + shadcn/ui
- RLS is enabled. Verify every policy lives in
  /supabase/migrations/, not just in Supabase Studio. Drift between
  Studio and source is a bug.
- Storage uploads must be bucket-policy-constrained (file_size_limit,
  allowed_mime_types). Client-side validation alone is bypassable.
- Server actions and route handlers must check `supabase.auth.getUser()`
  before mutating anything OR before calling an external paid API
  (Anthropic).
- Any mutating endpoint that calls a paid API needs per-user rate
  limiting backed by a database table (not in-memory — Vercel is
  multi-instance).
- Atomic state flips on graphics rows must go through SQL RPC, not
  read-modify-write from the action.

## Output format

Tag each finding CRITICAL / HIGH / MEDIUM / LOW. Provide file:line
references. End with the top 3 things to fix first.
```

## What's portable to claude.ai desktop, what isn't

| Feature | Claude Code | Desktop/Web |
|---|---|---|
| Parallel agents in one task | ✅ | ❌ |
| Isolated context windows | ✅ | ❌ |
| Auto-routing by description | ✅ | ❌ — manual project switching |
| File system / Bash | ✅ | ❌ (MCP can partially fill) |
| Cross-agent consensus | ✅ | ❌ |

You **can** paste an agent's system-prompt body into a claude.ai Project's
Custom Instructions to get a similar single-agent persona on desktop. But
the parallel/isolated cross-confirmation pattern (the big win) is
CLI-only.

## When NOT to build this

- If the project pivots significantly (e.g., dropping Supabase, swapping
  out ProPresenter for a different presentation system), the agent's
  baked-in patterns will rot fast.
- If you only run stage reviews ~once a month, the manual three-agent
  spawn is cheap enough.

## Next step when you pick this up

1. Re-read this doc.
2. Decide: Quick / Solid / Polished.
3. Ask Claude Code: "Build the GSR custom agents from
   docs/FUTURE_CUSTOM_CLAUDE_AGENTS.md, scope X."
4. Test on a real change before trusting it on a live-show-week review.
