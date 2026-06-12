# ADR-0004: One templated master-metadata record per episode

Date: 2026-06-04 (recorded 2026-06-08)
Status: Accepted

## Context

Episode descriptions and tags were at risk of being written per-episode by AI, which drifts in voice, burns API cost, and is hard to keep consistent across a catalog. Daniel's actual process is templated and consistent from episode to episode.

## Decision

Each episode has a single master-metadata record, generated from a stored template filled with episode-specific fields. Descriptions and tags are templated and consistent across episodes. The only variable parts are the title hook (Daniel's call) and the chapters (derived from segment/rundown timecodes). Metadata generation is manually triggered (a button), not a per-episode AI prompt. Baked-in constants: YouTube category 28, TV airs Tuesday 8 PM CST, webstream/publish Monday 4 PM ET. Every platform draws its metadata from this one record.

## Consequences

- No per-episode AI writing for descriptions and tags; the catalog stays consistent.
- The title hook and the chapters are the only human/derived variables.
- Downstream platforms (YouTube, RLN, podcast) format from the same source, applying their own caps (for example RLN's 300-character description limit).
- This decision pairs with ADR-0006 (any AI-assisted metadata still needs human approval before publish).
