# GSR Voice-DNA Corpus — INDEX

Curated reference corpus of David Rives' strongest authentic opening-monologue samples, scored 1-5 on five dimensions, with abstract voice markers extracted. Collected per `data-intake/README.md` Prompt F by teammate **T-VOICE** (collect-only). Source: S3 Jan–May Monologues .docx in Google Drive (read-only).

---

## ⚠️ Read first — scope, limits, and what this is NOT

- **This is a REFERENCE corpus, not generation input.** Raw sample text is NOT to be staged into any generation prompt/context. Use the **Extracted voice markers** below for voice work; open a full `monologue_NN_*.md` only to study it.
- **Authenticity-filtered.** Anything that read as AI-drafted / team-ghostwritten was excluded — see `kill_list.md` for each exclusion and the textual evidence.
- **THE PROFILE IS THIN — it needs Daniel's co-creation.** This corpus is OPENING MONOLOGUES ONLY (10 samples), from one ~5-month window, scored by one pass. There is NO authored THD ("The Heavens Declare") source in Drive (see "THD GAP" below). These markers are a STARTING POINT for Daniel to confirm/correct, NOT a finished voice model. Do not treat the markers as settled.

---

## Authenticity filter (applied BEFORE scoring)
- **EXCLUDE if:** abstract-essay close (stacked nouns like "strength and beauty," "power, beauty, and design"; "intersection of science and faith"; "canvas painted with purpose and intention"); listicle/essay scaffolding ("In biological research… In architecture…"); fact/abstraction-first opener with no Universal Anchor; missing the signature sign-off AND landing on abstraction. (See kill_list K1–K3.)
- **KEEP if:** Universal Anchor hook (something the audience already owns) → second-person → concrete physical specifics → lands on a concrete image or the signature "I'm David Rives and THIS is the Genesis Science Report!"
- **Uncertain → FLAG, never silent.** (kill_list F1–F2.)

## Scoring rubric (1-5 per dimension)
HOOK (Universal Anchor + second-person + immediate weight) · SPECIFICITY (vivid named/physical detail) · RHYTHM (deliberate teleprompter cadence, varied length, drumbeat fragments) · ECONOMY (every line earns its place) · LANDING (concrete image or scriptural anchor — NOT a wonder/design abstract close).

---

## Opening-monologue samples — KEPT (10)

| # | file | source (month / docx) | episode | hook | spec | rhythm | econ | land | total | note |
|---|------|------------------------|---------|------|------|--------|------|------|-------|------|
| 01 | monologue_01_tel-shiloh-altar-horn.md | Feb / S03 Ep006 | S03E006 | 5 | 5 | 5 | 4 | 5 | **24** | Best overall. "These stones were waiting" anchor; drumbeat contrast; signature sign-off. |
| 02 | monologue_02_fruit-fly-brain-map.md | Feb / S03 Ep007 | S03E007 | 5 | 5 | 5 | 4 | 5 | **24** | Best second-person anchor ("something you probably killed this morning"). Conversational asides. |
| 06 | monologue_06_god-is-back.md | Feb / S03 Ep008 | S03E008 | 5 | 4 | 5 | 5 | 5 | **24** | Punchiest economy. "God is BACK." Short-declarative cable-news cadence. |
| 03 | monologue_03_ile-de-sein-wall.md | Feb / S03 Ep009 | S03E009 | 4 | 5 | 5 | 4 | 5 | **23** | Cleanest two-beat contrast ("This was not caveman CHAOS. / This was calculated COORDINATION."). |
| 05 | monologue_05_assyrian-tax-shard.md | Mar / Show 5 | S03E015* | 5 | 5 | 4 | 4 | 4 | **22** | "taxes are ANYTHING but thrilling" anchor; "He's the SOVEREIGN… preserver… HISTORIAN" anaphora. |
| 04 | monologue_04_nova-centauri.md | Jan / Show 4 | S03E004* | 5 | 4 | 4 | 4 | 4 | **21** | Herschel quote-hook done David's way; vivid ("BOOM!", pink glow). Lands on Kepler, not sign-off. |
| 07 | monologue_07_teen-brain-hotspots.md | Mar / Show 4 | S03E014* | 4 | 4 | 4 | 4 | 4 | **20** | "Let's break it down." Callback to prior episodes. Second-person close. |
| 08 | monologue_08_cascadia-fragment.md | Mar / Show 3 | S03E013* | 4 | 5 | 4 | 4 | 3 | **20** | Vivid ("gum stuck to a shoe"); close drifts toward "divine engineering" (flag). |
| 09 | monologue_09_playing-dead-bacterium.md | Feb / S03 Ep010 | S03E010 | 4 | 4 | 4 | 4 | 3 | **19** | "play dead" hook; close edges toward abstract ("shouts of divine engineering") — flagged. |
| 10 | monologue_10_protein-building-blocks.md | Jan / Show 5 | S03E005* | 3 | 4 | 3 | 3 | 2 | **15** | BORDERLINE keep — included as the contrast case (closest to the kill line). First to cut. |

\* episode numbers marked `*` are provisional (mapped by month + show position; Jan/Mar docs are titled "Show N", not "Ep0NN"). Feb docs are explicitly "S03 Ep0NN". The LEAD/reconciler owns episode_uid assignment.

**Excluded / flagged:** 2 hard AI-kills (Saturn, Soft Cells), 1 duplicate (Mar Show 2 = Jan Show 2 Saturn), 2 flagged-uncertain (Jan Show 3 weather; Jan Show 1 Moses — fact-first hook, not stored verbatim this pass). See `kill_list.md`.

## YouTube descriptions — considered, NONE kept
Per Prompt F, `sources/episodes_youtube.csv` descriptions were considered as a third batch. They are DRM marketing/boilerplate ("Join David Rives…", "SUBSCRIBE", "Consider a tax-deductible donation", "booking@davidrives.com"), not David's authored voice. NONE cleared the authenticity filter. Not force-included (per LEAD guidance). No sample stored from this source.

---

## Extracted voice markers (abstract — the reusable output)
*Abstract patterns only, tied to sample # as evidence. NO raw text dumped here. THIN — for Daniel to confirm/correct.*

### Hook patterns
- **Universal Anchor first** — open on something the audience already owns (a fruit fly they swatted #02; taxes they dread #05; a cultural mood "God is BACK" #06; buried history they can feel #01), THEN introduce the science. (#01,#02,#05,#06)
- **Authority-quote as anchor, immediately plain-Englished** — a scientist's line, then "Let me put that in simple, modern English…" (#04). Works only when the gloss is punchy.
- **Second person within the first 1–2 sentences** — "something you probably killed this morning" (#02); "Now ask yourself" (#03); "Picture this" (#05).
- **Anti-pattern (avoid):** fact-first or abstraction-first openers ("In the vast expanse of our solar system…" / "In a groundbreaking discovery…"). These read AI/ghostwritten. (kill K1,K2; borderline #10)

### Sentence rhythm / cadence
- **Drumbeat two-beat contrast**, each on its own line: "This was not caveman CHAOS. / This was calculated COORDINATION." (#03); "This is not poetic language. It is mathematics." (#06); "This is not a symbol. This is not a metaphor." (#01).
- **Short declarative, present tense, contractions** — Fox-News cadence; varied length, no stacked-adjective fragments. (#01,#02,#06)
- **ALL-CAPS single-word emphasis** mid-sentence for spoken stress (ANCHORED, BOOM, SHATTER, RIGHT side). Frequent across keeps; a David drafting tic. (#01,#03,#04)

### Diction & register
- **Plainspoken, not academic** — "a weekend project," "gum stuck to a shoe," "that's just a bunch of nonsense!" (#02,#08). Numbers used as rhetoric ("four blue whales end to end") not data-dump. (#02)
- **Direct rhetorical questions to the viewer** — "How does something this absurdly small contain something this staggeringly complex?" (#02); "Who were these people supposed to be?" (#03).

### How he lands a close
- **Signature sign-off** — "I'm David Rives and THIS is the Genesis Science Report!" lands 6 of 10 keeps (#01,#02,#03,#06 with "!"; #05,#07,#08 without). This is the strongest, most reliable David marker.
- **Concrete-image landing** when not the sign-off — "written in stone—waiting beneath the waves" (#03); Kepler "thinking Thy thoughts after Thee" (#04).
- **Anti-pattern (avoid):** abstract noun-stack closes ("wonder and contemplation," "divine artistry woven into the very fabric"). The borderline keeps (#08,#09,#10) drift here; the kills (K1,K2) live here.

### Scriptural-reflection moves
- **KJV quotation woven mid-argument**, tied to the concrete find, not bolted on (Leviticus on the altar horn #01; Genesis 1:28 dominion on the wall #03; 2 Kings 18 on the tax shard #05).
- **Role-anaphora for God** anchored to the topic: "He's the SOVEREIGN… He's the preserver… He's the HISTORIAN… He's the Creator" (#05) — concrete, each tied to a verse, NOT abstract.

---

## Coverage & gaps (the "thin, needs Daniel co-creation" note)

- **Well-covered:** opening-monologue HOOK and SIGN-OFF patterns (strong, repeated signal across #01–#06).
- **Thin / single-window:** only 10 samples, all S3 Feb-heavy (5 of 10 are February). April Monologues subfolder is ABSENT; May Monologues folder is EMPTY — so Apr/May monologue voice is uncaptured. Jan contributed 2 keeps + 2 kills/flags + 1 dup.
- **Reused scripts in the source:** Jan Show 2 and Mar Show 2 are byte-identical (Saturn). Worth confirming with Daniel whether script reuse across months is intentional.
- **THD: NOT CAPTURED — see below.**
- **These voice types are thin and need Daniel's co-creation.** Treat the markers as hypotheses for Daniel to confirm, sharpen, or reject — not a finished David voice model. A second pass with more episodes (and any authored THD source, if one exists) would materially strengthen this.

---

## ⚠️ THD GAP — needs Daniel (first-class finding, not a footnote)

**There is no authored "The Heavens Declare" (THD) script source in Google Drive.** The S3 month folders contain Interviews / Monologues / Ministry Reports / Lower Thirds / Pre-Recorded Segments — there is NO THD folder. The only "Heavens Declare" material in Drive is a `transcripts/` archive of **YouTube auto-caption (ASR) transcripts** of older (2020–2023) David videos — machine transcriptions with errors ("David Reeves" for Rives, "coal Library" for "alone," "Cole"/"cool seams" for coal) and no punctuation or line breaks. These were EXCLUDED as samples (kill_list K4) because storing them as "verbatim authored David" would be false provenance and they are rhythm-unscorable.

**Decision for Daniel:** Does an authored THD script source exist anywhere (another Drive, Rundown Creator, local)? If yes, point T-VOICE to it for a follow-up pass. If no, THD voice must be CO-CREATED with David — it cannot be reverse-engineered from ASR transcripts without his validation. The LEAD has flagged this to Daniel.

---

## PROVISIONAL APPENDIX — THD idea-level observations (transcript-derived, ASR, NOT verbatim, NOT authored, Daniel-deletable)

> **HARD LABEL on every item below:** transcript-derived from YouTube ASR captions, PROVISIONAL, NOT verbatim, NOT authored-script evidence, NOT part of the voice-marker set above. These are OBSERVATIONS for Daniel to VALIDATE or DELETE. They must never be fed into a generator as David markers and must never be cited as authored David text. ASR wording is paraphrased to idea-level precisely so flawed transcription does not contaminate anything.

1. **THD hook shape (provisional):** older THD shorts appear to open by naming the topic plainly and then placing David physically in a location ("let's talk about [X]… now I'm standing in [a coal seam / a place]"). If real, this is a "stand-in-the-evidence" anchor distinct from the studio monologue's Universal Anchor. — Daniel: confirm?
2. **THD scripture-landing (provisional):** these shorts appear to close by turning a physical object into a witness and landing on the show's tagline — pattern roughly "[this object] is a Silent Witness to [the Flood/creation]… truly the heavens declare the glory of God." — Daniel: confirm the exact authored close?
3. **THD length/register (provisional):** ~1–2 minute single-topic pieces, first-person, more devotional-conversational than the studio monologue's cable-news cadence. — Daniel: confirm register?
4. **THD self-ID (provisional):** appears to sign with name + tagline rather than the GSR "THIS is the Genesis Science Report" sign-off — i.e. THD and GSR have DIFFERENT closes. — Daniel: confirm the THD-specific sign-off wording (ASR rendered his name wrong, so the exact phrasing is unknown).

*(Only 2 of the transcript files are explicitly "The Heavens Declare"; others in the archive are CREATION-with-David-Rives shorts and podcasts. Sample size for these observations is tiny — treat as the thinnest part of an already-thin profile.)*

---

## Provenance
- Collector: T-VOICE (collect-only; no reconciliation, no merged files, no commit/push).
- Sources: Google Drive monologue .docx (read-only, via read_file_content — paragraph breaks preserved, verified against a .docx-XML parse); `sources/episodes_youtube.csv` (read-only, not edited — owned by T-PLATFORMS).
- Golden rules honored: read-only sources; verbatim stored samples (byte-for-byte in each monologue_NN file); never guess/fabricate — every keep/kill/flag and every marker is grounded in textual evidence, with uncertainty flagged.
