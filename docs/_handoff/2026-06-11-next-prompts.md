# Next-step prompts + model routing (staged 2026-06-11, finalized when the Mac pull reports)

Three prompts. Who runs what, and on which model. The split: the OTHER account does the
volume (mining), THIS account does only the short heavy-model synthesis checkpoint and,
post-merge, the build slice. Quality is protected by the committed doctrine + the Fable
review gate, not by which model does the bulk reading.

## PROMPT M - corpus mining. OTHER account, model: SONNET. Run after the pull finishes.

File ownership while this runs: this prompt OWNS docs/_handoff/2026-06-11-claim-ledger.json
and 2026-06-11-video-research-queue.json; no other session touches them until it reports.

```
You are mining a video-transcript corpus for the GSR automation project, working inside
the repo at /Users/claudefix/Documents/GitHub/gsr-automation-v2 on branch
claude/vigilant-ramanujan-kt4fdc (git pull first). You do not need wider project context;
everything you need is below and in the named files. Plain English, no em-dashes.

WHAT GSR IS (the relevance lens, 5 lines): a weekly 58-minute TV production run by one
non-developer through Claude Code sessions. Stack: Next.js 16 + Supabase + Vercel
dashboard; Rundown Creator; Basecamp; ProPresenter (test machine only); YouTube uploads;
5-10 parallel Claude sessions coordinated through a lanes tracker. VALUABLE = concrete
techniques for: long-horizon autonomous sessions (/goal, routines, hooks, agent teams,
subagents), multi-session oversight, Claude Agent SDK pipelines, Supabase/Vercel patterns,
broadcast/production automation, transcript/whisper pipelines, n8n-vs-agentic arguments.
NOT valuable: money-making/agency content, crypto/trading, model-news hype, generic
beginner tours.

STEP 0 - INGEST FIRST (the pull run left 156 .srt files in ~/Downloads; the repo needs
them as clean .txt). Save this as docs/_handoff/2026-06-11-transcript-pull-kit/clean_srt.py
and run python3 clean_srt.py from the repo root:

  import re, json, pathlib
  src = pathlib.Path.home() / "Downloads"
  kit = pathlib.Path("docs/_handoff/2026-06-11-transcript-pull-kit")
  dst = kit / "transcripts"; dst.mkdir(exist_ok=True)
  q = json.load(open("docs/_handoff/2026-06-11-video-research-queue.json"))
  ids = [re.search(r"(?:youtu\.be/|watch\?v=)([\w-]{6,})", v["url"]).group(1) for v in q["videos"]]
  n = 0
  for srt in src.glob("*.srt"):
      vid = next((i for i in ids if i in srt.name), None)
      if not vid or (dst / f"{vid}.txt").exists(): continue
      lines, seen, out = srt.read_text(errors="ignore").splitlines(), set(), []
      for ln in lines:
          ln = re.sub(r"<[^>]+>", "", ln).strip()
          if not ln or "-->" in ln or ln.isdigit(): continue
          if ln not in seen: seen.add(ln); out.append(ln)
      (dst / f"{vid}.txt").write_text("\n".join(out)); n += 1
  print("converted", n, "| total txt now", len(list(dst.glob("*.txt"))))

Expect ~150+ converted (15 already exist from the earlier partial). If it reports far
fewer, the SRTs are elsewhere: ask Daniel where the pull saved them, fix src, rerun.
Then retry the 6 rate-limited failures ONCE (they have cooled off): from the kit folder,
yt-dlp --write-auto-subs --write-subs --sub-langs en --skip-download --sub-format vtt
--cookies-from-browser firefox --sleep-requests 3 -a failed.txt
-o "transcripts/%(id)s.%(ext)s" --ignore-errors, then python3 clean_vtt.py. Whatever
still fails stays pending. Commit: git add the kit folder, commit "transcripts: full
corpus ingested as clean txt", git pull --rebase, push. THEN mine.

THE FILES: transcripts live in docs/_handoff/2026-06-11-transcript-pull-kit/transcripts/
as <VIDEO_ID>.txt. The queue docs/_handoff/2026-06-11-video-research-queue.json maps ids
(in each url) to titles + triage_rank (1 = mine first). The ledger
docs/_handoff/2026-06-11-claim-ledger.json holds claims; READ ITS TOP (purpose +
status_legend + 2 example claims) to copy the exact entry shape. Next free id: continue
from the highest CL-### present.

THE DOCTRINE (follow exactly):
1. Work in triage_rank order, batches of 15 videos. Read each transcript.
2. For each video, extract the SPECIFIC, ACTIONABLE claims it makes (a technique, a
   command, a feature behavior, a workflow pattern). Skip vibes and hype. Typical yield:
   0-4 claims per video; most videos yield 0-1 and that is correct.
3. Log each claim in the ledger: status ASSUMED, source = "video <id> <title>",
   gsr_application = one sentence through the relevance lens above, lane = your best
   guess or "unsorted", priority 2 (or 1 only if it changes how sessions or the pipeline
   run). DEDUPE: if the ledger already covers it (search by keyword first), do not re-add;
   instead, if the video CONFIRMS or CONTRADICTS an existing claim, append one sentence
   to that claim's verifier_evidence with the video id.
4. Verification pass per batch: for claims about Claude Code / Supabase / Vercel /
   YouTube, check the official docs (code.claude.com/docs, supabase.com/docs,
   vercel.com/docs, developers.google.com) and flip ASSUMED -> VERIFIED / PARTIAL /
   REFUTED with the evidence URL. If you cannot verify in ~2 minutes, LEAVE it ASSUMED
   (a later review sorts those; never fake a verification).
5. In the queue JSON set each processed video's status: "mined" (claims or confirmations
   logged) or "rejected" with rejected_reason one-liner (e.g. "monetization content, no
   technique"). A transcript that does not exist stays "pending".
6. After EVERY batch: git add the two files, commit "mining: batch N (X mined, Y
   rejected, Z claims)", git pull --rebase, push. Never let more than 15 videos of work
   sit uncommitted.
7. When all available transcripts are processed, append a MINING SUMMARY section to
   docs/_handoff/2026-06-11-mission-run-notes.md: counts (mined/rejected/still-pending),
   the 10 highest-value claims by id, which lead topics kept paying off and which died,
   and a one-line recommendation on whether a second R6 wave is worth it. Commit, push.

GUARDS: only the named branch; never touch QNAP/ProPresenter/Tailscale/anything at 100.x;
no Google logins; do not edit any file this prompt does not name.

REPORT: the mining summary, plus push confirmation. Under 20 lines.
```

## PROMPT F - synthesis checkpoint. THIS account, model: FABLE or OPUS, one short session.
Run AFTER Prompt M reports. (Or just tell this session "mining is done" and it runs this.)

```
Resume the GSR mission as lead (canon lead-agent directive). cd /home/user/gsr-automation-v2,
git pull origin claude/vigilant-ramanujan-kt4fdc. Read the MINING SUMMARY in
2026-06-11-mission-run-notes.md and the new/changed ledger claims (git diff works).
1. Triage every claim still ASSUMED: verify, merge, or REFUTE each; nothing stays ASSUMED.
2. Re-sort any lane:"unsorted" claims into real lanes.
3. Decide the R6 second wave (plan 3.3): extend only leads the summary shows still paying.
4. Write the plan addendum v2 (plan 3.4): a dated section in
   2026-06-11-pipeline-build-plan.md folding in mined VERIFIED/PARTIAL claims that change
   any item; cite ids; change nothing the evidence does not force.
5. Re-run an INDEPENDENT rubric verifier subagent (mission section 6) + update the Phase R
   goal checklist honestly (boxes flip only with evidence).
6. Update lanes, refresh PR #53's body, one-screen report with anything blocked on Daniel.
Gates stand: no merges, Type-YES, live-rig yes, QNAP read-only.
```

## PROMPT B - post-merge build slice. EITHER account, model: SONNET. Run only AFTER
Daniel merges the PR stack (#47 -> #50 -> #52, or Lane B: #47 + #50).

```
Work in the gsr-automation-v2 repo (Mac path /Users/claudefix/Documents/GitHub/gsr-automation-v2
or cloud /home/user/gsr-automation-v2). git fetch origin main; confirm main now contains the
production_lower_thirds rename (grep apps/dashboard/src for .from('production_lower_thirds');
if absent, STOP and report that the stack has not merged).
1. Run plan item 0.2 exactly as written in docs/_handoff/2026-06-11-pipeline-build-plan.md
   (post-merge verification + the full docs truth sweep it lists). Branch chore/post-merge-
   truth-sweep off main, commit, push, draft PR.
2. Then plan item 1.0 (import-gate hardening) on branch feat/import-confirm-token off main:
   /api/import requires an explicit confirm token (omitting it = dry-run, never a live
   write); wire episode-workspace.tsx through the full dry-run + Type-YES gate or delete it
   (check first whether the merged code already removed it). cd apps/dashboard &&
   npx tsc --noEmit && npx eslint src/ both clean. Draft PR. Do NOT run any real import.
3. Report: PRs opened, sweep results, anything that did not match the plan's description.
Use /goal with each item's done-when list if available. Never merge anything.
```

## Why these model picks hold quality
- Mining (M) is reading + pattern-matching against an explicit doctrine, and every claim
  it produces still passes the Fable checkpoint (F) before touching the plan. Sonnet's
  miss rate on "is this GSR-relevant" is absorbed by the unsorted lane + dedupe rules.
- F is the one step where judgment changes the plan; it stays on the big model and is
  deliberately short (the inputs are pre-digested).
- B is code with machine-checkable acceptance (tsc, eslint, grep, draft PR) and the plan
  text as spec; Sonnet executes specs like this reliably, and review still happens at PR.
