# Context Bootstrap Prompt — New Account / New Session

Paste this into the **first message** of a new Claude session on a different account (or any time you start fresh and need Claude to catch up on the project). This works in both regular Claude (claude.ai) and Claude Code.

**Before pasting:**
- Make sure your GitHub repo is set up and contains the docs
- Replace `[REPO_URL]` below with your actual GitHub repo URL (e.g. `https://github.com/yourusername/gsr-automation`)
- If the repo is private, you may need to either make it temporarily public OR paste the docs directly (see end of this file)

---

I'm continuing work on a project from a previous Claude account. I need you to get up to speed by reading my GitHub repo, which contains everything you need to know.

**About me:**
- Young, risk-averse, relatively inexperienced broadcast TV producer
- Working with my colleague Miriam (we both have Macs)
- I prefer straightforward answers and honest opinions over hedged options
- I'm a non-developer using AI assistance to build a custom automation system
- Default to concise, production-ready output. Deliver the deliverable, not an explanation of the deliverable.

**The project:**
I'm building a post-production automation system for Genesis Science Report (GSR) — a Christian creation-science TV show — and adjacent ministry shows for David Rives Ministries. The system handles file detection on our NAS, AI metadata generation, approval workflows, and multi-platform distribution to YouTube, Rumble, Dropbox, Fireside.fm, Signiant Media Shuttle, and StreamHoster.

**What I need you to do now:**

1. **Fetch and read these files from my GitHub repo** in this order:
   - `[REPO_URL]/blob/main/README.md` — Project overview
   - `[REPO_URL]/blob/main/docs/PROJECT_PLAN.md` — The phased build plan (READ THIS CAREFULLY — it has phase boundaries, exit criteria, and success rates)
   - `[REPO_URL]/blob/main/docs/decisions/` — All ADR files (architecture decisions already locked in)
   - `[REPO_URL]/blob/main/docs/FAILURE_MODES.md` — 12 documented risks I'm actively defending against
   - `[REPO_URL]/blob/main/docs/OPEN_SOURCE_STACK.md` — Building blocks I've chosen for each component
   - `[REPO_URL]/blob/main/docs/GSR_METADATA_PATTERN.md` — YouTube channel patterns the AI needs to follow

2. **After reading, summarize back to me:**
   - What phase I'm currently in
   - The 3-5 most important architecture decisions already locked in
   - What's explicitly OUT of the current phase (so you don't suggest those features)
   - Any blockers or open questions you noticed
   
   Keep the summary tight — 200 words max.

3. **Then ask me ONE question:** What do I want to work on in this session?

**Important constraints — read carefully:**

- **Do NOT suggest scope expansion.** If something isn't in the current phase's plan, the answer is "that's deferred." Help me execute the existing plan, not redesign it.
- **Do NOT suggest "shiny new" alternatives** to tools already chosen in `OPEN_SOURCE_STACK.md`. Those decisions are locked.
- **Do NOT skip the failure mode defenses.** If we're writing code, the countermeasures from `FAILURE_MODES.md` apply.
- **If I ask you to do something that contradicts the project plan,** flag it. Don't silently comply — ask whether I'm intentionally changing the plan, and if so, remind me to update the relevant ADR or open a GitHub Issue with the `plan-change` label.
- **Default scope:** Phase 1. If I say "let's work on Phase 2 stuff," remind me of the Phase 1 exit criteria and ask whether I've actually met them.

**For session-specific decisions:**
- Small adjustments → just do them, mention to commit afterward
- Significant decisions → suggest writing an ADR in `docs/decisions/`
- Anything that changes the project plan → suggest a GitHub Issue with `plan-change` label

**For handoff continuity across accounts:**
- If I make a decision in this session that needs to persist, suggest I document it in the repo before ending the session
- Git is the source of truth, not chat history

Now go read those files and report back.

---

## Fallback: If the repo is private and you can't grant access

If the new Claude account can't fetch from GitHub (private repo, no integration, web search blocked, etc.), do this instead:

1. Open each markdown file in your GitHub repo
2. Click "Raw" view
3. Copy the content
4. Paste it into the new chat with this structure:

```
I'm continuing work from a previous Claude account. Below are the project docs I need you to read before we work together. After reading all of them, summarize the current phase, the locked architectural decisions, and what's out of scope. Then ask me what I want to work on.

=== README.md ===
[paste content]

=== PROJECT_PLAN.md ===
[paste content]

=== ADR-0001 ===
[paste content]

[...etc...]

[Then paste the user constraints from the bootstrap prompt above]
```

This is slower but works around any access limitations.

---

## When to re-run this bootstrap

Run this bootstrap prompt anytime you:
- Switch to a new Claude account
- Start a new project (no past chats yet)
- Notice Claude is suggesting things that contradict your project plan
- Come back to the project after a long break
- Want a fresh Claude perspective without lingering context from past sessions

You don't need to run it every session within the same account — Claude's chat history and memory handle continuity within an account.

---

## Updating this bootstrap over time

This prompt will get stale as the project evolves. Update it whenever:
- You enter a new phase (change "Phase 1" defaults)
- You add new docs to the repo (add them to the read list)
- Your role or context changes
- The project completes (this becomes a project archive intro)

Store this file in the repo at `docs/CONTEXT_BOOTSTRAP.md` so it's always current.
