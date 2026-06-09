# Monologue Graphics-Cue Spec (PROVISIONAL, 2026-06-08)

**Status:** provisional. Distilled from the Claude data export (the "06_MONOLOGUE
GRAPHICS (GSR)" project + the "01_EPISODE PRODUCTION (GSR)" annotation
conventions). NOT yet validated against a live annotated sample. A separate
session is cross-referencing the raw Basecamp monologues against the early
Rundown Creator scripts to confirm and tighten these rules; update this doc with
its findings, and treat David's confirmed input as final.

**What this is for:** teaching the dashboard to read David's monologue, find the
graphics he is asking for, and produce annotation cues automatically. Each
monologue has two passes; this spec targets **PASS 1** (David's own graphic ideas,
expressed as inline markers and pasted links).

---

## 1. David's pass-1 markers (System A — in his spoken host copy)

All-caps, in parentheses or square brackets, placed at the exact sentence the
visual should fire on:

| Marker | Meaning |
|---|---|
| `(INSERT PICTURE)` | Still / photo during speech |
| `(PLAY SILENT CLIP [link])` | Video rolls silently under David's voice; a link may be pasted in |
| `(GET CLIP)` | Placeholder, clip still to be sourced before air |
| `(INSERT CLIP)` / `(INSERT VIDEO w/audio)` | Full roll-in with audio |
| `[ON SCREEN: ____]` | Full-screen graphic / headline / logo |
| `(***Pause***)` | Beat for camera switch / production cue |
| `(***LOOK AT BACK SCREEN***)` | David turns to the back screen for a THD/GSM roll-in |
| `(BUMPER IN)` / `(BUMPER OUT)` | Pre-rec bumper transitions |
| `(***END***)` / `(END)` | Script end |

Pasted **links/URLs** inside or next to a marker are David's source for that
visual (e.g. the specific clip or article).

## 2. How to interpret a cue

- It is a **graphic** when David names a specific visual object (a photo, an
  article headline, a chart, a fossil/museum display) or wants something concrete
  on screen.
- It is **pre-made (PM) b-roll** when the topic is general: DNA / double helix,
  cell biology, space / nebulae, fossils / sediment, ocean, animal behavior,
  generic museum exhibits.
- The **first graphic of every Opening Monologue is always the "Title Graphic"**
  (never "Intro Graphic").
- `[ON SCREEN: headline]` or an article reference maps to **Article Screenshot**,
  fired the moment David reads/quotes the headline.
- `(INSERT VIDEO w/audio)` maps to **Clip w/audio** (rundown format = `AUDIO`);
  all other graphic types leave format blank.

## 3. Graphic-type vocabulary (downstream)

`Title Graphic` (always first) / `B-roll` / `Pre-made: B-roll` / `Clip w/audio` /
`Picture` / `Article Screenshot` / `Propres Quote`.

Downstream the markers are normalized into `<gfx ...>` tags inside the Rundown
Creator script. Extraction reads those tags **in script order** (never reorder),
one row per tag, reuses tagged `(reuse)`.

## 4. Extraction procedure (as documented in the export)

1. Read the monologue (in Rundown Creator it is the row with `segment == "Monologue"`).
2. Pull every `<gfx ...>` tag in the order it appears.
3. Emit one row per tag with: `graphics` (the simplified 5-8 word cue name),
   `format` (`AUDIO` for Clip w/audio, else blank), `lastline` (the spoken phrase
   that triggers the NEXT row's graphic).
4. The Graphics Tracker gets one row per UNIQUE graphic (reuses skipped, since
   they do not need re-creating); first row Type = `Title Graphic`.

**Hard-won gotchas (from "00_POST PRODUCTION AUTOMATION"):**
- Save scripts with `isPlainText=false`, or the `<gfx>` tags get HTML-escaped and
  destroyed.
- Update tracker rows with **numeric** column-ID keys, not string names (string
  keys silently fail on non-trivial rundowns). Mapping seen: 1=graphics, 2=format,
  4=lastline, 9=notes.

## 5. Open questions (need a real David sample to lock)

1. No verbatim raw monologue sample exists in the export, so the exact way David
   writes markers in running copy is inferred, not confirmed.
2. Whether David's pass-1 markers originate in **Basecamp** specifically (the
   export sources monologues from Rundown Creator row B3 and lists Basecamp only
   as task tracking). The cross-reference session is checking this.
3. The mapping from a raw marker (e.g. `(PLAY SILENT CLIP [link])`) to the final
   graphic type is implied, not written down.
4. The literal `<gfx>` tag attribute syntax is never shown in the export.
5. The PM b-roll library is not inventoried, so matching a generic cue to an
   existing asset cannot be automated yet.

**Single most useful next input:** one real annotated Opening Monologue from David
(raw, as he writes it) plus that episode's Rundown Creator B3 row, to pin the
marker -> `<gfx>` -> tracker mapping to ground truth.
