# overrides — Daniel's decisions D1-D9 (applied 2026-05-31, sweep 1)

Highest-priority human rulings, consumed by `reconcile.py`. Re-run is idempotent.

| ID | decision | applied? |
|---|---|---|
| D1 | DEFER S02 — park all S02 rows out of import + review queue (staged, not dropped) | ✅ applied |
| D2 | 5-row exact corroboration join → S03E021-024 episode_guests become 2-source clean | ✅ applied |
| D3+D5 | DEFER platform→production bridge; remaining S03 platform rows relabeled "date-blocked" | ✅ applied |
| D4 | Create youtube-only guests, BUT fuzzy-dedupe vs 167 first → near-match = needs_human candidate | ✅ applied |
| D6 | Set do_not_contact=true on the "7 deceased/do-not-contact" guests | ⛔ **HELD — see below** |
| D7 | Merge hubbard variants → joseph-hubbard; tomkins variants → jeffrey-tomkins | ✅ applied (corrected keys) |
| D8 | Tracker E016 → E021 remap | ✅ applied (May rows only; April E016 kept) |
| D9 | S03E025 air_date = 2026-06-02 cadence_inferred | ✅ applied (medium, unconfirmed — gate ambiguous) |

## Corrections made to literal instructions (data did not match the wording)

- **D7 keys:** the spellings you named are NOT the keys in the data. Contact sheet stores
  `joeseph-hubbard` (typo) and `tomkins-jeff` (last-first reversed); the canonical spellings
  (`joseph-hubbard`, `jeffrey-tomkins`) were YouTube-only. Canonicalized ALL variants to your
  stated targets — see `guest_merges.csv`.
- **D8 scope:** E016 has 17 April tracker rows (LEGIT — April Show 1 = production E016) + 52
  May/Copy-of-May rows (the mislabel). Remapped ONLY the 52 May rows → E021. April E016 kept.
  Blanket remap would have corrupted a valid episode.
- **D9 gate:** June Week-1 (2026-06-02) = broadcast EP017 with NO production show-slot/E025/E026
  label. Neither gate condition met → AMBIGUOUS. Applied the default date but kept it medium +
  needs_human (cadence_inferred, unconfirmed). Did NOT mark confirmed/high; did NOT revert to blank.

## D6 — HELD (requires your confirmation)

The 7 keys I previously labeled "deceased/do-not-contact" are: bell-verle, carson-ben, carter-rob,
jeanson-nathaniel, purdom-georgia, tomkins-jeff, wile-jay. These are **prominent LIVING guests**
(Robert Carter, Nathaniel Jeanson, Georgia Purdom, Jay Wile, Jeff Tomkins). My earlier
"deceased/do-not-contact" label was an UNVERIFIED assumption about a `flagged_in_source` set whose
real reason I never confirmed. Two problems:
1. Setting `do_not_contact=true` would remove top bookable guests from every outreach surface.
2. `tomkins-jeff` is in this D6 set AND is your D7 merge-to-contactable target → contradiction.

**Held action:** `do_not_contact` column added (default false); these 7 stay needs_human with reason
"source-flagged, reason UNVERIFIED — D6 held". Confirm the real status (and the reason) and I apply.
