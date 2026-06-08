# Cognitive Load, Status Visualization, and Accessibility for the GSR Pipeline Dashboard

Date: 2026-06-08
Author: UX research brief (teaching module)
Subject: Per-role production-pipeline dashboard. Central visual is a PIPELINE MATRIX (rows = episodes, columns = 9 stages, each cell = a status). Plus an exception/action queue ("what needs you now").
Primary user: project owner, ADHD, time-pressed, non-developer, mostly on a phone, ~10 episodes in flight.

Note on research method: sources below were verified by live web search on 2026-06-08. Where a quote is paraphrased it is marked as such; no URLs or quotations are fabricated. All WCAG numbers are the real published thresholds.

---

## 1. Cognitive load: the real limits and how to apply them

### What the science actually says

- Miller's 1956 paper "The Magical Number Seven, Plus or Minus Two" is the most cited and most misused number in UX. Miller's limit applied to absolute judgment of one-dimensional stimuli (distinguishing tones, brightness) and to immediate recall span. It was never a rule that an interface should show seven items. Miller himself objected to the misreading. Treat "7 plus or minus 2" as a historical footnote, not a design rule.
- The modern correction: Nelson Cowan (2001) put the real working-memory limit at about 4 chunks once rehearsal and long-term-memory support are removed. Four, not seven, is the honest planning number.
- Cognitive Load Theory (John Sweller, late 1980s) reframes the issue: a task is hard when it overloads working memory. The design lever is to cut the number of things the user must hold in their head at once, not to count items on screen.
- Hick's Law (Hick and Hyman, 1952): decision time rises logarithmically with the number of choices. More options means slower decisions. The fix is fewer simultaneous choices, achieved by grouping, hierarchy, and sensible defaults.

The unifying takeaway: the enemy is not "more than seven boxes," it is simultaneous decisions. Reduce how many independent judgments the user must make before they can act.

### Applied to this dashboard (ADHD, time-pressed, on a phone)

ADHD raises the cost of every context switch and every "where do I even start" moment. The dashboard must answer "what do I do next" before it answers anything else.

Rules to bake in:

1. Max about 5 primary elements per screen. On the phone home view that is: the action queue, the matrix (or its mobile collapse), one "next air date" banner, a single primary button, and navigation. Everything else is one tap away, not on the first screen.
2. Exactly one focal point per screen. The home screen's focal point is the action queue ("what needs you now"). The matrix is reference, not the hero. Do not give two things equal visual weight; that forces a choice and triggers Hick's Law.
3. Defaults over blanks. Never present an empty field or an open-ended "pick a stage." Pre-select the sort (air date, soonest first), pre-filter to "needs you," and pre-fill the most likely value. Each default is one decision removed.
4. Externalize memory. Cowan's ~4-chunk limit means the user should never have to remember a status from one screen to recall it on another. Carry the row summary chip and the air date with the user into the drill-down so nothing has to be held in the head.
5. One action at a time in the queue. The queue should read as a short ordered list of single next actions, not a dashboard of metrics to interpret.

Sources: Miller 1956 (paraphrased, via NN/g "The Magical Number 7 and UX"); Cowan 2001; Sweller, Cognitive Load Theory; Hick and Hyman 1952; NN/g and Laws of UX (see Sources).

---

## 2. Progressive disclosure: show the minimum, reveal on demand

Nielsen Norman Group's established definition (paraphrased from the cited article): progressive disclosure defers advanced or rarely used features to a secondary screen, showing users only the few most important options first and revealing the rest on request. NN/g's key caveat: stay within about 2 disclosure levels, because users get lost moving between deeper levels.

This maps cleanly to a four-tier flow, but it must not feel like four levels of menu. Treat it as one default view plus drill-downs:

1. Queue (top level, the landing): the minimum. "What needs you now," ordered. This is where the user starts and where they should be able to stop.
2. Matrix (reference, one tap): the 10-by-9 status grid for oversight when the user wants the whole picture.
3. Episode drill (one tap from a row): a single episode's nine stages as a vertical stepper with detail.
4. Working surface (one tap from a stage): the actual task for one stage.

Design discipline: the queue alone should let the user finish a normal day. The matrix is the "I want the full picture" view, not the default. Anything past the episode drill is the "secondary screen" NN/g describes; keep the route short so the user never feels lost between levels.

Source: NN/g, "Progressive Disclosure."

---

## 3. Status visualization done right

### Encode status with shape plus color, never color alone

Roughly 1 in 12 men and 1 in 200 women have a color vision deficiency, and red/green confusion is the most common. WCAG 1.4.1 (Use of Color, Level A) requires that color is never the only means of conveying information. So every status must carry a non-color cue: a shape, fill pattern, icon, or text label that reads correctly in grayscale.

Recommended scheme (one consistent meaning per color, each paired with a distinct shape):

| Status | Color | Shape / non-color cue |
| --- | --- | --- |
| Needs attention / at risk | Red | Solid filled triangle (or filled circle with an exclamation glyph) |
| Done | Green | Solid filled circle with a check |
| In progress | Gold | Ring / open circle with a gold stroke |
| Not started | Neutral gray | Hollow outline circle, no fill |
| Deferred | Violet | Dashed-outline shape |

Rules:

- One meaning per color, everywhere. Red always means needs-you / at-risk, never decoration, never a brand accent elsewhere in the UI. Consistency is what lets a glance work.
- Grayscale test. Print or filter the matrix to grayscale; if you cannot tell statuses apart, the shapes are not doing their job.
- Motion only on a user-caused state change. A cell may briefly animate when the user advances a stage (confirmation feedback). No ambient, looping, or background motion behind data. Continuous motion is an attention tax that is especially costly for ADHD users and can violate users' motion-reduction needs.
- Never show one fact in multiple redundant encodings. Do not encode the same status as color AND a separate badge AND a percentage AND a label all at once. Redundancy here means shape-plus-color as a single paired cue, not four parallel indicators competing for attention. Pick the paired cue and a short label; stop there.

Sources: WCAG 1.4.1 Use of Color; color-vision-deficiency prevalence (widely cited clinical figures); NN/g on motion and attention.

---

## 4. Accessibility: WCAG 2.2 numbers to bake in

These are the specific, real thresholds. Build to them.

- 1.4.3 Contrast (Minimum), Level AA: text and images of text need a contrast ratio of at least 4.5:1 against background. Large text (at least 18pt, or 14pt bold) may be 3:1. Bake 4.5:1 in as the floor for all status labels, chips, and queue text.
- 1.4.11 Non-text Contrast, Level AA: user-interface components and graphical objects (the matrix cell shapes, borders, icons, the gold ring, the violet dash) need at least 3:1 against adjacent colors. This is the rule that makes the status shapes actually visible, do not let a pale ring sit on a pale cell.
- 2.5.8 Target Size (Minimum), Level AA: interactive targets must be at least 24 by 24 CSS pixels, unless a spacing exception is met. On this phone-first matrix, treat 24px as the hard minimum and design to roughly 44px for comfortable thumb taps (the long-standing recommended touch-target size). Matrix cells are tap targets, size them accordingly.
- 2.4.11 Focus Appearance, Level AA (WCAG 2.2): keyboard focus indicators must be clearly visible. The practical rule: the focus indicator has at least 3:1 contrast against adjacent colors and is at least 2 CSS pixels thick (or an equivalent area). Never remove focus outlines; every cell, chip, and button needs a visible focus state.
- Text legibility: do not ship status as tiny all-caps gray-on-gray. Use adequate size and the 4.5:1 floor. Keep labels short and real-word.

Quick checklist for a cell: paired shape+color (1.4.1), shape contrast 3:1 (1.4.11), any text 4.5:1 (1.4.3), tap target at least 24px and ideally ~44px (2.5.8), visible focus ring (2.4.11).

Sources: W3C WCAG 2.2 (1.4.3, 1.4.11, 2.5.8, 2.4.11, 1.4.1).

---

## 5. Data-grid / matrix usability

A 10-row by 9-column status grid is dense. Make it scannable, not a spreadsheet to decode.

Desktop / wide view:

- Sticky headers: freeze the top row (the 9 stage names) and the left column (episode + air date) so the user never loses context while scrolling. This is the single highest-value grid affordance.
- Per-row summary chip: each episode row ends in a single chip reading On track / Watch / Behind. This is the row's verdict so the user does not have to scan nine cells to judge one episode. It is also the chunk that survives into the drill-down (externalized memory, see section 1).
- Per-column bottleneck signal: each stage column shows "n of 10 cleared" (for example "3 of 10"). A low number flags a system-wide bottleneck at that stage, which a row-by-row read would hide.
- Sort by air date by default, soonest first. This is the default that matches the user's real question ("what is closest to air").
- Auto-flag rows within 7 days of air: rows whose air date is inside 7 days get a persistent at-risk emphasis (the red paired cue on the row summary) regardless of stage status, so an imminent episode cannot slip by unnoticed. This is the David Rule applied to the matrix: air dates are high stakes.

Mobile collapse (the primary view for this user):

A 10-by-9 grid does not fit a phone. Collapse each episode row into a single compact card:

- A segmented color bar of 9 segments, one per stage, using the same paired shape+color scheme (or at minimum the colors plus a pattern so it survives the no-color-alone rule even at bar size).
- The air date, shown plainly.
- The row status chip (On track / Watch / Behind).
- Tap to expand into a vertical stepper: the nine stages stacked top to bottom, each with its status cue and a tap-through to its working surface.

This keeps the phone home screen to about 5 primary elements, preserves one focal point (the queue above the cards), and respects the 24px / ~44px target sizes because each card and each expanded step is a full-width tap target.

Sources: NN/g data-table and grid guidance; the WCAG numbers in section 4; project David Rule (air dates are high stakes).

---

## Sources (verified 2026-06-08)

1. Nielsen Norman Group, "Progressive Disclosure." https://www.nngroup.com/articles/progressive-disclosure/
2. Nielsen Norman Group, "The Magical Number 7 and UX" (video) and "Working Memory and External Memory." https://www.nngroup.com/videos/magical-number-7-ux/ and https://www.nngroup.com/articles/working-memory-external-memory/
3. George A. Miller, 1956, "The Magical Number Seven, Plus or Minus Two," Psychological Review. Classic reference; widely reproduced (e.g. https://psychclassics.yorku.ca/Miller/).
4. Nelson Cowan, 2001, "The magical number 4 in short-term memory," Behavioral and Brain Sciences (the modern correction to Miller).
5. Interaction Design Foundation, "Hick's Law" (Hick and Hyman, 1952). https://ixdf.org/literature/topics/hick-s-law ; also Laws of UX, "Hick's Law," https://lawsofux.com/hicks-law/ and "Cognitive Load," https://lawsofux.com/cognitive-load/
6. W3C, "Web Content Accessibility Guidelines (WCAG) 2.2." https://www.w3.org/TR/WCAG22/
   - 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
   - 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
   - 2.4.11 Focus Appearance: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
   - 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html
7. W3C, 2.5.8 Target Size (Minimum), Level AA (24px). Listed in WCAG 2.2 above; see also https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
8. WebAIM, "Contrast and Color Accessibility." https://webaim.org/articles/contrast/
