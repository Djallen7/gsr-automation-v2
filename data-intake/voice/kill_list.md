# GSR Voice-DNA Corpus — KILL LIST

Everything EXCLUDED from the voice corpus, with the textual evidence for each call. Plus a regex-ready banned-pattern list (per README Prompt F: "generic abstract closes, 'Overall', stacked-noun endings").

Built by T-VOICE (collect-only). **No silent kills:** every exclusion names the source and quotes the actual offending text. Authorship-uncertain items (not clearly AI/ghostwritten) go under "Flagged — uncertain," NOT killed.

Authenticity filter ran BEFORE scoring. Source corpus = 15 authored opening-monologue .docx across S3 Jan–May Monologues folders (April Monologues subfolder absent; May Monologues folder empty — see INDEX "Coverage & gaps").

---

## Excluded — reads as AI-drafted / ghostwritten (NOT David's authentic voice)

| # | source | offending text (verbatim) | marker tripped | why excluded |
|---|--------|---------------------------|----------------|--------------|
| K1 | Jan "Show 2_ Monologue.docx" — Saturn's Hexagon (01_January/Monologues; content hash `ae923ac24e11`) | "tells a story of strength and beauty"; "we are reminded that our universe is not just a backdrop for existence but a **canvas painted with purpose and intention**"; "we find ourselves at the **intersection of science and faith**"; "inspire **wonder and contemplation**" | abstract-essay close; stacked-noun pairs; painterly cliché | Essayistic, not spoken-David. Dissolves into abstraction instead of landing on a concrete image or the signature sign-off. Opening is abstraction-first ("Saturn stands as a testament to grandeur and ingenuity") — no Universal Anchor. |
| K2 | Mar "Show 1 Monologue.docx" — Soft Cells (drive id `1-jnLvgZzgFlA-evtkHrICLrhI0j47mse`; content hash `c80366998b5e`) | bulleted essay body: "**In biological research**, … **In architecture and design**, … **In engineering**, … Artists and designers can also draw inspiration…"; close "the elegance of soft cells serves as a reminder of the **thoughtful designs that sustain us**" | listicle/essay scaffolding; abstract close; no Universal Anchor | Structured like a written explainer, not a spoken monologue. Hook is fact-first. Sign-off present but body is ghost-essay. |
| K3 | Mar "Show 2 Monologue.docx" — Saturn's Hexagon (drive id `1GVwT7egAd8PE7g4NDB6E3VgersspwHHg`; content hash `ae923ac24e11`) | byte-identical to K1 — same "canvas painted with purpose and intention" close, etc. | DUPLICATE of K1 + same AI-essay markers | **March Show 2 is the SAME script as January Show 2** (Saturn), reused/duplicated across two months. Excluded as duplicate AND for the K1 reasons. Finding flagged in INDEX. |

## Excluded — other reasons (not-a-sample / wrong source type)

| # | source | reason |
|---|--------|--------|
| K4 | THD YouTube transcripts (transcripts/ folder, drive id `1TZJEjER46Xclj8xALmgmUUVHjYsV1lAY`) — e.g. "The_Abundant_Witness_of_Coal…The_Heavens_Declare…David_Rives.txt" (`1DcyIa_OYgUDWN5-dITfD-IzeDM73tmE-`), "How_Mount_St._Helens_Blew_Up_Secular_Science…The_Heavens_Declare…" (`1ZVcLWSkuW-ahf1eV1sF1OHukruum-AO5`) | NOT authored scripts — YouTube auto-caption (ASR) transcripts of aired video. See K4-EVIDENCE. Excluded as VERBATIM-violation + RHYTHM-unscorable. This is the THD GAP (see INDEX). |

### K4-EVIDENCE — why the THD transcripts cannot be stored as verbatim David samples
The "Heavens Declare" files carry a scraped YouTube header (`# Published: … # Channel: David Rives Ministries # Video ID: … # URL: https://www.youtube.com/watch?v=…`) and are machine transcriptions full of ASR errors David never wrote/said-as-written:
- **"I'm David Reeves"** — misheard "Rives" (his own name).
- **"over 1 trillion tons of coal Library"** — "Library" is a mis-transcription of "alone."
- **"some cool seams"** / **"high quality clean burning cold"** / **"Cole has warmed our homes"** — "cool"/"cold"/"Cole" are all mis-transcriptions of "coal."
- **No punctuation and no line/paragraph breaks** — the entire body is one unpunctuated run-on, so RHYTHM and LANDING (which live in pacing and breaks) cannot be scored.
Storing this as "verbatim authored David" would assert false provenance. Idea-level observations were instead routed to the PROVISIONAL appendix in INDEX.md, explicitly labeled non-verbatim/not-authored, for Daniel's validation.

## Flagged — uncertain (NOT killed, NOT in the scored keep set)

| # | source | what's ambiguous | basis |
|---|--------|------------------|-------|
| F1 | Jan "Show 3_ Monologue.docx" — God's Mighty Systems / weather (drive id `1U8eVIw8hvE0WrdtdrWrMczkjsc3GPcQt`; content hash `2bc52c7f20ab`) | Leans toward the AI-essay pattern (abstract open "As we contemplate God's grandeur… leave us in awe"; "However,"/"For example," scaffolding; abstract close "rely on the One who created it all and cares deeply for us"; no signature sign-off) — BUT carries an authentically-David theme (personal God / comfort in disaster) and draft typos ("ELOBORATE", "dynamics processes") that read as a real working draft, not polished AI prose. | Couldn't confidently call it AI-authored OR clean-David. Held out of the keep set; not asserted as ghostwritten. Daniel should rule. |
| F2 | Jan "Show 1_ Monologue.docx" — Moses & Exodus (drive id `1-lRY2Pk2h6ozGo96g6rZjICNR3OgdhVO`) | Authentic authored manuscript (quote-rich, Scripture-heavy, production cue "(Insert Clip)"), but hook is FACT/QUOTE-first ("Moses and Exodus… 'the gospel of the Old Testament'") rather than a Universal Anchor — the fact-first opener Daniel flags. | Not a clean exemplar of the target hook style; NOT stored as a verbatim sample this pass (full byte-for-byte capture not reliably obtained — read_file_content returned an un-inlined content reference twice). Held out, not killed. Verifier/Daniel can pull the docx directly. |

---

## Banned patterns (regex-ready)

Patterns that flagged AI/ghostwritten copy in THIS corpus. Each cites a kill/flag item # (or borderline keep) as evidence it actually occurred — no invented patterns.

```text
# pattern                                                          # evidence       # description
canvas painted with purpose and intention                          K1,K3            painterly abstract-close cliché
intersection of science and faith                                  K1, monologue_10 essay-transition cliché
\b(strength|power|beauty),?\s+and\s+(beauty|purpose|design)\b       K1,K3            stacked-noun close ("strength and beauty"; "power, beauty, and design")
wonder and contemplation                                           K1               abstract noun-pair close
thoughtful designs that sustain us                                 K2               generic abstract close
^\s*In (biological research|architecture|engineering)\b            K2               listicle/essay scaffolding inside a spoken monologue
divine artistry woven into the very fabric                         monologue_10     abstract-close pattern (borderline keep; flag if it recurs)
shouts of divine engineering                                       monologue_09     soft abstract close — watch for drift
# Provenance / ASR red flags (transcript contamination — never store as authored):
^#\s+(Published|Channel|Video ID|URL):                             K4               scraped YouTube header = transcript, not script
David Reeves                                                       K4               ASR misspelling of "Rives" = transcript source
```

Note: the strongest KEEP samples (monologue_01–06) do NOT trip these patterns — they land on concrete images or the signature "I'm David Rives and THIS is the Genesis Science Report!" sign-off. The patterns above are diagnostic of the drift to avoid, not of David's authentic voice.

---

## Provenance
- Collector: T-VOICE (collect-only; no reconciliation, no merged files).
- Every kill grounded in verbatim source text; uncertain cases flagged, not killed.
- Read-only at every source; clean reads via Google Drive read_file_content (paragraph breaks preserved on this corpus — verified against the .docx XML parse of Jan Show 1).
