# THD Basecamp Verification Status

Collector: V-THD (read-only; no writes, no commits)
Date: 2026-06-01
Task: Wave 1 — THD Basecamp preflight (#5)

---

## GATE 1 — READ-ONLY CONSTRAINT RESTATEMENT

**Allowed Basecamp commands (read-only):** `basecamp projects list`, `basecamp search`, `basecamp show <url>`, `basecamp todos ... list`, `basecamp messages ... list/show`, `basecamp chat` (read). No write commands of any kind: no `basecamp todo`, `basecamp done`, `basecamp comment`, `basecamp message`, `basecamp card`, `basecamp attach`, `basecamp upload`, `basecamp config set`, or any auth changes.

**Authenticity filter (applied before any sample is saved):** INCLUDE only text that is clearly an authored teleprompter/script for David to read: prose sentences, teleprompter cadence, written-to-be-spoken. EXCLUDE: ASR/auto-captions, bullet outlines, production notes, other people's voice, anything labeled draft-by-AI. When in doubt, EXCLUDE and flag — never silent-kill.

**Verbatim rule:** Any voice sample saved is copied byte-for-byte from the authored script as fetched via `basecamp show`. No paraphrase, no summarization, no editing.

**Basecamp read access confirmed:** Account "David Rives Ministries" (ID 5805529), already OAuth-authenticated. CLI at `/Users/claudefix/.local/bin/basecamp` version 0.7.2.

---

## PROBE COMMANDS RUN

```
/Users/claudefix/.local/bin/basecamp projects list --json
/Users/claudefix/.local/bin/basecamp search "THD" --json
/Users/claudefix/.local/bin/basecamp search "Today's Headlines" --json
/Users/claudefix/.local/bin/basecamp search "headline" --json
/Users/claudefix/.local/bin/basecamp search "script" --json
/Users/claudefix/.local/bin/basecamp search "David Rives" --json
/Users/claudefix/.local/bin/basecamp messages list --json -p 37738136
/Users/claudefix/.local/bin/basecamp show "https://3.basecampapi.com/5805529/buckets/37738136/vaults/9668067133.json" --json
/Users/claudefix/.local/bin/basecamp show "https://3.basecampapi.com/5805529/buckets/37738136/documents/9668068070.json" --json   [Hornbill]
/Users/claudefix/.local/bin/basecamp show "https://3.basecampapi.com/5805529/buckets/37738136/documents/9668068101.json" --json   [Woodpecker]
/Users/claudefix/.local/bin/basecamp show "https://3.basecampapi.com/5805529/buckets/37738136/documents/9668068019.json" --json   [Ark Map]
/Users/claudefix/.local/bin/basecamp show "https://3.basecampapi.com/5805529/buckets/37738136/documents/9668067536.json" --json   [Leadwood]
/Users/claudefix/.local/bin/basecamp show "https://3.basecampapi.com/5805529/buckets/37738136/documents/9668067986.json" --json   [Removing God]
/Users/claudefix/.local/bin/basecamp show "https://3.basecampapi.com/5805529/buckets/37738136/documents/9668068004.json" --json   [Charting Seas]
/Users/claudefix/.local/bin/basecamp show "https://3.basecampapi.com/5805529/buckets/37738136/documents/9878904977.json" --json   [Eyes Fixed - GSR Monologue, not THD]
```

---

## PROJECTS SEARCHED

| ID | Name | Notes |
|----|------|-------|
| 37738001 | 01_DRM Staff | Searched for THD todos, schedule entries, chat references |
| 37738136 | 02_ Production | Primary target — contains THD Kanban cards, THD Scripts vault |
| 43579448 | Aquarium | No THD content found |
| 47455443 | Prayer Request- Donors and Staff | No THD content found |

---

## KEY FINDINGS

### THD Scripts Vault

A vault titled **"THD Scripts"** exists in the 02_Production project:
- Vault ID: 9668067133
- App URL: https://app.basecamp.com/5805529/buckets/37738136/vaults/9668067133
- Creator: Jakob Rose (Lead Editor)
- Created: 2025-11-25
- Documents count: **82**
- All documents in this vault are authored by **David Rives** (accounts@davidrives.com, account owner/president)

The vault contains one document per THD episode. Document titles match the Kanban card names exactly (e.g., "The Hornbill Bird", "The Remarkable Woodpecker", "Charting the Seas").

### THD Kanban Board

The 02_Production project has a Kanban board with cards titled "THD NNN — [title]". Cards have columns including "Recorded". Card bodies are mostly empty (production tracking, not script storage). Scripts live in the vault documents.

### Additional THD references

- 76 search hits for "THD" across both projects
- Schedule entries: "PROD | Film THDs" (multiple dates)
- Todos: "Mix [Title] THD" (audio post)
- Chat: "Daniel Allen + David Rives | Can you send us the THD scripts that you have finished?" — this chat references an earlier period when scripts were being collected

---

## AUTHENTICITY FILTER RESULTS

Six documents were read in full. Creator on all six: David Rives (`accounts@davidrives.com`). All stored in the THD Scripts vault.

### PASS (2 documents — voice samples saved)

| Doc ID | Title | Pass rationale |
|--------|-------|----------------|
| 9668067536 | The Leadwood and Jackalberry of South Africa | On-location stage directions in parentheses ("(On location savannah / Bushveld setting, trees visible in background)", "(gesture toward nearby tree)", "(mimic holding fruit)", "(gesture downward)"); ellipsis-paced teleprompter delivery lines; short spoken-unit sentence structure; full THD sign-off: "I'm David Rives, truly, the heavens declare the glory of God" |
| 9668067986 | Removing God From The Equation | Stage direction at open "(Sitting at desk with old books)"; short punchy spoken-for lines throughout; rhetorical question structure; full THD sign-off: "I'm David Rives… truly, the heavens declare the glory of God" |

Both are unambiguously authored teleprompter scripts, not transcripts or outlines.

### UNCERTAIN — FLAGGED FOR DANIEL (4 documents — not saved as voice samples)

| Doc ID | Title | Flag reason |
|--------|-------|-------------|
| 9668068070 | The Hornbill Bird | THD sign-off present; personal safari reference ("I've taken closeup pictures of hornbills… while leading families on my annual African photo safaris") is strong David marker; ALL-CAPS stress present (LARGE, SEALED, NARROW, FEED). BUT: long explanatory paragraphs in essay structure; no stage directions; reads more essay than teleprompter. Cannot confidently call it clean-David teleprompter vs. ghostwritten/AI-assisted. Daniel should rule. |
| 9668068101 | The Remarkable Woodpecker: Nature's Headbanger | THD sign-off present; personal address "yeah, I'm talking about YOU!"; ALL-CAPS stress (THRIVE). BUT: long multi-sentence explanatory paragraphs; reference URL link embedded in document header (Bing image link); essay-style scaffolding. Similar uncertainty to Hornbill. Daniel should rule. |
| 9668068019 | The Ark upon an Ancient Map | THD sign-off present ("I'm David Rives. Truly, the heavens declare the glory of God!"); specific archaeological detail (Imago Mundi, Abu Habba, Sippar); some good factual specificity. BUT: long expository paragraphs ("Historically, accurate sea charts…"-style information delivery); no stage directions; borderline teleprompter vs. article. |
| 9668068004 | Charting the Seas | Psalm 8 KJV quote, factual specificity. BUT: essay-like structure ("From ancient mariners navigating coastal waters to modern scientists mapping the ocean floor…"); long paragraphs; no stage directions; Galileo quote dropped in without personal framing; different sign-off variant ("the Sea teaches us the greatness of His depths!" — not the standard THD close). Weakest pass candidate of the six. |

---

## VOICE SAMPLE FILES SAVED

Two files written to `data-intake/voice/`:

1. `thd_01_leadwood-jackalberry.md` — verbatim from Basecamp document 9668067536
2. `thd_02_removing-god-from-equation.md` — verbatim from Basecamp document 9668067986

Both files include 2-line header: source Basecamp URL + authored=yes, then verbatim script body. No paraphrase. No editing.

---

## SUMMARY FINDING

**THD scripts ARE in Basecamp.** The "THD Scripts" vault in 02_Production contains at least 82 documents authored by David Rives. This is the primary THD script repository. The prior INDEX.md finding ("no authored THD script source in Google Drive") was correct — the scripts do not live in Drive. They live in Basecamp.

**Two documents cleared the authenticity filter** (stage-directed, ellipsis-paced teleprompter scripts). Four documents were flagged as uncertain (essay-like structure despite David Rives authorship) and NOT saved.

**THD source = Basecamp is a usable GSR voice-corpus source.** The vault has 82 documents — only 6 were inspected here. RECOMMENDATION TO LEAD: expand the read pass to the remaining 76 documents in the vault; prioritize the ones with on-location stage directions (as those are the clearest teleprompter scripts) and screen out any with long expository paragraphs lacking spoken-delivery markers. Additionally, the 4 uncertain documents should be sent to Daniel for a ruling — they have the THD sign-off and David authorship but ambiguous teleprompter cadence.

---

## GATE 3 — SELF-AUDIT

- **Projects searched:** 02_Production (primary); 01_DRM Staff (for context/schedule); Aquarium and Prayer Request (no content found)
- **Messages boards searched:** 02_Production message board (1 message: GSR testimonials)
- **Vault inspected:** THD Scripts vault (9668067133), metadata only — 82 documents listed; 6 read in full
- **Documents inspected:** 6 full reads (Hornbill, Woodpecker, Ark Map, Leadwood, Removing God, Charting Seas) + 1 additional (Eyes Fixed on Things Above, confirmed NOT a THD — parent vault is GSR Monologues)
- **Items passed authenticity filter:** 2 of 6 inspected
- **Voice-sample files written:** 2 (thd_01_leadwood-jackalberry.md, thd_02_removing-god-from-equation.md)
- **Basecamp WRITE commands run:** ZERO. No todo, done, comment, message, card, attach, upload, config set, or auth changes were executed.
- **Git commits:** ZERO.
- **Writes to overrides/ or reconcile.py runs:** ZERO.
