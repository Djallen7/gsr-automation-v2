# GSR Lower-Thirds Style Guide

**Show:** Genesis Science Report (GSR), Season 3  
**Source:** Synthesized from 200 production records (S3 EP16–EP24), personal-claude.md, ai_usage_profile.md, recurring_difficulties.md, and the live codebase  
**Last updated:** 2026-05-28  
**Canonical truth:** This document + the Zod schema in `apps/dashboard/src/app/api/import/route.ts`

---

## 1. Non-Negotiable Format Rules

Every lower-third, every time, no exceptions:

| Rule | Correct | Wrong |
|------|---------|-------|
| ALL CAPS | `THE CELL IS A MACHINE` | `The Cell Is A Machine` |
| No em dashes | `DARWIN / HIS OWN DOUBTS` | `DARWIN — HIS OWN DOUBTS` |
| No commas | `FRANK SHERWIN \| ZOOLOGIST \| ICR` | `FRANK SHERWIN, ZOOLOGIST, ICR` |
| No quotation marks wrapping the line | `THE CELL IS A MACHINE` | `"THE CELL IS A MACHINE"` |
| Quotation marks inside OK | `DARWIN: "I WOULD HAVE USED NATURAL PRESERVATION"` | n/a |
| No markdown formatting | bare text | bold, tables, backticks |

Tone: punchy cable-news, biblical worldview. Every line must work standalone as a spoken banner with no graphic to complete it.

---

## 2. Length

**Target: 41–65 characters, 7–11 words.**

- 87% of all production records fall in the 41–65 character range.
- Hard floor: don't write a lower-third shorter than ~40 characters unless it's a fixed title card (see Section 5.1).
- Soft ceiling: 65 characters. Going above 65 requires deliberate justification (e.g., a three-part chyron with a long institution name).
- The AI regeneration prompt enforces **8 words or fewer** as a hard cap for AI-generated alternatives.
- The database field accepts up to 200 characters — that is a storage constraint, not a style target.

**Common mistake:** The AI consistently overshoots 60–65 characters. Count before delivering.

---

## 3. Separator Guide

Three separators exist. Each has a specific job.

### Pipe `|` — for chyrons and contact cards only

Used exclusively when a lower-third has two or three named fields:
- Guest chyrons: `NAME | DISCIPLINE | AFFILIATION`
- Ministry contact cards: `SUPPORT THE MISSION | DAVIDRIVES.COM | 931-212-7990`
- Radio promos: `AMERICA'S GOSPEL MUSIC | SUNDAYS 6 AM | WSM 650`

**Never use a pipe in a topic or discussion lower-third.**

### Colon `:` — for "label: claim" topic beats (most common)

The dominant separator in interview segments. Format: `LABEL: SPECIFIC CLAIM`

Examples from production:
- `THE HABITABLE ZONE: NECESSARY, BUT NOT SUFFICIENT`
- `ARCHAEOPTERYX: TRANSITIONAL FORM OR DISTINCT CREATURE?`
- `THE GENETIC CODE: ONE RULE, THREE BILLION YEARS`
- `GULF OF MEXICO DEAD ZONE: SIZE OF MASSACHUSETTS`
- `DARWIN, 1860: "I WOULD HAVE USED NATURAL PRESERVATION"`
- `LEGATES: PATTERN-MATCH TO POPULATION BOMB, PEAK OIL`

### Forward slash `/` — for paired attributions

Used when a dash or em dash would otherwise appear, or to pair a title with its subject:
- `BEIJERINCK'S PUZZLE: MICROBES EVERYWHERE / ORIGINS UNKNOWN`
- Do not use where a colon or pipe is the right choice.

### Hyphen `-` — for book-author attributions

Specific to resource plugs and book citations:
- `CLIMATE AND ENERGY: THE CASE FOR REALISM - LEGATES`
- `THE DARWIN EFFECT - DR. JERRY BERGMAN`

---

## 4. Guest Chyron Format

**Template:** `DR. [FIRSTNAME LASTNAME] | [DISCIPLINE] | [AFFILIATION]`

The third field is flexible and context-dependent. It can be:
- An institution: `DR. TIM CLAREY | RESEARCH SCIENTIST | INSTITUTE FOR CREATION RESEARCH`
- A publication credential: `DR. ANDREW FABICH | MICROBIOLOGIST | CITED IN NATURE AND SCIENCE`
- A book plug: `DR. JERRY BERGMAN | BIOLOGIST | AUTHOR, THE DARWIN EFFECT`
- A role: `DR. JOHN BARENTINE | ASTRONOMER | FOUNDER, DARK SKY CONSULTING`
- A sub-credential: `DR. MING WANG | HARVARD & MIT EYE SURGEON | PHD, LASER PHYSICS`

### Name prefix rules

- Use `DR.` prefix for guests with a PhD or MD who use the title professionally.
- When a guest doesn't use the DR. prefix, place the credential after the name: `BRIAN THOMAS, PHD | PALEOBIOCHEMIST | INSTITUTE FOR CREATION RESEARCH`
- Two-field variants are allowed when context is self-explanatory: `DR. DAN JANZEN | EXEC. DIR., FELLOWSHIP OF CHRISTIAN FARMERS`

### Credential verification (mandatory)

Every title, degree, and affiliation must come from what the guest provided — their bio, website, or email — not from an AI summary or secondary source. If a credential can't be verified, flag it: `[FLAGGED — verify before air]`

### All 13 production chyrons verbatim (S3 EP16–EP24)

```
DR. FRANK SHERWIN | ZOOLOGIST & SCIENCE WRITER | INSTITUTE FOR CREATION RESEARCH
BRIAN THOMAS, PHD | PALEOBIOCHEMIST | INSTITUTE FOR CREATION RESEARCH
DR. JOHN BARENTINE | ASTRONOMER | FOUNDER, DARK SKY CONSULTING
DR. ANDREW FABICH | MICROBIOLOGIST | CITED IN NATURE AND SCIENCE
DR. ANDREW FABICH | MICROBIOLOGIST | LOGOS RESEARCH ASSOCIATES
DR. MICHAEL HOUTS | PHD | NUCLEAR ENGINEERING
DR. DAVID LEGATES | DIRECTOR OF SCIENCE | CORNWALL ALLIANCE
DR. TIM CLAREY | RESEARCH SCIENTIST | INSTITUTE FOR CREATION RESEARCH
DR. JERRY BERGMAN | BIOLOGIST | AUTHOR, THE DARWIN EFFECT
DR. CARL WERNER | RESEARCHER | AUTHOR, EVOLUTION: THE GRAND EXPERIMENT
DR. CARL WERNER | EVOLUTION: THE GRAND EXPERIMENT - 3RD EDITION
DR. MING WANG | HARVARD & MIT EYE SURGEON | PHD, LASER PHYSICS
DR. DAN JANZEN | EXEC. DIR., FELLOWSHIP OF CHRISTIAN FARMERS
```

---

## 5. Segment-by-Segment Rules

### 5.1 Opening Monologue

**Title card (beat 1):**  
Fixed format: `DAVID'S TAKE: [TOPIC HOOK]`

Production examples:
- `DAVID'S TAKE: EYES FIXED ABOVE`
- `DAVID'S TAKE: LIGHTS ON THE MOON`
- `DAVID'S TAKE: PLAYING GOD`
- `DAVID'S TAKE: INCONVENIENT TRUTH`

The topic hook is 2–4 words. Punchy. Teases the argument, doesn't summarize it.

**Beat 2 (newsy hook):**  
The first substantive lower-third. Should work as a standalone cable-news headline about the episode topic. NOT a show preview. NOT "TONIGHT ON GSR."

**Beat 3 (evergreen):**  
Must be triggerable at any point in the monologue without being context-dependent. The single most universally applicable statement from the episode topic.

**Beats 4 onward:**  
Progressively advance the monologue's argument. Each beat should reflect a specific claim or turning point in the script — not a general summary of the topic.

**Format:** Pure declarative sentences. No pipe separators. Flowing, not colon-structured. Average length: 10 words, 57 chars.

Production examples from monologue beats:
```
WE HAVE ENTERED A BRAVE NEW WORLD OF UAP DISCLOSURE TODAY
APOLLO SEVENTEEN SAW THREE MYSTERY LIGHTS ABOVE THE MOON
ELIJAH'S CHARIOT, THE MAGI'S STAR, AND A SKY FULL OF WONDER
THE HEAVENS DECLARE THE GLORY OF THE GOD WHO MADE THE SUN ABOVE
GOD SET THE SEA BOUNDARIES AND CALLS EACH STAR BY ITS NAME
HARD TO GET A MAN TO UNDERSTAND A THREAT TO HIS PERSONAL SALARY
MEXICO BANNED ALL SOLAR GEOENGINEERING AFTER MAKE SUNSETS TRIED
A PARTICLE FORMULA THEY WILL NOT SHOW TO EIGHT BILLION PEOPLE
STUDYING CREATION IS NOT THE SAME AS REWIRING CREATION ITSELF
```

**Target count:** 15–17 lower-thirds per monologue segment. Beat 1 is always the title card.

**What not to do:**
- Don't write generic topic labels: `CREATION SCIENCE` is not a lower-third.
- Don't write preview-style openers: `TONIGHT WE LOOK AT CREATION` is not beat 2.
- Don't use em dashes or commas.
- Don't restart from a preview when a good hook exists in the monologue script itself.

---

### 5.2 Interview Segments (interview_1, interview_2)

**Beat 1 (teaser headline):**  
Often a newsy hook or rhetorical question that sets the interview topic before the guest is introduced. The guest name does NOT appear here.

Production examples of beat 1 openers:
- `'EARTH-SIZED' AND 'HABITABLE' ARE NOT THE SAME THING`
- `SOFT TISSUE IN 150-MILLION-YEAR-OLD FOSSILS. THE CHEMISTRY PROBLEM`
- `THE SMELL OF RAIN: LIVING EVIDENCE OF NOAH'S FLOOD`
- `WHEN BIOLOGY BREAKS ITS OWN RULES, WHO WROTE THEM?`
- `DARWIN'S OWN DOUBTS: WHAT HIS LETTERS REALLY SHOW`

**Beat 2 (guest chyron):**  
The name/title/affiliation card. See Section 4.

**Beats 3 onward (topic and discussion beats):**  
Each beat maps to a specific question, answer, or discussion point in the interview. Not a general label for the overall topic.

**Five structural patterns for interview topic beats:**

**A. COLON CLAUSE** — `LABEL: SPECIFIC CLAIM` (most common)
```
THE HABITABLE ZONE: NECESSARY, BUT NOT SUFFICIENT
SOFT TISSUE: DINOSAUR PRESERVATION IS A CHEMISTRY PROBLEM
ARCHAEOPTERYX: TRANSITIONAL FORM OR DISTINCT CREATURE?
GULF OF MEXICO DEAD ZONE: SIZE OF MASSACHUSETTS
CAMBRIDGE WRAPS 30-VOLUME DARWIN ARCHIVE: 15,000 LETTERS
NATURE 2024: PROPOSAL FOR A 10TH PLANETARY BOUNDARY
DARWIN, 1860: "I WOULD HAVE USED NATURAL PRESERVATION"
```

**B. DECLARATIVE STATEMENT** — flowing, no separator
```
THOUSANDS OF EXOPLANETS FOUND. NONE LIKE EARTH
SCIENCE KEEPS FINDING COMPLEXITY WHERE IT EXPECTED SIMPLICITY
RANDOMNESS THAT SERVES A PURPOSE IS NOT RANDOM
THE ASSUMPTION LIFE IS COMMON IS NOT THE SAME AS EVIDENCE THAT IT IS
WHEN THE HEADLINE OUTRUNS THE EVIDENCE
```

**C. RHETORICAL QUESTION**
```
WHEN BIOLOGY BREAKS ITS OWN RULES, WHO WROTE THEM?
WHAT DOES THE GENETIC CODE ACTUALLY TELL US?
PROTEINS DON'T LAST MILLIONS OF YEARS. SO HOW IS THIS HERE?
"PROOF DARWIN WAS RIGHT" OR PROOF THE TIMELINE IS WRONG?
```

**D. GUEST ATTRIBUTION** — `SPEAKER: CLAIM` or `CLAIM - SPEAKER`
```
LEGATES: PATTERN-MATCH TO POPULATION BOMB, PEAK OIL
CLAREY: FLOOD RUNOFF EXPLAINS IT WITHOUT SINKING MOUNTAINS
BERGMAN: DARWIN MORE HONEST THAN HIS MODERN DEFENDERS
CLIMATE AND ENERGY: THE CASE FOR REALISM - LEGATES
THE DARWIN EFFECT - DR. JERRY BERGMAN
```

**E. STAT / CITATION** — source + number
```
LAKES HAVE LOST 5.5% OF DISSOLVED OXYGEN SINCE 1980
NATURE (2012): ORGANIC FARMS YIELD 25% LESS THAN CONVENTIONAL
PNAS STUDY: HIGH-YIELD FARMING PREVENTED 590 GIGATONS OF CO2
125 MILLION PHOTORECEPTORS IN THE HUMAN RETINA
OARD: 1,700 WATER GAPS IN THE APPALACHIANS ALONE
```

**F. SHORT PUNCHY TRIPLET** — period-separated
```
ONE CODON. TWO PROTEINS. NO KNOWN MECHANISM
SELECTION ACTIVELY CHOOSES. PRESERVATION IS PASSIVE.
DOUBT IS NOT WEAKNESS. IT'S HOW SCIENCE WORKS.
```

**Target count:** 12–18 lower-thirds per interview segment.

**What not to do:**
- Don't write discussion beats as generic topic labels: each must map to a specific claim.
- Don't invent guest credentials — chyron must reflect what the guest provided.
- Don't put the book plug formatted as a topic lower-third (this got rejected: `CARVED IN STONE - TIM CLAREY (CREATION SUPERSTORE)`).

---

### 5.3 Ministry Report

Three beats per episode. Fixed structure:

**Beats 1–2 (episode-specific news items):**  
Current events, announcements, or milestones at the ministry or its properties. Short, newsy. No pipe separators needed unless it's a contact/promo line.

Production examples:
```
WONDERS OF CREATION CONFERENCE PACKS WONDERS CENTER
KNOWLEDGE HALL NOW OPEN AT THE WONDERS CENTER
NEW ARTIFACTS FROM PETRA AND JORDAN ON DISPLAY
LIFE-SIZED T-REX GREETS GUESTS AT WONDERS CENTER
THREE AUTHENTIC TORAH SCROLLS NOW ON DISPLAY
```

**Beat 3 (standing CTA — fixed, do not rewrite):**  
This card runs identically on every episode:
```
SUPPORT THE MISSION | DAVIDRIVES.COM | 931-212-7990
```

Do not change this card. Do not rewrite for variation. It is a recurring brand element.

---

### 5.4 Show Intro

One lower-third, written as a newsy episode hook. The show intro L3 appears before any interview or monologue content — it sets the news peg for the entire episode.

Production example:
```
ANOTHER 'EARTH TWIN' DISCOVERED. HERE'S WHAT THE DATA ACTUALLY SHOWS
```

---

### 5.5 Other Segments (kids_corner, genesis_science_qa, viewer_voices, featured_resource, heavens_declare, genesis_science_minute)

These segments typically use a title card (e.g., `KIDS CORNER`, `GENESIS SCIENCE Q&A`) and one or two content beats. No established multi-beat pattern exists yet in the production data — follow the same ALL CAPS, 41–65 char, no-em-dash rules.

---

## 6. L3 Type Reference

The `l3_type` field classifies each lower-third's role in the segment. Current valid values:

| l3_type | Description | Segment |
|---------|-------------|---------|
| `episode_intro_l3` | Show-open newsy hook | show_intro |
| `monologue_title_card` | "DAVID'S TAKE: [TOPIC]" — always beat 1 | opening_monologue |
| `monologue_beat` | Substantive argument beat | opening_monologue |
| `guest_chyron` | NAME \| DISCIPLINE \| AFFILIATION | interview_1, interview_2 |
| `topic_l3` | Subject/topic identifier for the interview | interview_1, interview_2 |
| `discussion_l3` | Specific claim or argument from the discussion | interview_1, interview_2 |
| `segment_graphics_title` | Segment name card (e.g., KIDS CORNER) | any |
| `qa_topic_l3` | Question topic in Q&A segment | genesis_science_qa |
| `mr_news_l3` | Ministry news item | ministry_report |
| `mr_cta_l3` | Standing contact/CTA card | ministry_report |
| `resource_l3` | Featured resource title or book card | featured_resource |

---

## 7. The 3-Column System (Primary / Var 1 / Var 2)

Each lower-third may carry up to three text variants. The three columns serve distinct purposes:

| Column | Field | Purpose |
|--------|-------|---------|
| **Primary** | `initial_text` | The canonical, approved text — what goes in ProPresenter |
| **Var 1** | `var_1` | Shorter alternate (often a compressed version) |
| **Var 2** | `var_2` | Abbreviated or alternate-angle version |

Production example from EP30 test data:
```
Primary: MITOCHONDRIAL EVE
Var 1:   MITOCHONDRIAL EVE
Var 2:   MT. EVE
```

In the current dashboard, the 3-column system is not yet fully surfaced in the UI. Primary (`initial_text`) is what the operator approves. Var 1 and Var 2 are stored but not yet displayed as alternates in the card view.

---

## 8. Common Mistakes (from 879 sessions of data)

These mistakes appear repeatedly. The style guide exists partly because of them.

| Mistake | Correct approach |
|---------|-----------------|
| Em dashes in any field | Use period, colon, forward slash, or hyphen |
| Writing lower-thirds as general topic labels | Each beat must map to a specific claim or discussion point |
| Formatting as markdown tables | Bare text lines, one per beat |
| Overshooting 60–65 char target | Count before delivering |
| Character count drift over many beats | Audit each set against target before finalizing |
| AI variation too short | Human style runs ~57 chars / 10 words; AI draft "OBSERVING CREATION ISN'T REENGINEERING IT" (42 chars) was rejected in favor of "STUDYING CREATION IS NOT THE SAME AS REWIRING CREATION ITSELF" (62 chars) |
| Using pipes in topic beats | Pipes are chyron/contact only |
| Preview-style beat 2 | Beat 2 is a newsy headline, not a tease for what's coming |
| Fabricating guest credentials | Pull from guest's own bio/website/email only |
| Comma usage | No commas. Period. |
| Quotation marks wrapping the full line | Quotes are for in-text citations only |

---

## 9. Segment Enum Values (Postgres)

These are the exact values the database and import schema accept:

```
show_intro
opening_monologue
interview_1
interview_2
kids_corner
genesis_science_qa
ministry_report
viewer_voices
featured_resource
heavens_declare
genesis_science_minute
other
```

---

## 10. Extraction Prompt Quick Reference

When extracting lower-thirds from a script Google Doc:

1. Lower-thirds appear as standalone ALL CAPS lines, sometimes prefixed `LT:`, `LOWER THIRD:`, or `GRAPHIC:`.
2. Name + role pattern: `DR. JOHN SMITH / GEOLOGIST` in older scripts; current standard is pipes.
3. Segment headers map to enum values (`INTERVIEW 1` → `interview_1`, `KIDS CORNER` → `kids_corner`).
4. Replace any em dash with a forward slash or colon.
5. `beat_number` increments continuously within a segment — never restarts when l3_type changes.
6. If a line exceeds 200 characters, put it in a `rejected` notes block.
7. Never invent episode metadata — leave `null` if the field isn't in the doc.

Full extraction prompt: see `FEATURE_1_LOWER_THIRDS_TEXT_IMPORT.md`.

---

## 11. Pre-Air Checklist

Before any lower-thirds package goes on air:

- [ ] Every field is ALL CAPS
- [ ] No em dashes anywhere in the set
- [ ] Guest chyron credentials verified against guest's own provided materials
- [ ] Book/resource plugs verified on creationsuperstore.com — if not there, use website URL only
- [ ] Beat 1 of opening_monologue is `DAVID'S TAKE: [TOPIC]`
- [ ] Ministry report beat 3 is verbatim `SUPPORT THE MISSION | DAVIDRIVES.COM | 931-212-7990`
- [ ] Character counts — spot-check at least 5 random beats against 41–65 range
- [ ] Each discussion beat maps to a specific claim, not a generic topic label

---

## Appendix: Production Data Source Notes

This style guide draws from three local data sources:

**1. Supabase database (200 records, S3 EP16–EP24)**  
Real production lower-thirds used in 8 episodes. Provides verbatim examples, character count distributions, separator usage patterns, all 13 production chyrons, and the 2 rejection cases.

**2. personal-claude.md / ai_usage_profile.md**  
Synthesized from 879 Claude conversation sessions via `archaeology.py`. Provides the distilled style rules, recurring friction points, and correction history.

**3. Feature spec and codebase**  
`FEATURE_1_LOWER_THIRDS_TEXT_IMPORT.md`, `FEATURE_1_LOWER_THIRDS.md`, and `apps/dashboard/src/app/api/regenerate/route.ts` provide the technical constraints and segment enum values.

**Note on Google Drive archives:** The three Drive folders referenced in the session request ('Multisource Forensic Data', 'Open AI Data Export', 'Claude Data Export') were not accessible from this remote execution environment. The Claude Data Export corresponds locally to `archaeology_data.json` (3.6MB, 879 conversations) from which `personal-claude.md` and `ai_usage_profile.md` were already synthesized. The Multisource Forensic Data and Open AI Data Export archives, if available locally, may contain additional examples not yet reflected here — update this guide after reviewing them.
