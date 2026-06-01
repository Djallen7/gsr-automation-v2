# VERIFICATION REPORT — Corroboration Sweep

**Branch** `claude/determined-edison-4ceK9` (PR #40) · **Date** 2026-06-01
**Method** 6 read-only verification agents (Wave 1 source reads → Wave 2 corroboration) + LEAD adjudication.
**Confirmation bar** Promote only on **2+ independent source families** OR a **documented deterministic rule**. PII (email/phone) and contact STATUS (deceased/DNC) are **never** auto-confirmed — evidence is assembled for human sign-off only.

> **Nothing here is committed.** Stop-at-clean-tree per instructions. Review the numbers and the `overrides/` diff, then say the word and I commit (excluding `.mcp.json` and `docs/SUPABASE_REORG_PROPOSAL.md`).

---

## Headline

| | Before | After | Δ |
|---|---|---|---|
| **TRUE review queue (needs_human, all entities)** | **211** | **157** | **−54** |
| episode_guests | 67 | 27 | −40 |
| guests | 97 | 82 | −15 |
| distributions | 24 | 20 | −4 |
| episodes | 3 | 8 | **+5 (honest correction — see §3)** |
| premade_library | 20 | 20 | 0 (out of scope) |

**Conservation still passes** on both gated entities: distributions 190=190, episode_guests 173=173. `reconcile.py` is idempotent (re-run = identical). The 96 rule-locked rows (76 `has_pii_review` + 20 premade asset-dedup) were never promotable by corroboration and remain for you.

Source reachability this sweep: **Google Drive ✅ live read-only**, **Basecamp ✅ live read-only** (account *David Rives Ministries*, already OAuth'd — no login performed), YouTube/Fireside via committed read-only extracts.

---

## 1. CONFIRMED (2+ independent sources) — applied to `overrides/`

### 1a. episode_guests — 24 promoted + 16 folded (drained 40 of 67)
Each pair agreed across ≥2 **independent families** out of {SCHEDULE, INTERVIEW-DOCS (per-interview Google Doc titles), GRAPHICS-TRACKER, PLATFORM (YouTube/Fireside), SCRIPTS}. SCHEDULE-sheet and the committed `appearances_schedule.csv` are treated as **one** family (same origin) — they do not corroborate each other.

Drained pairs include E001 DeYoung/Clarey, E002 Tomkins/Bergman, E006 Lisle/Deweese, E007 Hebert, E008 DeWitt/Macreadie, E009 Lohman, E010 Young/Williams, E011 Jackson/Nelson, E012 Velting, E014 Thomas, E015 Werner, E016 Sherwin/Meyer, E017 Thomas/Stripling, E018 Barentine/Meyer, E020 Fabich, E022 Bergman, E023 Fabich, E025 Coppedge. Override: `overrides/episode_guests_confirm.csv`. Evidence: `verify/sources/episode_attestation.csv`.

### 1b. guests — 7 merges + 9 identity confirmations (drained 15 of 97)
**Merges** (`overrides/guest_merges.csv`, consolidates duplicate keys, gains a corroborating source):
`andrew-fabich → andrew-j-fabich` · `david-dewitt`+`dr-david-dewitt → david-a-dewitt` · `ed-holroyd → ed-holroyd-iii` · `steven-taylor → steve-taylor` · `mike-houts`+`mike-houtz → michael-houts`.
**Identity confirmed, flag cleared** (`overrides/guest_confirm.csv`, youtube-only, **no PII touched**): brian-young, carl-werner, charles-jackson, doug-velting, jake-hebert, jason-lisle, steve-furber, michael-houts, and john-mackay (see traps §2). Evidence: `verify/sources/guest_evidence.csv`.

### 1c. air-dates — 11 corrected & confirmed (E001–E011)
The live **2026 GSR Airing Schedule** (production-numbered) is the authoritative broadcast date; the **consistent +6-day online-publish lag** (observed across 15 episodes) is the independent corroborator. Override: `overrides/episodes.csv`. Evidence: `verify/sources/airdate_evidence.csv`. **This also corrected 14 wrong dates — see §3.**

---

## 2. RULE-APPLIED (documented deterministic rule)

- **Mechanical format repair:** Airing-Schedule raw token `EP09` → `S03E009`.
- **Recency tiebreaker (E005 air-date):** the schedule lists E005 on both 3/3 and 3/10; the later row (3/10) is corroborated by Fireside 3/16 (= 3/10 + 6d), so **E005 = 2026-03-10**; the 3/3 row is the duplicate artifact.
- **Production-canonical-wins (Tim Clarey E022):** the interview doc's *title* says Ep022 but its *body* says Ep018 — an internal conflict. SCHEDULE + GRAPHICS-TRACKER independently place him at E022, so the pair is attested to **E022 with the doc-body discrepancy flagged** for you.
- **Name-variant merges** (nickname/middle-initial/suffix/typo): Steven→Steve, Mike→Michael, Holroyd III, Fabich middle-initial J., houtz→houts. (See 1b.)

### TRAPS correctly held SEPARATE (the whole point of the sweep)
- `michael-oard` (meteorologist) **≠** `michael-egnor` (neurosurgeon, Stony Brook) — verified distinct; fuzzy false-positive (0.80). Oard stays in the queue (platform-only, single source — not promoted).
- `john-mackay` (creation evangelist, S03E005) **≠** `john-may` (reptile expert, contact-only) — verified distinct; confirmed as a real separate guest.

---

## 3. ⚠️ CRITICAL FINDING — every reconciled air-date was wrong

`reconcile.py`'s air-date logic assumed **5 episodes/month** and joined `month + show-slot`. The real broadcast cadence is **one episode/week** per the Airing Schedule, so **all 16 dates were off** (e.g. E001 said 2026-01-06, truly 2026-02-03; E017 said 2026-04-14, truly 2026-06-02). These were flagged `needs_human=false` — i.e. confidently wrong. This is exactly the failure class this sweep exists to prevent.

- **E001–E011:** corrected to Airing-Schedule dates, **confirmed_2src** (AS + platform +6d), `needs_human=false`.
- **E016–E025:** corrected to Airing-Schedule dates but staged as **single-family proposals**, `needs_human=true` (not yet aired / no platform corroboration in snapshot). That is the honest +5 in the episodes queue.
- **Decision D9 was wrong:** it set E025 = 2026-06-02, but that is **E017's** broadcast date. The Airing Schedule puts **E025 = 2026-07-28**. Staged as a proposal; needs your sign-off.

**Recommendation:** adopt the Airing Schedule as the canonical `air_date` source in `build_episodes()` (replace the month+slot formula) in a follow-up. I did not rewrite the function this sweep — staging via `overrides/` keeps it reviewable.

---

## 4. STILL-HUMAN (with why)

| Item | Count | Why it stayed |
|---|---|---|
| `has_pii_review` guests | 76 | **Rule:** PII (email/phone) never auto-confirmed. |
| premade_library | 20 | Asset-hash dedup — outside source-corroboration scope. |
| episode_guests | 27 | Single-source schedule/youtube rows with no 2nd family; genuine conflicts (Billy Hallowell **E021 vs E025** — unresolved, both cited); blank-key rows defeated by suffixes (e.g. "Andrew Fabich (TBD)" → "(TBD)"); gordon-wilson (E012) vs glenn-wilson (E013) confirmed **distinct**, each still single-source. |
| episodes | 8 | E016–E025 future single-family AS proposals (§3); no 2nd family yet. |
| distributions | 20 | Platform→production bridge rows with no clean date-lag attachment. |
| guests | 6 non-PII | `michael-oard` (platform-only), 3 platform-only youtube (andy-mcintosh, michael-lienau, seth-dillon), 1 malformed email (`danny-faulkner`: `dfaulkner@answersingenesis@.org` — double `@`; corrected format proposed but PII → human). |

**Spine gap (not a queue item):** E012, E013, E014, E015, E019, E020 are **missing from `episodes.csv`** entirely — the committed RC/scripts/tracker extracts didn't include them, though they exist (Airing Schedule + platforms + Drive confirm guests). Their episode_guest pairs were still corroborated. Fix needs a `build_episodes()` change (enumerate from the Airing Schedule), so I flagged it rather than patched it.

---

## 5. DNC / DECEASED — PROPOSAL ONLY, awaiting your sign-off

**Root cause found:** the `[listed under DECEASED OR DO NOT CONTACT section]` marker appears in **348 of 501** contact rows — it bled across the entire bottom half (v2+v3) of the concatenated contact file. It is a parsing artifact, **not** a per-person judgment. That is why 7 living guests were mislabeled.

**Status is NOT asserted by me.** Full cited proposal: `verify/sources/dnc_candidates.csv` (15 rows). Summary:
- **likely_living_active (8):** the 7 D6 names (Wile, Tomkins, Carter, Purdom, Jeanson, Bell, Carson) + ben-carson. Each appears as a *normal contactable row with a live email* in contact-list v1, and Tomkins is an active S03 guest (E002, E025) with 10 cross-source hits. → recommend `do_not_contact = false`. **Caveat:** only Tomkins has independent S03-appearance proof; the other 5 rest on the v1-normal-row + live-email + the bleed explanation — strong but not appearance-corroborated.
- **likely_deceased_cited (6):** Buddy Davis, Tommy Mitchell, Joe Taylor, David Catchpoole, Chuck Thurston, rusty-maisel — their **own** cell says "deceased".
- **UNVERIFIED (1):** henry-morris (bleed-marked only; no own-cell "deceased").

`do_not_contact` remains `false` for everyone in the reconciled data (D6 held). **No status is changed without your explicit sign-off.**

---

## 6. THD VOICE GAP — partially closed

THD ("Today's Headlines") scripts were never missing — they live in a **Basecamp `THD Scripts` vault** (02_Production, 82 docs, authored by accounts@davidrives.com), not Google Drive. The prior "no authored THD exists" was a wrong-location assumption.
- **2 saved as verbatim voice samples** (passed the authenticity filter): `voice/thd_01_leadwood-jackalberry.md`, `voice/thd_02_removing-god-from-equation.md`.
- **4 flagged uncertain** (essay-vs-teleprompter ambiguity) → your ruling: Hornbill Bird, Remarkable Woodpecker, Ark upon an Ancient Map, Charting the Seas.
- **76 vault docs unread** — see roadmap.
- The existing 10 monologue samples + INDEX/kill_list were left untouched. Status detail: `verify/sources/thd_basecamp_status.md`.

---

## 7. Artifacts

**Evidence (read-only, teammate-written):** `verify/sources/{drive_facts, platform_facts, dnc_candidates, airdate_evidence, guest_evidence, episode_attestation}.csv` + `thd_basecamp_status.md`.
**Applied overrides (LEAD-written):** `overrides/{episodes.csv (+air-dates), guest_merges.csv (+7), episode_guests_confirm.csv (NEW), guest_confirm.csv (NEW)}`.
**Code:** `reconcile.py` extended to consume the two new override files (fold/promote episode_guests; clear confirmed-guest flags) — conservation preserved by construction.

## 8. Recommended follow-ups (for the roadmap)
1. Replace the month+slot air-date formula in `build_episodes()` with the Airing Schedule as canonical source; enumerate missing episodes E012–E015, E019, E020 from it.
2. Link Basecamp `THD Scripts` vault as a standing GSR voice-corpus source; finish reading the 76 remaining docs.
3. Human sign-off on the DNC proposal (§5) and the air-date proposals E016–E025 (§3).
