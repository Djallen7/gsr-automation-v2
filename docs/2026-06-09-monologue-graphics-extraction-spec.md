# Monologue Graphics Cue Extraction — Trained Spec (SSOT)

Date: 2026-06-09. Source of truth for how David Rives signals graphics in his
monologues and how we turn that into cues. Built from: the 20 raw vault monologues
(`GSR Monologues`, Basecamp vault `9668065709`), 22 older Rundown Creator first-edit
scripts (Jan–May), the S03 Ep001–005 finished tracker builds (Drive corpus), and the
May tracker Ep021–025. Validated against Daniel's manual first pass on S03 Ep024
(9/9 David-authored cues matched).

This file is the single place the rules live. The `gsr-monologue-graphics` subagent
and any future dashboard extractor should read from here.

---

## 0. Where the monologues live (verified, don't re-check)
- **Raw monologues = Basecamp vault `GSR Monologues` (id 9668065709), one doc each** —
  the canonical home, and the only one reachable by API. A content scan of all
  Production-bucket docs for David's signoff found 61 hits, but they are all
  **THD-segment scripts** (folder `THD Scripts` 9668067133), a different segment — NOT
  monologues. Message boards, comments, uploads, and all four Campfire chats (~1,850
  lines) hold no monologues either.
- **Out-of-band source — Pings (direct messages):** David also sends monologues to
  Daniel via Basecamp **Pings (1:1 DMs)** (confirmed by Daniel 2026-06-09). The bc3 API
  does NOT expose Pings (all ping endpoints 404), so the extractor cannot pull these
  automatically. **Workflow fix:** monologues David DMs should be filed into the
  `GSR Monologues` vault so the pipeline has one canonical, reachable source. Until
  then, those monologues must be pasted/exported manually.
- Season 1–2 and early S3 (Ep001–020) raw monologues are not in Basecamp at all; only
  their finished graphics survive (in the trackers / Drive corpus).
- **Rundown Creator = the cleaned teleprompter "first edit."** It strips almost every
  visual cue down to `(PAUSE)` / `(Insert Clip w/audio)` / a verbal lead-in.
  **Never extract Pass-1 cues from RDC — extract from the Basecamp vault doc.**

## 1. The two-pass model
- **Pass 1 (David's own cues):** only what David authored in the raw doc — links,
  inline markers, scripture, section headers. This is what we extract deterministically.
- **Pass 2 (creative build):** Isaac/the team expand Pass 1 to 8–15 graphics with
  reusable B-roll loops, sourced pictures, article screenshots, ProPres library loops.
  Pattern library lives in `docs/2026-06-09-graphics-tracker-archive-reference.md`.

## 2. Pass-1 extraction procedure (deterministic, in order)
1. **Parse the document HTML and harvest every `<a href>` anchor first.** The href is
   the strongest "use this exact element" signal. Record (anchor text, href, char
   offset). Links hide mid-sentence (e.g. the word "Nineveh" → a Wikipedia image;
   "Chaitin's…incompleteness" → a YouTube video) and are invisible in plain text.
2. **Classify each link by href domain** (see §3).
3. **Then line/inline-scan the text for marker-only cues** David wrote without a link:
   - picture markers anywhere in a line: `(Use picture)`, `- Use image`, `[insert picture]`,
     `Insert Photo`, `Insert clip` (scan inside sentences, not just standalone lines);
   - `FACT #N:` / `<Section Label>` headers (each = a section graphic);
   - scripture quotations (quoted text + a `(Book c:v)` reference) → Propres Quote;
   - spoken lead-ins that introduce a graphic even with no link: `Take a look:`,
     `Watch this:`, `Listen to this … headline:`, `Here is a clip…`, `Roll it:`,
     `Pull audio from…`.
4. **`Picture this:` is a cue ONLY if an explicit marker/link follows it** (Daniel,
   2026-06-09). On its own it is rhetorical — ignore it.
5. **Apply intent qualifiers:** `just for visual(s)`, `silent`, `pull clips` → the clip
   is **B-roll** (no audio). A David-to-editor aside (e.g. "feels AI generated") is a
   **Note**, never on-screen text.
6. **Cue #1 is always the `Intro Graphic`** (the monologue title card).
7. **Anchor each cue to the spoken line it sits in/after.** Last-line + duration are
   then derivable from consecutive anchors.
8. **Never invent cues.** Where David wrote nothing (a blank beat, a bare subject name),
   emit a low-confidence placeholder flagged for Pass-2, never a silent guess.

## 3. Cue → Graphic Type mapping (STANDARDIZED VOCABULARY — use these exact labels)
Standardizations (Daniel): **cue #1 type = `Intro Graphic`** (not "Title Graphic");
**no-audio clips = `B-roll`** (do not add a "no audio" type; note "silent/under VO" in
the description).

| Pass-1 signal | Graphic Type | Notes |
|---|---|---|
| First line / title | **Intro Graphic** | always cue #1 |
| `youtube.com` / `youtu.be` / `/shorts/` / `/live/` link, plays with audio | **Clip w/audio** | timecode = in/out; gets `(PAUSE)` in the read |
| same, but `just for visual` / silent / "pull clips" | **B-roll** | no `(PAUSE)`; rides under VO |
| `wikipedia.org/.../media/File:*.jpg` | **Picture** | the exact image file; on-screen credit if CC |
| news/journal domain (jpost, sciencealert, sciencedaily, nps.gov, turkiyetoday, etc.) | **Article Screenshot** | fair-use editorial |
| `.mp3` / audio file | **B-roll** (audio bed) | "Pull audio from…" |
| bare on-screen URL (e.g. `war.gov/ufo`) | **Article Screenshot** (website) | |
| scripture quote + reference | **Propres Quote** | |
| quoted authority/person + headshot | **Graphic** (headshot + quote) | recurring monologue pattern (Kepler, Herschel, Currid…) |
| `FACT #N:` / `<Section Label>` | **Graphic** (section lower-third) | listicle/segment beat |
| reusable topic loop (money, ice, galaxy…) | **B-roll** or **Pre-made: B-roll** | PM = pull from ProPresenter library |
| book/DVD cover | **Propres Graphic** or **Book Cover** | |
| stage cue `(PAUSE)`, `Roll it`, `voice over` | (not a graphic) | anchor marker only |

Full type set in use: Intro Graphic · Clip w/audio · B-roll · Pre-made: B-roll ·
Picture · Article Screenshot · Propres Quote · Propres Graphic · Graphic · Book Cover ·
Roll-in.

## 4. Evidence (so the rules aren't hand-wavy)
- **Marker frequency, 22 older RDC first-edits:** `(Insert Clip/Video w/audio)` 8,
  timecodes 7, `Take a look:` 3, `(PAUSE)` 2, `Watch this` 2, `Listen to this…` 2.
  URLs / Insert-Photo / angle-brackets / just-for-visual = **0** (all stripped from RDC).
- **Hyperlinks in the 20 raw vault monologues:** 61 real `<a href>` anchors; the href
  resolves to the exact asset (YouTube clip / Wikipedia image file / news article / mp3).
- **Convention drift:** Mar/Apr RDC used `Take a look: (Insert Clip w/audio)`; May
  collapsed to bare `(PAUSE)`. The only signal stable across all months is David's
  prose lead-in + the link. Build on those, not on the production token.

## 5. Few-shot exemplars (mined, for the extractor prompt)
**A — S03 Ep024 "The Inconvenient Truth…" (validated 9/9):** Intro Graphic; 6 clips
(2 flagged no-audio/B-roll via "voice over while subsequent clips play"); 2 Pictures
(Kilimanjaro Wikipedia, Glacier NPS via "Insert Photo"). David pasted 2 links as bare
YouTube URLs and the rest as titled refs + timecodes.

**B — S03 Ep001 "Ancient Outpost Validates Exodus" (finished build, for Pass-2 feel):**
Intro Graphic → B-roll photo montage → 2× Clip w/audio (The Ten Commandments 3:06:53-,
Prince of Egypt 1:24:24-) → Pre-made: B-roll (ancient scroll loop) → 2× Graphic
(headshot+quote: Currid, Archer) → Propres Quote → Article Screenshot (Smithsonian) →
Propres Quote (Exodus 13) → Picture (fortress) → Graphic (map) → B-roll (Sinai loop).
13 graphics; #1 Intro; heavy headshot-quote + reusable-loop pattern.

**C — Mid-sentence buried link (the hard case):** in "When Taxes," the word **Nineveh**
is hyperlinked to a specific Wikipedia palace image — only caught by parsing `<a>` tags.

## 6. Open ambiguities still needing Daniel
1. Wikipedia/news split: Wikipedia image → Picture; news-outlet headline+link → Article
   Screenshot. Confirm or give a firmer rule.
2. Bare repeated on-screen URL: one graphic or one per mention? (assumed one).
3. Zero-cue scripts (Ep027 Diversity): escalate to David/Isaac vs auto-fill. (default: escalate)

## 7. Crew note (update the canon registry)
The S03 Ep001–005 trackers name graphics hands beyond the known roster: **Anderson,
Ethan, Bella** (alongside Isaac/Jakob/Jeremiah/Gabe). Confirm roles; they appear to be
graphics interns.
