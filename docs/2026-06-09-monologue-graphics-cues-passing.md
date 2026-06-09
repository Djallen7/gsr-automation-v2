# Monologue Graphics Cues — Reverse-Engineering David's Pass 1

Date: 2026-06-09. Read-only analysis. Nothing was written to Basecamp, Rundown
Creator, ProPresenter, or any production system. The only live calls made were
read-only GETs (RDC `getRundowns`/`getRows`/`getScript`, Basecamp document reads).

Scope: isolate **Pass 1** — David Rives' own graphics ideas as he writes them
into the raw monologue, expressed as links and inline markers — for the past few
months (S03 Ep021–Ep025) and dry-run the same extraction on the five new June
scripts (Ep026–Ep030). Downstream these become `<gfx ...>` tags; cue #1 is always
the Title Graphic.

---

## 0. Environment precondition (checked first, no secrets printed)

| Var | State |
|-----|-------|
| BASECAMP_ACCOUNT_ID | clean |
| BASECAMP_CLIENT_ID | clean |
| BASECAMP_CLIENT_SECRET | clean |
| BASECAMP_REFRESH_TOKEN | clean |
| **RUNDOWN_CREATOR_API_KEY** | **DIRTY — 1 stray whitespace char (12 raw vs 11 stripped)** |
| RUNDOWN_CREATOR_API_TOKEN | clean |

The three Basecamp vars flagged in the prior session are now clean. `RUNDOWN_CREATOR_API_KEY`
still carries one stray whitespace character. I trimmed it at call time for this
analysis (same `"".join(val.split())` trick `scripts/basecamp_token.py` already
uses), so nothing here was blocked. **Recommendation: re-enter `RUNDOWN_CREATOR_API_KEY`
cleanly** so the dashboard's `/api/rc-*` routes (which do *not* trim) stop silently
failing auth.

---

## 1. Where the monologues actually live

**David's raw Pass 1 lives in Basecamp**, in the Docs & Files vault folder
**"GSR Monologues" (vault id `9668065709`, bucket `02_ Production` 37738136)**.
It holds one document per monologue, written by David with his graphics ideas
inline. Today it has 20 documents in two recent batches:

- **May cycle (created 2026-05-11)** → aired/recorded as **Ep021–Ep025**. These are
  the five docs the `2026-06-08-basecamp-map.md` Appendix A captured.
- **June cycle (created 2026-06-08, the day *after* that snapshot)** → **Ep026–Ep030**.
  These five are NOT in the snapshot's Appendix A and are NOT yet in Rundown Creator.

**The episode cards, the message board, and the to-do items do NOT contain monologue
text.** The to-do "5 GSR Monologues" items (e.g. due 2026-05-12) are just the
write-by reminders assigned to David; the actual scripts are the vault docs above.

**The teleprompter / "early script" copy lives in Rundown Creator**, on the first
Monologue row of each show rundown (`segment == "Monologue"`, `ScriptHasContent == 1`,
always `Position 40`). The other ~12 Monologue rows per show are **empty graphic-slot
placeholders** (`ScriptHasContent == 0`), one per future monologue graphic.

### Source map (verified live)

| Episode | RDC Rundown | RDC Title | Monologue RowID (has content) | Basecamp vault doc | Monologue title |
|---|---|---|---|---|---|
| Ep021 | RID 79 | May Show 1 \| S03_Ep021 | **5003** | 9878904977 | Eyes Fixed on Things Above (UFO/UAP) |
| Ep022 | RID 81 | May Show 2 \| S03_Ep022 | **5062** | 9878899856 | Lights on the Moon? (TLP) |
| Ep023 | RID 83 | May Show 3 \| S03_Ep023 | **5178** | 9878895729 | Playing God With the Sun |
| Ep024 | RID 82 | May Show 4 \| S03_Ep024 | **5120** | 9878892469 | The Inconvenient Truth About An Inconvenient Truth |
| Ep025 | RID 84 | May Show 5 \| S03_Ep025 | **5236** | 9878884727 | Flip of the Poles |
| Ep026 | RID 87 | June Show 1 \| S03_Ep026 | none yet | 9974711934 | The Maker's Hands and 3D Printers |
| Ep027 | RID 88 | June Show 2 \| S03_Ep027 | none yet | 9974725730 | Diversity in the Ancient Animal Kingdom |
| Ep028 | RID 89 | June Show 3 \| S03_Ep028 | none yet | 9974745160 | The Goddess in the Rubble of Laodicea |
| Ep029 | RID 90 | June Show 4 \| S03_Ep029 | none yet | 9974785005 | Deep Sea Discoveries in Australia |
| Ep030 | RID 91 | June Show 5 \| S03_Ep030 | none yet | 9974808771 | Beneath the Antarctic Ice (10 Facts) |

(July Ep031–035 = RID 97–101, September Ep036–040 = RID 106–110, October
Ep041–045 = RID 115–119, November Ep046–048 = RID 124–126 already exist as empty
rundowns for later mapping.)

---

## 2. The single most important finding: Pass 1 cues come from Basecamp, not RDC

I cross-referenced each May vault doc (raw) against the matching RDC monologue
script (the typed teleprompter copy). **The RDC copy is a cleaned read-script: it
strips out almost every one of David's visual cues.** What survives into RDC is
only the stage direction the on-air read needs — a bare `(PAUSE)` where a clip
plays, and verbal lead-ins like "Roll it:", "Roll the clip.", "Here is a clip
from…", "(voice over while subsequent clips play)".

Cue-like lines surviving in each RDC May script:

| Episode | Cue lines left in RDC | What they are |
|---|---|---|
| Ep021 | 0 | every visual cue dropped |
| Ep022 | 2 | `(PAUSE)` ×2 |
| Ep023 | 1 | `(PAUSE)` |
| Ep024 | 7 | `(PAUSE)` ×4 + "Roll the clip." + "(voice over while subsequent clips play)" + "Here is a clip…" |
| Ep025 | 4 | `(PAUSE)` ×3 + "Roll it:" |

**Conclusion for the extractor: harvest Pass-1 cues from the Basecamp vault document.**
RDC's `(PAUSE)` markers are useful only as a secondary signal — they tell you
*where* a graphic fires (the anchor line) but not *what* it is. The "what" (the
link, the title, the timecode, the picture instruction) exists only in the vault
doc. Any pipeline that reads cues from RDC alone will see almost nothing.

---

## 3. What David's Pass-1 cue vocabulary actually is

The "known marker vocabulary" from the 06_MONOLOGUE GRAPHICS project — `(INSERT PICTURE)`,
`(PLAY SILENT CLIP [link])`, `(GET CLIP)`, `(INSERT CLIP)`, `(INSERT VIDEO w/audio)`,
`[ON SCREEN: ...]`, `(***Pause***)`, `(***LOOK AT BACK SCREEN***)`, `(BUMPER IN/OUT)`,
`(***END***)` — is the *idealized downstream* vocabulary. In David's actual raw
documents those tidy tokens almost never appear. His real Pass-1 idiom is looser:

**Dominant idiom (≈80% of all cues): the pasted reference line.**
A line that is a video/article **title**, optionally followed by a bracketed/inline
**URL**, optionally followed by a **timecode range**, optionally followed by a
short parenthetical **note**. Examples verbatim:

- `【Original Film】A Trip to the Moon (1902) - Georges Méliès (3:22-3:35, 6:13-6:16)`
- `Moonraker (8/10) Movie CLIP - Drax's Deadly Dream (1979) HD :39-1:09`
- `Mount Kilimanjaro - Wikipedia - Insert Photo`
- `FIRST EVER 3D Printed Homes in America... | Austin, Texas | By Icon & Lennar [https://youtube...] 2:37-3:21`

**Inline picture/clip instructions (free text, not fixed tokens):**
`(Use picture)`, `- Use image`, `[insert picture]`, `Insert Photo`, `Insert clip.`,
`(SHOW ROLL-IN OF LAUNCH ETC)`, `Pull audio from podcast 0:00-40.`

**Editorial / "for visual only" qualifiers** (these change the graphic's *intent*):
`just for visual`, `just for visuals`, `(pull some clips from this to incorporate)`,
`clips can be pulled from this`, `(This one feels like it's AI generated, but it
has tons of information...)`, `**I recommend pulling in Stock footage on this one.`

**Stage / director cues** (survive into RDC): `(PAUSE)` / `(***Pause***)`,
`Roll it:`, `Roll the clip.`, `(voice over while subsequent clips play)`.

**Section / listicle headers** (act as their own lower-third graphic):
`FACT #1: ...` … `FACT #10: ...` (Antarctic), and angle-bracket section labels
`<The Hexagonal Marvel>` (Saturn).

**Scripture quotes** = ProPres Quote graphics: a verse set off in quotes with a
reference, e.g. `"...seek those things which are above..." (Colossians 3:1–2, KJV)`.

### Cue → graphic-type mapping (proposed)

| Pass-1 signal | Graphic Type | Notes |
|---|---|---|
| First line / monologue title | **Title Graphic** | always cue #1 |
| Bare URL only (e.g. `war.gov/ufo`) | On-screen URL / B-roll of site | David often repeats it for emphasis |
| Title + `[YouTube URL]` + timecode | **Clip w/audio** (or B-roll if "silent"/"just for visual") | timecode = in/out; "just for visual" → silent B-roll |
| Title + `- Wikipedia` / `Insert Photo` / `[insert picture]` / `(Use picture)` / `- Use image` | **Picture** (or **Article Screenshot** if it's a news headline+link) | Wikipedia/stock → Picture; news outlet headline → Article Screenshot |
| News headline in quotes / pasted article title + link | **Article Screenshot** | |
| Scripture in quotes + reference | **Propres Quote** | |
| `FACT #N:` / `<Section Label>` | **Graphic** (section lower-third) | listicle/segment beats |
| `(PAUSE)`, `Roll it:`, `(voice over...)` | (not a graphic) anchor marker | tells you WHERE the adjacent clip fires |
| `**I recommend... Stock footage`, `(pull some clips...)` | **B-roll** (intent flagged) | David is explicitly punting sourcing to the editor |

---

## 4. Per-episode isolated cue table — May (Ep021–Ep025), Pass 1

Verbatim cue text from the Basecamp vault docs. "In RDC?" = whether any trace of
that cue survived into the typed teleprompter script (the Pass-1-vs-later signal).

### Ep021 — Eyes Fixed on Things Above (doc 9878904977 / RowID 5003)
| # | Cue text (verbatim) | Link | Marker type | Graphic type | Fires on line |
|---|---|---|---|---|---|
| 1 | (title) "Eyes Fixed on Things Above" | — | title | Title Graphic | opening |
| 2 | `6 videos that stood out in the Pentagon's new UFO drop 0:00-0:18` | (titled clip) | pasted ref + timecode | Clip w/audio | "We are now in a brave new world…" |
| 3 | `war.gov/ufo` | war.gov/ufo | bare URL | On-screen URL | "the U.S. Department of War launched war.gov/ufo…" |
| 4 | `"...Set your affection on things above..." (Colossians 3:1–2, KJV)` | — | scripture | Propres Quote | "The Apostle Paul gives us the right order…" |
| — | RDC kept **0** cue lines | | | | every visual cue dropped on the typed pass |

### Ep022 — Lights on the Moon? (doc 9878899856 / RowID 5062)
| # | Cue text (verbatim) | Link | Marker type | Graphic type | Fires on line |
|---|---|---|---|---|---|
| 1 | (title) "Lights on the Moon?" | — | title | Title Graphic | opening |
| 2 | `The Starry Night - Wikipedia` | Wikipedia | pasted ref | Picture | "Take Van Gogh's famous Starry Night" |
| 3 | `Two Men Contemplating the Moon - Wikipedia` | Wikipedia | pasted ref | Picture | "Or consider Two Men Contemplating the Moon" |
| 4 | `【Original Film】A Trip to the Moon (1902) - Georges Méliès (3:22-3:35, 6:13-6:16)` | (titled clip) | pasted ref + timecode | Clip w/audio | "One of the EARLIEST works of cinema in 1902…" |
| 5 | `2001: A Space Odyssey \| The Moon Monolith \| Warner Classics (3:41-3:47)` | (titled clip) | pasted ref + timecode | Clip w/audio | "classics like 2001: Space Odyssey" |
| 6 | `The Iconic Flying Bike Scene \| E.T. ... 4k HDR (4:42-4:47)` | (titled clip) | pasted ref + timecode | Clip w/audio | "And, of course, E.T." |
| — | RDC kept **2× `(PAUSE)`** | | | | clip-play anchors |

### Ep023 — Playing God With the Sun (doc 9878895729 / RowID 5178)
| # | Cue text (verbatim) | Link | Marker type | Graphic type | Fires on line |
|---|---|---|---|---|---|
| 1 | (title) "Playing God With the Sun…" | — | title | Title Graphic | opening |
| 2 | `Moonraker (8/10) Movie CLIP - Drax's Deadly Dream (1979) HD :39-1:09` | (titled clip) | pasted ref + timecode | Clip w/audio | "sounds like the plot of a bad Bond villain movie" |
| 3 | `Despicable Me: Steal the moon (HD CLIP) 2:03-2:20` | (titled clip) | pasted ref + timecode | Clip w/audio | (after Bond clip) |
| 4 | `I Call This Enemy: The Sun (The Simpsons):14-:41` | (titled clip) | pasted ref + timecode | Clip w/audio | "the most ridiculously conceived idea from The Simpsons" |
| — | RDC kept **1× `(PAUSE)`** | | | | RDC also softens "James Bond" wording |

### Ep024 — The Inconvenient Truth About An Inconvenient Truth (doc 9878892469 / RowID 5120)
| # | Cue text (verbatim) | Link | Marker type | Graphic type | Fires on line |
|---|---|---|---|---|---|
| 1 | (title) | — | title | Title Graphic | opening |
| 2 | `https://www.youtube.com/watch?v=T8JlBkOe6HU 0:00-0:03, 1:09-1:22` | YouTube | URL + timecode | Clip w/audio | "began to build a career on climate alarmism" |
| 3 | `UK: LONDON: US VICE PRESIDENT AL GORE MEETS TONY BLAIR :42-50` | (titled clip) | pasted ref + timecode | Clip w/audio | "a HEARTBEAT away from the most powerful office" |
| 4 | `Russia-US Vice President Al Gore arrives in Moscow :15-:22` | (titled clip) | pasted ref + timecode | Clip w/audio | (subsequent clips) |
| 5 | `How the U.S. Supreme Court Decided the Presidential Election of 2000 \| History :34-:47` | (titled clip) | pasted ref + timecode | Clip w/audio | "And then came November 7th, 2000" |
| 6 | `Al Gore 2000 Concession Speech :17-:26, 6:48-6:58` | (titled clip) | pasted ref + timecode | Clip w/audio | "watched George W. Bush take the oath" |
| 7 | `https://www.youtube.com/watch?v=nh_xi-X3NVE 0:00-:20` | YouTube | URL + timecode | Clip w/audio | "Here is a clip from him speaking to the WEF" |
| 8 | `Mount Kilimanjaro - Wikipedia - Insert Photo` | Wikipedia | pasted ref + "Insert Photo" | Picture | "no more snows on Kilimanjaro" |
| 9 | `Visiting in Winter - Glacier National Park (U.S. NPS) - Insert Photo` | NPS | pasted ref + "Insert Photo" | Picture | "the park FORMERLY KNOWN as Glacier" |
| — | RDC kept **7** cue lines | | | | "Roll the clip.", "(voice over…)", "Here is a clip…", `(PAUSE)`×4 |

### Ep025 — Flip of the Poles (doc 9878884727 / RowID 5236)
| # | Cue text (verbatim) | Link | Marker type | Graphic type | Fires on line |
|---|---|---|---|---|---|
| 1 | (title) | — | title | Title Graphic | opening |
| 2 | `"Everybody on Earth is dead in a year" \| The Core \| CLIP` | (titled clip) | pasted ref | Clip w/audio | "In The Core, a crew of scientists…" |
| 3 | `2012 (2009) - The Sinking of Los Angeles Scene (3/10) \| Movieclips` | (titled clip) | pasted ref | Clip w/audio | "In 2012, it's a collapsing magnetosphere…" |
| 4 | `John Discovers the Devastating Truth About the Solar Flare \| Knowing (2009)` | (titled clip) | pasted ref | Clip w/audio | "In Knowing, a solar flare tears through…" |
| (5–6) | quoted headlines: BBC Science Focus "Could a geomagnetic reversal kill us all?", Nat Geo "No, We're Not All Doomed…" | — | quoted headline | Article Screenshot (likely) | "BBC Science Focus recently ran a headline…" |
| — | RDC kept **4** cue lines | | | | `Roll it:` + `(PAUSE)`×3 |

---

## 5. Synthesized Pass-1 cue-format spec (deterministic extraction procedure)

Input: a Basecamp "GSR Monologues" vault document (HTML → text, preserving `<a href>`
URLs and line breaks). Output: an ordered cue list, cue #1 = Title Graphic.

1. **Title Graphic (always cue #1).** Take the document title (= first line, which
   David repeats as the heading). Emit `Title Graphic` anchored to the opening line.
2. **Split into lines/paragraphs.** Treat each non-empty line as a candidate.
3. **Classify each candidate line as a CUE if it matches any of:**
   - contains a URL (`https?://…` or a bare domain like `war.gov/ufo`), OR
   - contains a timecode range (`\b\d{1,2}:\d{2}\b` optionally `-\d{1,2}:\d{2}`,
     including leading-colon forms like `:39-1:09`), OR
   - ends in / contains a picture instruction token (`Insert Photo`, `insert picture`,
     `Use picture`, `Use image`, `Insert clip`), OR
   - is a pasted media reference: ends in ` - Wikipedia`, ` - YouTube`, contains
     `| … |` outlet formatting, or `(HD CLIP)` / `Movie CLIP` / `| Movieclips`, OR
   - is a `FACT #\d+:` or `<Section Label>` header, OR
   - is a scripture quotation (quoted text + `(Book c:v…)` reference), OR
   - is a stage cue (`(PAUSE)`, `(***Pause***)`, `Roll it`, `Roll the clip`,
     `voice over`, `LOOK AT BACK SCREEN`, `BUMPER`, `END`).
4. **Type each cue** per the §3 mapping table.
5. **Apply intent qualifiers.** If the cue line also contains `just for visual(s)`,
   `silent`, or `(pull … clips …)`, mark it **B-roll / silent** (no audio). If it
   contains `**I recommend … Stock footage`, mark **B-roll, source=stock, needs-sourcing**.
6. **Anchor each cue to the spoken line** = the nearest preceding (or, for an
   opening clip, following) sentence of actual prose. Last-line + duration are then
   auto-derivable from consecutive anchors, exactly as `GSR-WORKFLOW-CANON.md §10`
   already specifies.
7. **Extract the link** into its own field (strip from the spoken text).
8. **Do not invent cues.** Where David left a blank paragraph or only a creature/
   subject name with no marker (see Ep027), emit a *low-confidence placeholder*
   flagged for human review — never a silent guess.

### Ambiguities that need your confirmation
1. **Wikipedia/news titles → Picture vs Article Screenshot.** `- Wikipedia` lines
   I mapped to *Picture*; news-outlet headline+link (e.g. the Athena/Türkiye Today
   line) to *Article Screenshot*. Confirm that split, or give me your rule.
2. **"just for visual" = silent B-roll?** I'm treating it as Clip-without-audio
   (B-roll). Confirm.
3. **Bare repeated URL (`war.gov/ufo`).** One on-screen URL graphic, or one each
   time David says it? I assumed one.
4. **Quoted media headlines with no link (Ep025 BBC/Nat Geo).** Article Screenshot,
   or skip? I flagged them as likely Article Screenshots.
5. **Empty-paragraph gaps with only a subject name (Ep027 especially).** David
   clearly expects a picture of each creature but wrote no marker. Auto-place a
   low-confidence Picture, or leave the slot empty for the editor? Default: flag.
6. **Scripture quotes → Propres Quote**: confirm these count as monologue graphics
   in the tracker (they fill cue slots) rather than being handled purely in ProPres.

---

## 6. Dry-run cue extraction — the 5 new June scripts (Ep026–Ep030)

NOT saved anywhere. Proposed cue lists for review. These five are in Basecamp only;
they are not yet typed into RDC, so this is the pure Pass-1 read.

### Ep026 — The Maker's Hands and 3D Printers (doc 9974711934)
| # | Cue (verbatim) | Link | Type | Fires on |
|---|---|---|---|---|
| 1 | Title "The Maker's Hands and 3D Printers" | — | Title Graphic | opening |
| 2 | `Genesis 1:27. "So God CREATED man in His own image…"` | — | Propres Quote | opening |
| 3 | `https://www.3dprintingdublin.com/chuck-hall/ (Use picture)` | 3dprintingdublin | Picture | "It started in 1983… Chuck Hull" |
| 4 | `12-23-2019: Carl Deckard—pioneer of 3D printing… - Use image` | 3dprintingjournal | Picture (Article Screenshot?) | "a graduate student named Carl Deckard" |
| 5 | `FIRST EVER 3D Printed Homes in America… Icon & Lennar 2:37-3:21` | YouTube | Clip w/audio | "Entire neighborhoods in Texas… Watch this:" |
| 6 | `Star Trek TNG -- Replicators :1-:11` | YouTube | Clip w/audio | "The Star Trek replicator?" |
| 7 | `Star Trek Replicator :3-:14` | YouTube | Clip w/audio | (same beat) |
| 8 | `Star Trek Voyager: Tom Paris orders Hot Plain Tomato Soup :5-:24` | YouTube | Clip w/audio | (same beat) |

Notes: cues 6–8 are three clips stacked on one beat ("The Star Trek replicator?")
— likely a montage. Cue #4's source is a news/journal post, so Picture-vs-Article-
Screenshot is the §5 ambiguity.

### Ep027 — Diversity in the Ancient Animal Kingdom (doc 9974725730)
| # | Cue (verbatim) | Link | Type | Fires on |
|---|---|---|---|---|
| 1 | Title "Diversity in the Ancient Animal Kingdom" | — | Title Graphic | opening |
| 2 | (no marker) creature 1 | — | Picture **(low-confidence, flagged)** | "we meet Kostensuchus atrox" |
| 3 | (no marker) creature 2 | — | Picture **(low-confidence, flagged)** | "the 'Hell Pig'… the daeodon" |
| 4 | (no marker) creature 3 | — | Picture **(low-confidence, flagged)** | "They named it Foskeia pelendonum" |

**This script has essentially no explicit Pass-1 cues** — just a Title and three
creatures David obviously wants pictured, plus a couple of empty paragraph gaps
where images likely belong. It is the strongest example of ambiguity #5. Per the
WORKFLOW-CANON "never leave an empty cue slot" rule, monologue graphics should run
8–15, so this script will need the most human cueing of the five. Recommend
surfacing it to David/Isaac, not auto-filling.

### Ep028 — The Goddess in the Rubble of Laodicea (doc 9974745160)
| # | Cue (verbatim) | Link | Type | Fires on |
|---|---|---|---|---|
| 1 | Title | — | Title Graphic | opening |
| 2 | `Archaeologists discover giant marble Athena statue in ancient Laodicea in Türkiye` | turkiyetoday.com | Article Screenshot | "archaeologists found a statue of Athena face down" |
| 3 | `Surprisingly Beautiful Ancient City of Laodicea… (:3-:7) just for visual` | YouTube | **B-roll (silent)** | "if you've spent any time in your Bible…" |
| 4 | `"buy from Me gold tried in the fire."` (Rev 3) | — | Propres Quote | "To a banking town with a gold exchange" |
| 5 | `"white raiment, that thou mayest be clothed."` | — | Propres Quote | "To a city of fine wool" |
| 6 | `"anoint thine eyes, that thou mayest see."` | — | Propres Quote | "To the makers of eye salve" |
| 7 | `"So then because thou art lukewarm… I will spue thee out of my mouth."` | — | Propres Quote | "a people choking down warm, mineral water" |
| 8 | `"Because thou sayest, I am rich… wretched, and miserable…"` | — | Propres Quote | (continues Rev 3 reading) |

Note the `just for visual` qualifier on cue #3 → silent B-roll, not a clip w/audio.

### Ep029 — Deep Sea Discoveries in Australia (doc 9974785005)
| # | Cue (verbatim) | Link | Type | Fires on |
|---|---|---|---|---|
| 1 | Title | — | Title Graphic | opening |
| 2 | 3 stacked headlines ("Scientists Discover Over 110 New Species…" etc.) | — | Article Screenshot / on-screen headlines | opening three lines |
| 3 | `THE DEEP OCEAN \| 4K… (pull some clips from this to incorporate for the Coral Sea)` | YouTube | **B-roll (clips to be pulled)** | "The Coral Sea lies off the northeastern coast" |
| 4 | `What scientists have discovered deep in the Coral Sea \| 7.30 (clips can be pulled from this)` | YouTube | **B-roll (clips to be pulled)** | "What they found exceeded all expectation." |
| 5 | `110 New Deep-Sea Species Discovered… (This one feels like it's AI generated, but… tons of information)` | YouTube | B-roll **+ editorial caveat for editor** | (same beat) |

Cue #5 carries a David-to-editor aside ("feels AI generated") — keep it as a Note,
do not put it on screen.

### Ep030 — Beneath the Antarctic Ice: A Lost World Revealed (10 Facts) (doc 9974808771)
Listicle format — each `FACT #N` is its own section graphic plus (usually) a clip.
| # | Cue (verbatim) | Link | Type | Fires on |
|---|---|---|---|---|
| 1 | Title "Beneath the Antarctic Ice… (10 Facts)" | — | Title Graphic | opening |
| 2 | `ANTARCTICA - The Frozen Continent - 4k DRONE Video 2:12-2:22` | YouTube | Clip/B-roll | "Antarctica covers 5 million square miles" |
| 3 | `FACT #1: A LOST WORLD BURIED BENEATH ICE` | — | Graphic (section L3) | fact 1 |
| 4 | `Gondwana's lost world uncovered beneath Antarctic ice \| The Jerusalem Post` | jpost.com | Article Screenshot | "scientists just discovered something…" |
| 5 | `Wonders of New Zealand… (6:54-7:00) just for visuals` | YouTube | **B-roll (silent)** | "like the Pacific Northwest or New Zealand" |
| 6 | `FACT #2: BLOOD FALLS…` + `The Blood Falls Of Antarctica :7-:11 (just for visual)` | YouTube | section L3 + **B-roll (silent)** | fact 2 |
| 7 | `FACT #3: MOUNT EREBUS…` + `The Antarctic Volcano… :41-:58 (just for visual)` | YouTube | section L3 + **B-roll (silent)** | fact 3 |
| 8 | `FACT #4…` + `Timelapse of the 24 hour Antarctic sun (:7-:10) (just for visual)` | YouTube | section L3 + **B-roll (silent)** | fact 4 |
| 9 | `FACT #5…` + `Studying the Dry Valleys of Antarctica… :3-:8 (just for visual)` | YouTube | section L3 + **B-roll (silent)** | fact 5 |
| 10 | `FACT #6…` + `What's Hidden Under the Ice of Antarctica? 7:25-7:30` | YouTube | section L3 + Clip/B-roll | fact 6 |
| 11 | `FACT #7…` + `Antarctica's Strange Secret… 2:20-2:27 (just for visual)` | YouTube | section L3 + **B-roll (silent)** | fact 7 |
| 12 | `FACT #8: ANTIFREEZE FISH…` (no clip) | — | Graphic/Picture (flag) | fact 8 |
| 13 | `FACT #9…` + `ENDURANCE \| Official Trailer \| National Geographic :18-:24` | YouTube | section L3 + Clip w/audio | fact 9 |
| 14 | `FACT #10: THE POLAR VORTEX…` (no clip) | — | Graphic/Picture (flag) | fact 10 |

Antarctic alone yields ~14 cues — well within the 8–15 monologue target. Diversity
(Ep027) is the opposite extreme and the one to escalate.

---

## 7. Non-obvious cue tells — from the Jan–April BC↔RDC cross-reference

(Added 2026-06-09, second pass, at Daniel's request: look at earlier monologues'
RDC early versions against their Basecamp originals to surface cues that the simple
"title + link + timecode" rule would miss.)

I matched nine older monologues that exist in BOTH places — David's raw vault doc
and the typed RDC script:

| Show | RDC RowID | Vault doc | Monologue |
|---|---|---|---|
| Mar S1 | 4214 | 9668065780 | Soft Cells |
| Mar S2 | 4273 | 9668065768 | Saturn's Storms |
| Mar S3 | 4332 | 9668065750 | Cascadia Updates |
| Mar S4 | 4391 | 9668065743 | Brain Power in the Days of Youth |
| Mar S5 | 4450 | 9668065727 | When Taxes Aren't Boring |
| Apr S1 | 4570 | 9765358751 | GSR 5 – Artemis II |
| Apr S2 | 4629 | 9765319169 | GSR 6 – Marketing Genius of Darwin |
| Apr S3 | 4688 | 9765316011 | GSR 7 – How Do We Determine Truth |
| Apr S5 | 4806 | 9775384053 | Beyond Computation |

(Jan/Feb shows ran **two monologues each** and their second scripted row is actually
the interview **tease** — "Coming up, Dr. X joins us…" — not a monologue. Those Jan/Feb
monologue topics are no longer in the vault, so they have no raw counterpart to diff.)

### Finding 1 — The RDC cue convention EVOLVED; David's prose lead-in did not
- **March/April RDC** uses the formal tokens from the 06_MONOLOGUE GRAPHICS vocabulary,
  spelled out by the typist: `Take a look: (Insert Clip w/audio)` (Soft Cells),
  `Take a look: (Insert Video w/audio)` (Saturn), `Watch this: (Insert clip w/audio)`
  (Cascadia).
- **May RDC** abandoned those and collapsed everything to a bare `(PAUSE)`.
- So **the formal `(Insert Clip/Video w/audio)` tokens are a typist artifact in RDC,
  not something David writes** — and they are not even used consistently month to month.
- **The one signal stable across every month is David's spoken lead-in phrase.**
  Build the extractor on that, not on the production token.

### Finding 2 — The spoken lead-in is the most reliable cue anchor (it survives link-stripping)
Each of these introduces a graphic, lives in *prose*, and stays in RDC even when the
link/title is deleted:

`Take a look:` · `Watch this:` · `Watch:` · `Listen to this [outlet] headline:` ·
`Here is a clip from…` · `Picture this:` · `Roll it:` · `Roll the clip.` ·
`Take a listen` · `Pull audio from…`

Proof: in **Brain Power**, RDC kept `Listen to this Science Daily headline:` and the
quoted headline but **dropped the sciencedaily.com URL**. The graphic's source link
is gone; only the lead-in marks the spot. Any extractor reading RDC alone would miss
the graphic entirely; reading the lead-in (in either source) catches it.

→ **Rule: treat an imperative-perception lead-in ("look / watch / listen / consider /
picture / roll / take a listen" + colon) as a high-confidence cue anchor, then read
the next 1–2 lines (or the rest of the sentence) for the media reference.**

### Finding 3 — Cues hide MID-SENTENCE, not just on their own line
- When Taxes: `…the capital city of Nineveh [insert picture] writes a demand…`
- Cascadia: `Cascadia and San Andreas faults may be linked Insert clip.`

The §5 detector must scan for `[insert …]`, `Insert clip`, `Insert photo`, `(Use picture)`,
`- Use image` **anywhere in a line**, not only as standalone lines. A line-only rule
silently drops these.

### Finding 4 — Other non-obvious tells confirmed
- **All-caps parenthetical stage directions**: `(SHOW ROLL-IN OF LAUNCH ETC)`,
  `(voice over while subsequent clips play)` — dropped by RDC, BC-only.
- **Angle-bracket cues** (Saturn): `Take a look < Saturn's Hexagon Storm Explained
  (min 0.00-0-1.31) >` and section labels like `<The Hexagonal Marvel>`.
- **Pasted media title with NO link and NO timecode** is still a cue — the suffix
  `- YouTube` / `- Wikipedia` / `| <Outlet>` is the tell (e.g. `A soft cell in space - YouTube`).
- **Bare editor instructions**: `Quote attribution`, `**I recommend pulling in Stock footage`.
- **Some monologues are intrinsically low-cue** (Darwin, Truth, and June's Diversity):
  near-zero markers either side. These are the ones to escalate to David/Isaac rather
  than auto-fill — not a parser failure.

### Finding 5 — David's links are REAL hyperlinks; harvest the `<a href>`, not the text
(Added 2026-06-09, third pass: Daniel confirmed that when David wants a specific
clip/graphic he usually drops a hyperlink to the photo/video.)

Reading the document **HTML anchors** (not the rendered plain text) found **61
resolvable hyperlinks across the 20 monologues**. The href is the single most
precise Pass-1 signal — it names the exact asset — and the domain classifies the type:

| href domain/pattern | Graphic type | Example |
|---|---|---|
| `youtube.com` / `youtu.be` / `/shorts/` / `/live/` | Clip w/audio (or B-roll if "just for visual") | Antarctic's 9 clips |
| `wikipedia.org/...#/media/File:*.jpg` | **Picture — the exact image file** | Starry Night, Kilimanjaro, Two Men Contemplating the Moon |
| news/journal domain (`jpost`, `sciencealert`, `sciencedaily`, `space.com`, `science.org`, `turkiyetoday`, `nps.gov`, `pennmedicine`, `pmc.ncbi`, `yahoo`, `3dprinting*`) | Article Screenshot / page image | Laodicea Athena (turkiyetoday) |
| `*.mp3` (or other audio) | **Audio pull**, not video | Artemis → `nasa.gov/…/astronauts-episode-v3-revised.mp3` ("Pull audio from podcast 0:00-40") |
| bare on-screen URL (`war.gov/ufo`) | On-screen URL | UFO monologue |

**Two consequences that change the extractor design:**
1. **Links hide mid-sentence and are invisible in plain text.** In "When Taxes" the
   single word **`Nineveh`** is hyperlinked to a specific Wikipedia palace image; in
   "Beyond Computation" the phrase **`Chaitin's information-theoretic incompleteness`**
   is hyperlinked to a YouTube video. A text-only parser drops both. **Parse the HTML
   `<a>` elements directly.**
2. **The two zero-cue monologues are now doubly confirmed:** "Diversity" (June) and
   "Darwin" (April) have **0 hyperlinks AND 0 markers**. These need human graphics
   calls — flag, never auto-fill.

**Procedure update to §5:** before line-scanning, extract every `<a href>` from the
doc HTML as a cue, recording (anchor text, href, char offset). Classify by the table
above. Then anchor each link to the spoken line it sits in/after, and attach any
timecode that appears in the same or adjacent text run. Plain-text line-scanning
(lead-ins, `[insert …]`, `FACT #`, scripture) runs as a SECOND pass to catch the
cues David expresses without a link.

### New ambiguity for Daniel
- **`Picture this:`** is sometimes a literal picture cue (When Taxes → `[insert picture]`
  right after) and sometimes just rhetorical. Should the extractor treat `Picture this:`
  as a cue anchor (and flag for review), or ignore it unless an explicit marker follows?

---

## 8. Recommendations

1. **Re-enter `RUNDOWN_CREATOR_API_KEY` cleanly.** Daniel removed the whitespace on
   2026-06-09, but the running session still reads the old value with one stray char
   (env is read at container start) — a session restart is needed for the clean value
   to take, and the dashboard `/api/rc-*` routes (which don't trim) will keep failing
   auth until then.
2. **Point the Pass-1 extractor at the Basecamp "GSR Monologues" vault (id 9668065709),
   not RDC.** RDC strips David's visual cues down to bare `(PAUSE)`s.
3. **Anchor the extractor on David's spoken lead-in phrases, not on production tokens**
   (§7). The lead-in is the only signal stable across Jan→May; scan for mid-sentence
   `[insert …]` / `Insert clip` markers too, not just standalone lines.
3. **Match vault doc → episode by creation batch + content, not by title.** Doc
   IDs are monotonic; each "5 monologues" to-do batch maps to one show cycle in order.
4. **Treat `just for visual(s)` / `pull clips` / `Stock footage` as B-roll/silent
   intent flags, and David-to-editor asides as Notes, never on-screen text.**
5. **Confirm the six §5 ambiguities** before any extraction is allowed to write —
   especially the Ep027 "no explicit cues" case, which should be surfaced to David/
   Isaac rather than auto-filled.
