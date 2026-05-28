<!-- ARCHIVE: GSR Automation Reference -->
<!-- DOMAIN: intelligence -->
<!-- KEYWORDS: Claude, ChatGPT, OpenAI, AI usage, conversation patterns, guest research, lower thirds, YouTube titles, automation failures, anti-churn, archaeology, gsr-editorial, gsr-pipeline, gsr-supabase, subagents, recurring errors -->
<!-- SOURCES: archaeology_data.json, OpenAI export, AUTOMATION_ROADMAP.md -->
<!-- UPDATED: 2026-05-28 -->

# AI Usage Patterns — Claude & ChatGPT Reference

Derived from archaeology of 879 Claude conversations and the ChatGPT export.
Use this to calibrate AI tool choices and avoid known failure modes.

---

## Claude Usage — Conversation Categories (879 sessions)

| Category | Volume | % | Notes |
|---|---|---|---|
| Guest research | 298 conversations | 34% | Largest category by far |
| Lower thirds / graphics | 146 conversations | 17% | Feeding into Episode Graphics tracker |
| YouTube titles | 59+ conversations | 7%+ | Recurring task; see error patterns below |
| Automation design (not shipped) | — | — | Repeated cycle; see Anti-Churn section |

**Guest research is the dominant AI workload** — roughly 1 in 3 Claude conversations is about a guest.

---

## Claude Tools In Use

| Tool | Platform | Primary Use | Peak Day |
|---|---|---|---|
| Claude Web (claude.ai) | Browser | Planning, drafting, research | Tuesday |
| Claude Code (platform.claude.com) | CLI / web | Building, automation | Friday |
| Claude API | Server only | Route handlers, regen endpoint | — |

**Claude API rules (non-negotiable):**
- Called only from server actions or API routes — never from client code.
- The Anthropic key must never reach the browser.
- Current model: `claude-opus-4-7`

---

## Subagent Inventory

Three custom Claude Code subagents live in `~/.claude/agents/`. Invoke via the Agent tool.

| Subagent | Purpose | When to use |
|---|---|---|
| `gsr-editorial` | GSR-specific copy review | Reviewing lower thirds, titles, guest summaries |
| `gsr-pipeline` | Pipeline domain questions | Episode workflow, production sequence questions |
| `gsr-supabase` | Supabase schema work | Schema design, migration planning, RLS policy review |

---

## Recurring Claude Errors (from archaeology)

These errors appear repeatedly across hundreds of sessions. Future sessions should guard against them.

1. **Suggesting recently-aired guests** — Claude has no data on who has already appeared on GSR. Without explicit airing history context, it will suggest guests who were just on the show.

2. **Fabricating product plugs** — Claude invents sponsor or product mentions that were never in the episode brief. Always verify against the actual episode doc.

3. **Forgetting the 30%-shorter YouTube title rule** — GSR YouTube titles must be ~30% shorter than the full episode title. Claude routinely ignores this without explicit re-instruction each session.

4. **L3 lower-thirds overshoot** — L3 (lower third, line 3) text runs too long. Claude generates copy that exceeds the character limit for the ProPresenter template.

5. **Automation design without a deliverable** — The largest category of wasted AI time: extended design conversations that produce no shipped code. Addressed by the Anti-Churn Rule in CLAUDE.md.

---

## Anti-Churn Rule — Why It Exists

Archaeology of 879 sessions revealed a repeated cycle:

1. Daniel describes an automation idea in a planning conversation.
2. Claude engages, designs a system, may scaffold partial code.
3. The session ends without a named deliverable or ship date.
4. The conversation is never resumed. The scaffolding is never finished.

**The fix:** Name the deliverable and the ship date before building anything. If you can't answer both, the session ends as a documented task in `docs/AUTOMATION_ROADMAP.md`, not as half-built code in the repo.

---

## ChatGPT Usage — Content Overview

**Export location:** Google Drive > Data archive > Open AI Data Expoert [sic]
**Drive ID:** `1eK-CPmo6dXrtGeF95N414magFunDpVX4`

**Note on folder name:** The Drive folder is misspelled "Expoert" — this is the actual folder name, not a typo in this document.

Content present in the ChatGPT export (53.0MB across 4 JSON files + 78.9MB chat.html):

| Topic | Notes |
|---|---|
| CTN podcast content | Cross-network podcast work |
| RLN media | Related media network content |
| GSR sponsorship pitches | $100–150/episode target range |
| Interview scripts | Guest interview prep |
| Star Spangled Adventures | Animated series project |
| Video contract | J. Bradford Rose / Miley Benjamin |

**Embedded media in export:** 26 PNGs, 6 JPEGs, 1 WebP — these are production materials embedded in the ChatGPT conversation export.

**ChatGPT vs. Claude split (inferred):** ChatGPT was used for broader ministry/business content (podcasts, contracts, pitches). Claude became the primary tool for GSR production tasks (guest research, graphics, episode workflow).

---

## Claude Conversation Export — Raw Data

| File | Size | Location |
|---|---|---|
| conversations.json | 116 MB | Google Drive > Claude Data Export |
| memories.json | 53 KB | Google Drive > Claude Data Export |
| projects/ | 20 JSON files | Google Drive > Claude Data Export |
| design_chats/ | 2 JSON files | Google Drive > Claude Data Export |

**Processed form:** `archaeology_data.json` at repo root — use this for queries. Re-process from conversations.json only if you need raw turn-level data.

---

## Key Lessons for Future Sessions

- Guest research context (who has aired, when) must be injected explicitly — Claude will not have it.
- YouTube titles need the "30% shorter" constraint restated every session.
- L3 copy: state the character limit explicitly when asking Claude to generate lower-thirds text.
- Before any automation design: ask "what ships at the end of this, and when?" If no answer, write a task card, not code.
- Claude Code sessions logging heavy `tool_use` event volume does not mean more conversations — normalize by message turns, not event counts.
