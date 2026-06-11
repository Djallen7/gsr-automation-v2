---
description: Show the current GSR work lanes and their status (read-only overview).
---

Read `docs/_handoff/lanes.json` (or `docs/_handoff/LANES.md` if the json is missing) and give a concise, scannable overview of every lane. For each: name, status, a one-line summary, the count of remaining to_finish items, and what it is blocked on. Group by status in this order: in_progress, open, blocked, paused, done. Do NOT start any work; this is read-only. End by noting the user can run `/resume-lane` to pick one and jump in. Plain English, no em-dashes.
