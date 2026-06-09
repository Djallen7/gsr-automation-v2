# How to ping a fresh session with a prompt every 5 hours

You asked for a way to resume and ping a session on a 5-hour cadence, "doesn't matter how, as long as it happens." Here is the honest architecture and the exact setup.

## The honest design choice
You cannot literally keep one Claude session alive for 25 hours, and a paused session cannot be re-pinged from outside. So instead of "resume the same session," each tick is a **fresh run that reloads durable state from this repo** (`RESUME-PROMPT.md` + `SESSION-LOG.md` + the dossiers) and continues exactly where the last tick stopped. That is more robust than session-resume: nothing is lost when a session ends or a usage window resets. Two engines drive the ticks; use either or both.

---

## Engine A - GitHub Actions cron (recommended, no phone needed)
The workflow `.github/workflows/ui-research-loop.yml` is already in the repo. It fires every 5 hours, reads the resume prompt, does the next chunk, and commits findings back.

**Arm it (3 steps, one time):**
1. **Add the key.** Repo > Settings > Secrets and variables > Actions > New repository secret. Name it `ANTHROPIC_API_KEY` (an Anthropic API key), or `CLAUDE_CODE_OAUTH_TOKEN` for a Max/Pro subscription token (then uncomment that line in the workflow).
2. **Put the workflow on `main`.** GitHub only runs `schedule:` triggers from the default branch. Merge this branch (or cherry-pick just the workflow file) to `main`. Until then, the cron will not fire (but the manual triggers below still work from any branch).
3. **Confirm the action.** Open `https://github.com/anthropics/claude-code-action`, check the current version and input names, and adjust the `uses:` line if needed (the action API changes over time).

It then runs at 00:00, 05:00, 10:00, 15:00, 20:00 UTC. 
**To stop:** create an empty file `docs/ui-research-program/STOP`, or remove the secret, or delete the workflow.
**Cost:** each tick consumes Claude usage/credits and pushes a commit. GitHub cron can be delayed a few minutes under load.

---

## Engine B - iPhone Shortcut (on-demand, or your own schedule)
This fires the same workflow via a `repository_dispatch` event. Good for "kick it now" and for a phone-driven schedule.

**1. Make a token.** GitHub > Settings > Developer settings > Fine-grained personal access tokens > Generate. Scope it to `Djallen7/gsr-automation-v2`, permission **Contents: Read and write**. Copy the token.

**2. Build the Shortcut** (Shortcuts app > new shortcut, one action):
- Action: **Get Contents of URL**
  - URL: `https://api.github.com/repos/Djallen7/gsr-automation-v2/dispatches`
  - Method: **POST**
  - Headers:
    - `Authorization` = `Bearer YOUR_TOKEN`
    - `Accept` = `application/vnd.github+json`
    - `X-GitHub-Api-Version` = `2022-11-28`
  - Request Body: **JSON**, one field: `event_type` (Text) = `ui-research-tick`
- Name it "Ping GSR Research." Tapping it now triggers a tick. Watch the repo's Actions tab to confirm.

**3. Schedule it every ~5 hours.** Shortcuts > Automation > Create Personal Automation > **Time of Day**. iOS only repeats Daily/Weekly/Monthly, so create **five daily time automations** (for example 12:30am, 5:30am, 10:30am, 3:30pm, 8:30pm), each set to run "Ping GSR Research," and turn **Ask Before Running** off. (Or skip this and let Engine A's cron be the clock, using the Shortcut only for manual kicks.)

**Test from a terminal (optional):**
```
curl -X POST https://api.github.com/repos/Djallen7/gsr-automation-v2/dispatches \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{"event_type":"ui-research-tick"}'
```

---

## Engine C - alternatives worth knowing
- **Claude Code on the web triggers / scheduled sessions:** the web product supports triggers and sources; check `https://code.claude.com/docs/en/claude-code-on-the-web` for a native schedule that may avoid GitHub entirely.
- **The `/loop` skill:** runs a prompt on an interval, but only inside a live session, so it does not survive a usage-window reset. Useful for a single attended stretch, not the 25-hour program.

## What I can and cannot do
I scaffolded the workflow, the resume prompt, and the program docs, all committed and inert. I cannot add the secret or merge to `main` for you (no access to secrets; I only push to the feature branch), so Engine A needs those two clicks from you. Engine B is entirely in your hands (token + Shortcut). Either one delivers the 5-hour cadence.
