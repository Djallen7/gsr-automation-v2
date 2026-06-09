# Welcome to GSR Automation

## How We Use Claude

Based on Claude's usage over the last 30 days:

Work Type Breakdown:
  _TODO — only 1 session in the scan window, not enough signal to classify. Re-run once there's more history._

Top Skills & Commands:
  _TODO — no slash commands recorded in the scan window._

Top MCP Servers:
  _TODO — no MCP calls recorded in the scan window._

## Your Setup Checklist

### Codebases
- [ ] gsr-automation-v2 — https://github.com/djallen7/gsr-automation-v2

### MCP Servers to Activate
- [ ] GitHub — PRs, issues, CI status, code search. Ask Daniel for repo access, then connect the GitHub MCP server.
- [ ] Supabase — the production database (project `lafkbxypmciopebentxp`): tables, migrations, advisors, logs. Request access to the Supabase org from Daniel.
- [ ] Vercel — deployments and runtime logs for the `apps/dashboard` Next.js app. Get added to the Vercel team.
- [ ] Google Drive & Gmail — show assets and ministry correspondence. Authenticate with your David Rives Ministries Google account.
- [ ] Postman — API collection management for the external integrations. Optional; ask if your work touches API specs.
- [ ] Playwright — browser automation for UI checks. Local, no access request needed.

### Skills to Know About
- [ ] /code-review — review the current diff for bugs and cleanups. Used before pushing dashboard changes.
- [ ] /security-review — security pass over pending changes. Important here because the system touches production ministry hardware.
- [ ] /verify and /run — launch the dashboard and confirm a change works for real, not just in tests.
- [ ] /deep-research — multi-source, fact-checked research reports.
- [ ] gsr-architect (subagent) — boots already knowing the whole GSR system; invoke it for any GSR work.
- [ ] gsr-health (subagent) — repo-health auditor; run at the start of a build session.

## Team Tips

_TODO_

## Get Started

_TODO_

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
