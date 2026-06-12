# The brain-dump method — PROPOSED 2026-06-12, awaiting Daniel's go

Daniel's condition for investing months of daily input: a method he and Claude both
agree will actually get Claude to a competent, reliable, trustworthy production
assistant, without his communication style (long ADHD rambles, apparent
self-contradictions) poisoning the records. This is that method. It is designed so
that HIS burden never grows (just talk, any time, any shape) and the discipline burden
sits entirely on Claude.

## The pieces

1. **The journal** (`docs/_handoff/PRODUCER-JOURNAL.md`): every dump lands raw, dated,
   append-only. Nothing he says is ever lost or paraphrased away. Interpretation is a
   separate step recorded UNDER the raw entry, never instead of it.

2. **The working picture, in three layers.** Extracted items are tagged:
   - ALWAYS: stable facts (who owns what, hard rules, dates that are set)
   - USUALLY: habits and patterns (what he tends to do, in what order, when)
   - NOW: the current state of actual tasks this week/month
   Every item carries a receipt: the date and his underlying words. The picture is
   inspectable; nothing in it is "Claude remembers."

3. **Contradictions are data.** A new statement that conflicts with an old one gets
   flagged as a CONFLICT pair, both kept, both dated. Plain facts resolve by recency
   (his latest word wins, per canon). Routines and orderings that conflict usually
   mean "it depends on something" and stay open until the dependency shows itself
   across entries, or until the conflict blocks real work, and only then does it
   become ONE question to him. Apparent self-contradiction is treated as a clue about
   conditions, never as an error to argue with him about.

4. **Echo receipts.** After every dump, Claude replies with at most 5 lines: what was
   logged, what changed, what now conflicts. He glances; a one-line correction is
   itself a journal entry. This is how he watches the system learn, which is where
   the trust comes from.

5. **Never asked twice.** Anything the journal answers is never re-asked. Questions
   are rationed: only when a held-open conflict actually blocks work, and one at a
   time.

6. **Loss-proof capture.** Today's lost dictation cannot happen again: he dictates
   into a pinned note on his phone (autosaves continuously, survives calls), and sends
   or pastes it whenever convenient; multiple short sends are equally fine. Later, the
   Mac watches that note and ingests it automatically (same pattern as the existing
   transcription watcher), so eventually "send" stops being a step at all.

7. **Any session works.** The journal and picture live in the repo, so no session
   dependence. On Daniel's go, a `/braindump` command gets added so any session
   handles a dump by these exact rules: append raw, extract, flag conflicts, echo
   receipt, commit, push.

## What runs in parallel (the early return)

He does not actually face two months of zero return. The crew tracks (Isaac, Myriam,
the intern: post-production, graphics tracking, distribution phases) automate against
information that exists on paper (Graphics Tracker sheet, Rundown Creator, the
distribution registry, export artifacts), not against anyone's head. Those build now
and pay out early, while his own model grows the slow honest way through the journal.
The month map drafts with the crew tracks filled in confidently from paper sources and
Daniel's tracks sketched as UNVERIFIED, then the journal corrects and fills his side
over the months.

## Ramp expectations (honest)

- Week 1-2: the picture forms; receipts will need corrections, that is the process.
- Month 1: USUALLY-layer patterns start emerging; questions get rarer.
- The trust test is simple: when his corrections to the echo receipts approach zero,
  the priority lists he could not trust before become trustworthy, because every line
  in them carries a receipt he can check.

## Status

PROPOSED. Activates on Daniel's go (or adjusts on his pushback). First live test: his
next rant. The journal is already open with today's recovered fragment as Entry 1.
