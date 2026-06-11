# Session Changelog, 2026-06-08

Plain-English summary of what changed across the recent work, written for the project owner (non-technical). Everything is grouped into three buckets: what is live, what is waiting, and what changed in the real database.

Nothing in production infrastructure was touched. No ProPresenter machine, no ATEM or Companion, no QNAP writes, no Notion. Only one pull request reached the live `main` branch: PR #43. Everything else is still on the work branch waiting for review.

---

## A. LIVE on main (already merged, in effect now)

This is the one merged pull request, PR #43, "conflict-purge batch 3 plus course fact-corrections, freshness CI gate, role scopes." It is documentation and housekeeping only, no app behavior changed. It includes:

- **Conflict-purge batch 3 (the doc cleanup).** The final round of clearing out contradictions and dead references in the project docs, the ones that needed no judgment call. Migration and route counts were corrected, the long-standing "lower thirds table" naming confusion was settled (the table is and stays `graphics`), phantom tables and a phantom rename were struck, and the toolkit prompt count was reconciled.
- **Course freshness CI gate.** An automatic check that flags the training course if it drifts out of date, so the course cannot quietly go stale.
- **Role scopes recorded.** The intended permission scopes for each team role are now written down.
- **Deferred per-role login noted as a task.** Per-role logins are not built yet; this records that decision and parks it as future work rather than leaving it implied.

That is the complete list of what is currently live from this work.

---

## B. On the work branch but NOT yet live

All of the following is committed on the work branch `claude/codebase-handoff-review-M9Aia` and is still waiting for review. It is not on `main` and has no effect on the live system yet:

- **Course module 0 reworked into Orientation plus GitHub.** The opening of the training course was expanded so it starts with orientation and a GitHub walkthrough.
- **Course module 13, "Finish the Build."** A new closing handoff module added to the course.
- **Course fact-correction.** Fixed a course error that treated `premade_library` as a missing piece; it is actually an existing table.
- **The webstream rename (expand-contract).** The publish-date field was renamed to a clearer "webstream" name using the safe two-step method that keeps the old field in place during the transition. See the database bucket below for the live half of this.
- **UI research and mockups.** The dashboard interface research and the design mockups (the design-lab versions and the seven preview directions).
- **Build optimization report.** The build-plan optimization writeup.
- **Tool suggestions by stage.** The per-stage tool recommendations document.
- **Segment publishing schedule.** The weekly segment publishing schedule research.
- **Course overview.** The combined course and pipeline overview document.
- **Episode dataset document.** The Season 3 episode 1-16/17 dataset writeup that records the research and the database fill.

---

## C. LIVE DATABASE changes (already written to the production database)

These were written directly to the live production database (project `lafkbxypmciopebentxp`) as part of filling in Season 3, episodes 1 through 17. These are real and in effect now, even though the documents describing them (bucket B) are still on the work branch:

- **Episode titles for episodes 1-17**, including episode 16.
- **Full guest names** filled in across those episodes.
- **Webstream scheduled publish dates** (`webstream_scheduled_publish_at`) populated.
- **Descriptions for episodes 1-8**, written verbatim from the GSN metadata sheet. Episodes 9-17 descriptions were deliberately left blank (no clean source copy).
- **8 shoot dates** written (episodes 1, 2, 5 on 2026-01-27; episodes 8, 9, 11, 12, 13 on 2026-03-06). **9 shoot dates were deferred** because those episodes were split, pre-recorded, or have unpinned dates; they go to Basecamp.
- **34 episode-to-guest links** created (`episode_guests`).
- **68 script segment rows** added (`scripts`).
- **The webstream column was added** to the episodes data using the safe expand-contract method, which means **the old publish-date column was kept in place** alongside the new one during the transition.

Only **3 pre-existing guest records** were changed (everything else under guests was new, not edited):

1. **Jeff Williams** organization fix.
2. **Dan Janzen** duplicate records merged into one.
3. **Brian Thomas** added.

A per-appearance chyron-affiliation enhancement (so a guest can show a different affiliation per episode) was flagged as a future schema change and deferred, not built.

---

_Reminder: production infrastructure was not touched, and only PR #43 reached `main`._
