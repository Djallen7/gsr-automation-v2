# AI Conversation Archaeology

A tool that ingests your Claude.ai data export, ChatGPT data export, and a local forensic-report folder, then runs tiered LLM analysis to produce actionable insight artifacts.

## What it outputs

Inside `~/Documents/ai-archaeology-output/` (configurable):

- **stats.md** — quantitative overview: how many conversations, what categories, what outcomes
- **topic_clusters.md** — what you actually use AI for, with sample conversation titles per category
- **decision_log.md** — significant decisions extracted from your deep-analyzed conversations
- **automation_candidates.md** — recurring manual tasks worth automating
- **recurring_difficulties.md** — friction points and consistent struggles
- **ai_usage_profile.md** — Opus-synthesized profile of how you use AI: preferences, patterns, what works, what doesn't
- **CLAUDE.md** — drop-in context file for future Claude sessions or project knowledge bases
- **index.db** — SQLite index of every conversation and forensic file, queryable forever

## Setup (one time)

```bash
cd ~/Documents/gsr-automation-v2   # or wherever you keep this
pip install anthropic tqdm

export ANTHROPIC_API_KEY=sk-ant-...   # add to your shell rc to persist
```

## Configure paths

Open `archaeology.py` and edit the CONFIG block near the top:

```python
CLAUDE_EXPORT_PATH   = "~/Downloads/claude-export"   # folder OR zip
CHATGPT_EXPORT_PATH  = "~/Downloads/chatgpt-export"  # folder OR zip
FORENSIC_REPORT_PATH = "/Users/claudefix/Documents/inventory-2026-05"
OUTPUT_DIR           = "~/Documents/ai-archaeology-output"
```

Each "EXPORT_PATH" can point to either the extracted folder OR the original zip. The script finds `conversations.json` either way.

## Run it

```bash
python3 archaeology.py            # runs all five stages in order
python3 archaeology.py ingest     # just stage 1
python3 archaeology.py categorize # just stage 2
python3 archaeology.py cluster    # just stage 3 (free, no API)
python3 archaeology.py deep       # just stage 4
python3 archaeology.py extract    # just stage 5
```

**Resumable.** Every stage is idempotent. If you kill it mid-run and restart, it picks up where it stopped. Conversations already processed in tier 1 or tier 2 are skipped.

## What each stage does

1. **ingest** — parses your Claude export, ChatGPT export, and forensic folder into SQLite. No API calls. Usually finishes in under a minute.
2. **categorize** — Haiku call per conversation. Assigns category, summary, tools mentioned, and friction/decision signals. **This is where most API cost lives.** Budget: ~$0.001 per conversation, so 2000 conversations ≈ $2.
3. **cluster** — pure SQL aggregation. No API calls. Prints category and tool distributions to stdout.
4. **deep** — Sonnet call on the top 200 most "interesting" conversations (longest + flagged for difficulty or decisions). Budget: ~$0.01 per conversation, so 200 ≈ $2.
5. **extract** — generates markdown artifacts from the database. Two final Opus calls synthesize `ai_usage_profile.md` and `CLAUDE.md`. Budget: ~$0.20 total.

**Total expected cost: $5–10** for a heavy user, less if your export is smaller.

## Tuning

Inside `archaeology.py`:

- `TIER1_MODEL` — default is Haiku 4.5. Switch to Sonnet if you want richer categorization.
- `TIER2_TOP_N` — default 200. Raise to 500 if your export is huge and you want broader deep coverage.
- `MAX_MESSAGES_PER_CONV_TIER1` — how much of each conversation is sent for cheap categorization. Default 6 (first 2 + last 4).
- `MAX_CHARS_PER_MESSAGE` — truncation per message. Default 2000.

## What to do with the outputs

- **CLAUDE.md** — copy into the system prompt of any new Claude project, or paste at the top of any new chat. This is the highest-leverage artifact.
- **automation_candidates.md** — review with a coffee. Pick the top 3, add to your BATCH research doc.
- **decision_log.md** — searchable record of every decision you've made with AI assistance. Past-you's reasoning, in one place.
- **recurring_difficulties.md** — the inverse: the things you keep getting stuck on. Worth a focused session to address each.
- **ai_usage_profile.md** — gut-check this against how you think you use AI. The delta is the interesting part.

## How to query the index later

The SQLite database stays around. You can ask Claude Code to query it:

```bash
sqlite3 ~/Documents/ai-archaeology-output/index.db
sqlite> SELECT title, tier1_summary FROM conversations
        WHERE tier1_category = 'distribution-ops'
        ORDER BY interestingness DESC LIMIT 20;
```

Or just point Claude Code at the db and ask in plain English.

## Getting your data exports

**Claude:** Anthropic Console → Settings → Privacy → Export data. Email arrives in ~24h with a download link. Repeat for each of your 5 accounts.

**ChatGPT:** chatgpt.com → Settings → Data controls → Export data. Email arrives in minutes-to-hours.

If you have multiple Claude accounts, drop each export into its own subfolder under `~/Downloads/claude-export/`. The script walks recursively.

## Troubleshooting

- **"no conversations.json found"** — check the path; the script looks for that exact filename inside a folder or zip.
- **rate limited** — Haiku is generous but if you trip it, the script will retry once and then skip. Re-run `categorize` and skipped ones will retry.
- **out of disk** — the SQLite db is small (<100 MB even for huge exports). The forensic-file `content_preview` field stores only first 4 KB of each text file.
