# GSR Discussion Queue (from the 2026-06-09 flight worksheet)

Items Daniel flagged "still need to discuss," plus the ones he asked me to explain. Each has a plain-English answer so the next working session moves fast. No jargon.

---

## Explained now, ready to decide when you are

**rc-adapter-pattern (you wanted this ASAP).**
Rundown Creator is a single outside vendor your automation leans on, and its API is fragile: it returns errors as HTTP 200, the MCP times out, columns must be referenced by number not name, and frozen/template rundowns silently block writes. An "adapter" is one small piece of code that is the ONLY thing allowed to talk to Rundown Creator. Every dashboard feature talks to the adapter, never to RC directly. Why it matters: when RC changes, breaks, or you ever switch tools, you fix or swap ONE file instead of rewriting every feature that touched RC. Recommendation: build this adapter first, before any more RC automation. It is plumbing you do once.

**ops-operator-runbook (you asked how it is useful).**
A runbook is a short, plain "when X happens, do Y" checklist for running the system: which tool does what (chat vs Claude Code vs terminal), how to recover when RC times out, how to restart the studio Mac server, what to do if a push fails. The session-recovery tracker is a one-line note of where you left off. Usefulness: when something breaks mid-cycle under deadline, you (or Miryam, or an intern) have a one-page fix instead of re-figuring it out live. Honest take: genuinely valuable, but only once the system is in real weekly use, so it can wait until there is a system to run. Low effort when we do it.

**trans-decision-a (you were not sure of the issue).**
"Decision A" is just: do we BUY a transcription service or BUILD our own local one (WhisperX on the Mac)? Transcription feeds metadata, chapters, and social clips, so it matters. Buying is easy but a recurring cost plus an upload step; building is free and local but needs a one-time setup. Not urgent; I will lay the tradeoff out side by side when we get here.

**meta-kilauea-edit (you were not sure of the problem).**
There is no real problem beyond confirming a fact. An episode's metadata used the number "48" in a way that could read as stale. You clarified it is a count of past volcanic events, to be framed as record-breaking. I will fact-check that number against the article and lock the wording. Nothing for you to do but point me at the article if you have it.

**conflict-nextjs-version (you wanted details).**
Pure documentation mismatch, nothing functional. One old architecture doc said "Next.js 15"; your live app runs 16.2.6. The framework choice never changed, only a stale version number in a doc. I already fixed the README; the decision record carries a correction note. Informational, no decision needed.

**ui-static-html-sprawl (you wanted clarification).**
Over time you have built several standalone HTML tools (GSN dashboard, RLN upload hub, guest-picker, Monday Tasks, the runbook) that live outside the dashboard in browser storage or Drive. "Folding them in" means rebuilding the useful ones as real pages inside the one dashboard, so you have a single home instead of scattered files that each save their own data. We will decide which are worth absorbing.

**ops-status-md-trigger (you wanted to understand benefits).**
A STATUS.md file that a Claude session auto-reads when it starts and rewrites when it ends, so each new session knows where you left off. It directly fights the context-loss you have felt (and the container resets that bit us today). Cost is a small startup hook. Worth it; we just confirm the setup.

**Terms you asked about:**
- "4-up Ken Burns": the Ken Burns effect is the slow pan/zoom across a still photo that makes it feel alive (named after the filmmaker). "4-up" means four of them in a montage. So a 4-up Ken Burns template is an After Effects preset that takes 4 photos and auto-applies the pan/zoom and layout, instead of hand-keyframing each in Premiere. Worth it only if you do 4-photo montages often.
- "QA" = quality assurance, a check before something goes live. The ProPresenter review screen you described IS the QA: it pulls the real slide screenshot next to the graphic/lower-third info so a human confirms the right thing will display before the push. Feasibility depends on whether ProPresenter can export slide thumbnails programmatically; we will verify that.

---

## Needs a working session to decide

- **lt-kanban-gallery-timeline** - three alternate views of the lower-thirds queue (kanban board, visual gallery, by-air-date timeline). Decide which, if any, you want.
- **lt-5-quality-tests** - a 5-point checklist a lower third must pass before approval. Decide whether to enforce it in the UI.
- **graphics-request-template + image-gen feasibility** - the AI graphics request form, and whether to auto-generate images. Part of the graphics session.
- **graphics-mogrt-set** - MOGRT scope (see your worksheet notes: lower thirds = all non-graphic text, FR recycled set, location tags on the ATEM computer, open to AE templates).
- **rc-runtime-58min-button** - the runtime calculator; your note: per-segment times need adjusting and must account for segues/transitions. We set real targets + a transitions budget together.
- **pp-live-asr-lower-thirds** - live speech-to-text driving lower thirds during the show. Complex; queued, and tied to your future live photo/b-roll sourcing idea.
- **data-l3-ordering-fields** - whether the lower-thirds table needs explicit ordering columns so rows always export in the right sequence.
- **ops-clinerules** - only relevant if you use the "Cline" coding tool. Likely skip unless you do.
- **ops-gsr-research-handoff** - your gsr-research (booking) repo has no handoff docs and no branch-and-PR safety; add the same structure this repo has. Low-effort hygiene.

---

## Build items from the worksheet that need a follow-up step
- **pp-thumbnail-verification (QA screen):** verify ProPresenter can export slide thumbnails programmatically before committing.
- **data-507-contact-import:** first classify, from the email correspondence, which contacts were reached out to as GSR guests vs for other reasons, then import only the guest-relevant ones.
- **operator-runbook:** build once you have decided it is worth it (see above).
