# AI Usage Profile

## How Daniel uses AI

Daniel operates as a one-person production department at David Rives Ministries, using AI as a force multiplier across the full broadcast pipeline: guest research and outreach, script writing (intros, segues, teases, monologues, ministry reports), lower thirds, rundown population via the Rundown Creator API, voice profile extraction, and ad-hoc automation (Apps Script, Python, n8n, Composio). He runs AI in two modes — strategic ("sell me on this angle, then we'll go deep") and executional ("just do it") — and is impatient with anything in between. Guest research dominates his volume (298 conversations), but the highest-stakes work is script and graphics production tied to fixed shoot/air dates.

His workflow is heavily file- and memory-driven: project knowledge files, hook guides, voice DNA documents, Apple Notes monthly schedules, Google Drive folders, and Rundown Creator as source of truth. He iterates aggressively on reusable assets (skills, prompts, rubrics, style guides) rather than re-explaining preferences each session, and he expects the AI to internalize those documents rather than re-derive rules. He frequently runs multi-session projects where continuity matters — fragmented sessions and truncated conversations are his biggest structural pain.

He is non-technical but builds real production systems, so he leans on AI for both copywriting judgment and engineering decisions. He'll share API keys directly, accept honest risk assessments, and defer to AI recommendations when given confident rationale — but he will catch factual errors, credibility risks, and stylistic tics quickly and push back hard.

## What works well for him

- Reusable assets that codify his preferences: hook guide doc, voice DNA document, GSR Playbook, lower-thirds spec, tooling resources file
- Two-step approval workflows: pitch the angle/slug first, deep work only after approval
- Confident recommendations with rationale rather than menus of options
- Self-contained prompts with all context pasted in (especially for Claude Code / Apps Script deployments where project files won't be available)
- Direct API integrations (Rundown Creator, Composio Google Drive) over native MCP tools that time out
- Honest self-scoring rubrics that don't inflate to satisfy him
- Short, audio-scannable responses when he's on mobile/voice-to-text
- Numbered checklists and explicit next-step instructions for technical work
- HTML interfaces with full detail for batch approval decisions
- Voice DNA extraction kept separate from sample text during generation

## What causes friction

- AI forgetting standing rules across sessions (30% shorter titles, no em dashes, CTA placement, hook framework) — has to restate with increasing frustration
- Fact-first intros when his hook framework explicitly requires Universal Anchor → Disruption → Stakes → Guest
- Repetitive sentence cadence (especially "three short beats" and ≤5-word patterns) bleeding across segments
- Pattern-matching sample scripts instead of diverging from them when asked
- Defaulting to TBD instead of cross-referencing Apple Notes for interview times
- AI-written summaries leaking into source documents that should be verbatim-only
- Suggesting guests who've appeared too recently because the AI lacks airing-date data
- Tool failures: file uploads, Drive writes to GSR Shared Folder, MCP timeouts on rc_list_*, base64 size limits, Apple Notes searches returning irrelevant content, heredoc truncation on Mac terminal
- Conversation truncation mid-task, especially in long multi-segment script sessions
- Over-qualifying and seeking confirmation when he's already said "just do it"
- Long internal-monologue reasoning visible before actual output
- Visible confusion over file-to-episode mapping instead of just asking
- Lower thirds formatted as markdown tables instead of broadcast script format
- Character counts overshooting the ~60-65 target
- Em dashes appearing in copy where they're explicitly banned
- Fabricating book/resource plugs when the actual product page doesn't support it
- Corporate/salesy/AI-sounding email copy when he needs personal producer voice
- Pip3 commands on his system-wide Homebrew Python without venv setup

## Communication preferences observed

- Casual producer voice, not academic — he signs as "Daniel Allen" on David's behalf
- Lead with the science/hook, compress credentials to one line, end with specific dates and 48-hour ask in outreach emails
- No em dashes anywhere — period/comma substitutes
- Short declarative sentences, present tense, contractions, Fox News-style cadence for on-camera copy
- Full spoken sentences for GSR (no fragment hooks — there are no graphics to complete thoughts)
- ALL CAPS, pipe-delimited chyrons, 60-65 characters for lower thirds
- "Thanks, David!" opens, creationsuperstore.com closes, ellipsis-paced teleprompter cadence
- Plain English for technical explanations — no jargon
- Brief strategic framing, then execute — don't ask permission twice
- Mobile/voice-to-text defaults to short summaries; deep dives only on request
- Direct, copy-pasteable commands with real values, never placeholder paths
- Bold headers, H1/H2 outline-navigable Google Docs for logs

## Recurring blind spots

- **Hook framework drift**: AI repeatedly writes fact-first intros instead of Universal Anchor first, even within the same session after correction
- **Title/character length rules**: 30% shorter titles and 60-65 char L3s get forgotten across turns
- **Source document hygiene**: AI keeps inserting its own summaries/scripts into what should be verbatim-only research docs
- **Guest recency awareness**: No reliable access to airing dates means repeat suggestions of recently-aired guests
- **CTA and structural placement**: creationsuperstore.com keeps drifting from the final line into the middle of closers
- **Sentence rhythm**: short-beat patterns and cadence tics persist across segments without self-audit
- **Sample mimicry**: when given reference scripts, AI replicates them instead of treating them as principles
- **File/tool reliability**: Drive uploads, Apple Notes searches, MCP list endpoints, and large base64 payloads fail silently or time out
- **Continuity across sessions**: AI doesn't search prior project conversations before launching duplicate research
- **Credential and source verification**: secondary-source claims get conflated with guest's own statements
- **Resource plug fabrication**: AI invents book plugs when the product page doesn't actually carry the guest's work

## Recommended adjustments for AI assistants

1. **Always check project knowledge and conversation history first.** Confirm file accessibility explicitly before promising to build on prior work. If a template is referenced, paste it in — don't trust file retrieval.
2. **Load the hook guide before writing any intro.** Universal Anchor → Disruption → Stakes → Guest. Audit the draft against this before delivery, not after he flags it.
3. **Enforce standing rules automatically**: 30% shorter titles, no em dashes (use period/comma), 60-65 char ALL CAPS lower thirds with pipe-delimited chyrons, creationsuperstore.com as final line of closer, "Thanks, David!" opens, full spoken sentences (no fragment hooks).
4. **Cross-reference Apple Notes monthly schedule** for interview times before writing TBD. Keep source documents verbatim-only — no AI summaries.
5. **Self-audit for cadence tics** (≤5-word sentences, three-beat patterns) across adjacent segments before delivering. Vary rhythm deliberately from the first draft.
6. **Two-step approval workflow**: pitch slug + hook first, deep research only on approval. Lead with confident recommendation + rationale, not a menu.
7. **For Rundown Creator**: use direct API with column IDs (not names), isPlainText=false, raw text with \n\n breaks, skip rc_list_* endpoints, use known RundownIDs with rc_get_rows.
8. **For Drive**: use Composio GOOGLEDRIVE_MOVE_FILE/TRASH_FILE, save to My Drive root (GSR Shared Folder blocks API writes), expect large folder ops to need manual handling.
9. **For his Mac**: always `python3 -m venv .venv && source .venv/bin/activate`, prefer nano over heredocs, give complete copy-pasteable commands with real values.
10. **For Claude Code / Apps Script deploys**: bake all context (contact lists, guest-picking nuances, show philosophy) directly into prompts — project files won't be available at runtime.
11. **For voice work**: extract abstract voice markers into a standalone DNA document and keep raw samples out of generation context. Filter authorship authenticity before extraction.
12. **For outreach emails**: short, direct, personal producer voice, science hook first, credentials in one line, specific filming dates, 48-hour ask, signed "Daniel Allen." No corporate or salesy phrasing.
13. **Flag credential risks explicitly.** Distinguish guest's own statements from secondary summaries. Never fabricate book/resource plugs — verify the product page or flag the gap.
14. **When he's on mobile**, default to short audio-scannable summaries. Defer detail unless asked.
15. **When he says "just do it"**, stop qualifying. Deliver the output. Strip internal reasoning from the visible output — show conclusions, not deliberation.
16. **Cross-check guest recency** before suggesting returners. If airing data isn't available, say so rather than guessing.
17. **For Barentine-style non-Christian guests**: keep biblical framing in David's host copy only, never directed at the guest.
18. **For teases**: informative not withholding, no guest name drops unless widely recognizable, vary closing phrases, use angles distinct from intro and interview-intro rows, and ensure they work standalone out of context.
19. **Acknowledge truncation risk on long multi-segment jobs.** Front-load the highest-priority output and checkpoint progress so resumption is clean.
20. **Remember the scope**: DRM includes C21C on TBN, 24/7 Creation TV, 100K sq ft facility, and the superstore — not just GSR. Daniel is the sole producer and will overcommit; frame pitches against his solo bandwidth.