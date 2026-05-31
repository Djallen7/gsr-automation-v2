# data-intake — DECISION DIGEST (Sweep 1)

The ~10 decisions that collapse the most needs_human rows when answered. **Sorted by rows
resolved, descending.** Nothing applied — this is the menu. Answer inline (pick a letter +
any note), then I apply via `overrides/` and re-run `reconcile.py`.

Review queue total = **553** (distributions 190 · episode_guests 165 · guests 108 · episodes 70 · premade 20).

---

### D1 — S02 provisional-spine disposition · resolves ~290
S02 has no production source; its 55 episodes are platform-numbered + every related row is flagged.
**Q:** How do we treat Season 2 this sweep?
- **A)** Accept platform numbering as S02 canonical now (key_status=canonical, clear needs_human) — fast, but locks in YouTube/Fireside numbering as truth.
- **B)** Keep provisional but bulk-accept for import (needs_human=false, key_status stays `provisional`) — importable, still labeled non-authoritative.
- **C)** Defer S02 entirely — exclude from this import, revisit in a production-source sweep.
*(55 episodes + 146 S02 distributions + 89 S02 youtube appearances)*

### D2 — Schedule appearances disposition · resolves ~51
`appearances_schedule.csv` is dual-numbered (old monthly seq + production). 8 rows reference clean
E021-024; 43 use old/non-production numbers.
**Q:** What do we do with the 51 schedule appearances?
- **A)** Apply the exact corroboration join (5 rows: legates/E021, clarey/E022, janzen/E023, werner+wang/E024 → promote to 2-source clean); route billy-hallowell/E021 + 2 blank-key + the 43 old-numbered to a kept "unmapped" bucket.
- **B)** Discard schedule appearances entirely (numbering unrecoverable).
- **C)** Hand-map all 51 to production episodes (manual).

### D3 — S03 platform→production distribution bridge · resolves ~44
44 S03 distribution rows (YouTube/Fireside/Rumble) carry platform numbers that can't map to production
without a bridge. *(Shares the bridge with D5.)*
**Q:** How do platform episodes attach to production episodes?
- **A)** Build a title/date bridge (requires capturing platform titles + publish dates — re-pull).
- **B)** Hand-map the ~13 S03 platform episodes to production uids once; reuse for all rows.
- **C)** Leave unmapped this sweep (distributions stay flagged).

### D4 — YouTube-only guest identities · resolves 24
24 guest_keys appear in YouTube data but not the contact sheet; never auto-created.
**Q:** What happens to youtube-only guests?
- **A)** Match to existing contact-sheet guests by name (manual dedup pass).
- **B)** Auto-create as new low-confidence guests.
- **C)** Hold — don't add to the roster yet.

### D5 — YouTube S03 appearances bridge · resolves 23
23 S03 YouTube appearances; resolved by the **same** bridge as D3.
**Q:** Same as D3 — **A)** bridge, **B)** discard, **C)** hold. (Answer once; applies to D3+D5.)

### D6 — Deceased / do-not-contact block · resolves 7 guests *(21 source rows ÷ 3 exports)*
7 distinct guests flagged in the contact sheet (Featured-Resource / do-not-contact / deceased).
**Q:** Confirm their status?
- **A)** Confirm do-not-contact — keep permanently quarantined, never surface for outreach.
- **B)** Re-categorize some as contactable (tell me which).
- **C)** Split into "deceased" vs "do-not-contact" sub-flags.

### D7 — Guest variant-pairs · resolves ~6
**Heads-up:** only **2** of the 4 named pairs actually exist as dup keys —
`michael-houtz` and `john-mckay` are NOT present (only `michael-houts`, `john-mackay` exist; no dup).
**Q:** For each REAL pair, same person (merge) or different (keep separate)?
- `joe-hubbard` vs `joseph-hubbard` → merge / keep
- `jeff-tomkins` vs `jeffrey-tomkins` → merge / keep
- `michael-houts` (no `-houtz` found) → confirm canonical spelling
- `john-mackay` (no `-mckay` found) → confirm canonical spelling

### D8 — Tracker E016→E021 remap · resolves 1 (+ graphics keying)
Graphics tracker keys the May batch as S03E016; RC+scripts say E021-025.
**Q:** Remap?
- **A)** Confirm May = production E021-025 → remap tracker graphics E016 → E021 (clears the conflict).
- **B)** Keep tracker E016 as a distinct episode (it's not the May batch).

### D9 — S03E025 air_date · resolves 1
May Show 5 overflowed past the 4 May broadcast weeks.
**Q:** What air_date for E025?
- **A)** 2026-06-02 (Jun Week 1 / broadcast EP017 — accept the overflow slot).
- **B)** Leave blank (E025 not yet aired/scheduled).
- **C)** Provide the actual broadcast date.

---

**Not in the top 10 but noted:** S03 E001-E020 air_date gap (~13 episodes, no production→broadcast
bridge) — resolved later by D3-style bridge or accepted as undated; the 2 scripts run-of-show rows
(not single-guest appearances) stay parked.
