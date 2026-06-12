# GSR Weekly Segment Publishing Schedule

Date: 2026-06-08
Status: Research / inference. Read-only. No code or production touched.
Scope: Genesis Science Report (GSR), David Rives Ministries / Genesis Science Network.

## Why this doc exists

GSR airs as a full ~58 min episode (Tuesday 8pm Central on the GSN linear channel) and a full-episode
webstream publishes around Monday 4pm ET. Separately, GSR chops the show into individual SEGMENTS
(Kids Corner, Genesis Science Q&A, The Heavens Declare, Genesis Science Minute, interviews, Ministry
Report, Viewer Voices, Featured Resource) and drips them out across the week. Daniel wanted the
per-segment weekly cadence pinned down.

Important up front: the repo itself says this cadence is NOT documented and must be inferred.
The handoff (`gsr-blueprint/docs/2026-06-03-gsr-handoff.md`, line 137) states: "THD/GSM segments post
on an irregular schedule. Infer the real pattern by sampling the last 5 of each segment type on the
YouTube channel, not by assuming a weekly slot." So the day-by-day below is OBSERVED from live YouTube
upload timestamps, not a documented internal schedule.

## What the repo confirms (CONFIRMED)

From `gsr-automation-v2/config/production.json` and `docs/_handoff/GSR-WORKFLOW-CANON.md`:

- Full episode airs Tuesday, 20:00 (8pm) Central. (`air_day`, `air_time_cst`)
- Full-episode YouTube publish: Monday, 16:00 (4pm) ET, scheduled. (`youtube_publish_day`,
  `youtube.upload_schedule`)
- The repo lists segment TYPES but assigns NO publish day to any individual segment. The 15-segment
  run-of-show is an episode-structure list, not a posting calendar.
- Pre-produced roll-in segments (made ahead, dropped into the episode): The Heavens Declare, Kids
  Corner, Q&A, Genesis Science Minute, Featured Resource (owned by Jakob; Gabe does GSM roll-ins).
- Genesis Science Minute is, separately, a ~60-second radio short distributed to Christian radio
  stations, not primarily a YouTube weekly post. That is why it barely shows on the channel.

## What the live YouTube channel shows (OBSERVED)

Source: David Rives Ministries YouTube uploads RSS feed
(`youtube.com/feeds/videos.xml?channel_id=UCNZS3IEQaAfwofwltbEBwuw`), most recent 15 uploads,
2026-05-16 through 2026-06-05. Timestamps converted from UTC to ET (EDT, UTC-4 in June).

Raw sample (title | day | ET time):

- 2026-06-05 | Fri | 11:00am | "Slinky the Lizard | Kids Corner"
- 2026-06-03 | Wed | 7:00pm | "Evidence of a Global Flood?" (untagged science short)
- 2026-06-03 | Wed | 11:00am | "How Far Are We from the Moon? | Genesis Science Q&A"
- 2026-06-02 | Tue | 5:00pm | "The Remarkable Woodpecker | The Heavens Declare"
- 2026-06-01 | Mon | 4:00pm | "Back to the Moon... | Genesis Science Report S03 Ep16" (FULL EPISODE)
- 2026-05-29 | Fri | 11:00am | "Coins in the Bible | Kids Corner"
- 2026-05-28 | Thu | 7:15pm | "C14 in Dino Bones Proves Bible??" (untagged science short)
- 2026-05-27 | Wed | 11:00am | "Why Do We Dream | Genesis Science Q&A"
- 2026-05-25 | Mon | 4:00pm | "The Smithsonian's Missing Evidence... S03 Ep15" (FULL EPISODE)
- 2026-05-22 | Thu | 3:30pm | "Soft Tissue in T-Rex Bones??" (untagged science short)
- 2026-05-22 | Fri | 11:00am | "William Tyndale... | Kids Corner"
- 2026-05-20 | Wed | 11:00am | "How Many Planets... | Genesis Science Q&A"
- 2026-05-19 | Mon | 12:08pm | "How a Tackle Box of Fossils... | Kids Corner" (off-pattern)
- 2026-05-18 | Mon | 4:00pm | "Scientists Can't Copy the Human Body... GSR S03 Ep14" (FULL EPISODE)
- 2026-05-16 | Sat | 8:00am | "God Created You for a Special Purpose" (devotional short)

## The inferred weekly schedule

Each row is marked CONFIRMED (repo), OBSERVED (YouTube activity, with confidence), or UNKNOWN.
All times ET unless noted. "Webstream targets" = beyond YouTube (see Platforms section).

| Day | What publishes | Approx time (ET) | Confidence |
|---|---|---|---|
| Monday | Full GSR episode (webstream / YouTube) | 4:00pm | CONFIRMED (repo) + OBSERVED 3 of 3 weeks exactly at Mon 4pm |
| Tuesday | Full GSR episode airs on GSN linear channel, 8pm Central | 8:00pm CT | CONFIRMED (repo + GSR site) |
| Tuesday | The Heavens Declare (segment clip) | ~5:00pm | OBSERVED, low-to-medium confidence (1 clear instance at Tue 5pm; THD posts irregularly per repo) |
| Wednesday | Genesis Science Q&A (segment clip) | 11:00am | OBSERVED, HIGH confidence (3 of 3 weeks, Wed 11am) |
| Wednesday/Thursday | One untagged science short (THD- or GSM-style) | evening (~3:30-7:15pm) | OBSERVED, medium confidence (3 of 3 weeks, but day floats Wed/Thu and title is untagged) |
| Friday | Kids Corner (segment clip) | 11:00am | OBSERVED, HIGH confidence (3 of 3 weeks, Fri 11am; one extra Kids Corner also slipped out on a Monday) |
| Saturday | Devotional / inspirational short (not a GSR segment) | morning | OBSERVED, low confidence (1 instance; not one of the named GSR segments) |
| Any day | Genesis Science Minute as a standalone YouTube post | n/a | UNKNOWN. GSM is primarily a 60-sec radio short; it did not appear as a distinct upload in the sampled 3 weeks |
| Unscheduled | Interview 1 / Interview 2 as standalone clips | n/a | UNKNOWN. No standalone interview clips in the sample |
| Unscheduled | Ministry Report | n/a | UNKNOWN. Appears inside the episode/podcast; no standalone YouTube post observed |
| Unscheduled | Viewer Voices | n/a | UNKNOWN. No standalone post observed |
| Unscheduled | Featured Resource | n/a | UNKNOWN. No standalone post observed |

### Plain-English summary of the observed rhythm

- Monday 4pm ET: the full episode goes live (this is the anchor, repo-confirmed).
- Wednesday 11am ET: Genesis Science Q&A clip (very consistent).
- Friday 11am ET: Kids Corner clip (very consistent).
- A Tuesday-or-midweek evening science short (The Heavens Declare style) most weeks, but the day and
  the labeling are not consistent.
- Occasional Saturday devotional that is not a GSR segment.

So the reliable, repeatable YouTube cadence is three drops a week: full episode Monday, Q&A Wednesday,
Kids Corner Friday. Everything else is irregular.

## Platforms (it is not just YouTube)

The full episode and segments flow to multiple targets. Per `config/production.json` and
`GSR-WORKFLOW-CANON.md` section 11 (the established distribution stack):

- YouTube: the anchor and canonical URL; full episode Mon 4pm ET, plus the segment clips above.
- GSN (Genesis Science Network): 24/7 linear OTT / on-demand web stream. GSR airs DAILY on the linear
  channel at 7:00am and 8:00pm Central (per the public GSN schedule page) plus on-demand. This linear
  schedule is separate from the YouTube drop cadence above.
- StreamHoster: FTPS upload that feeds Roku, Apple TV, iOS app, LG TV.
- Real Life Network (= RightNow Media): delivered via Signiant Media Shuttle.
- Dropbox: broadcast master to network-partner stations; also the source for OTA broadcast.
- Rumble: full episode (manual / YouTube-sync, currently fragile).
- Fireside podcast (audio): the GSR podcast feed, which also carries the Ministry Report / Featured
  Resource / GSM segments as audio; feeds Apple Podcasts and Spotify via RSS.
- Social clips (YouTube Shorts, Instagram, TikTok, Facebook, X): short-form, tracked separately.
- Deferred but real targets in the canon: GodTube (now retired), OTA (fed from Dropbox), TBN c21c
  archive, CTN (Creation TV Network), WWN (Wonders Without Number).

Note: the segment-clip cadence in the table above was measured on YouTube only. Whether the same
per-segment drops mirror to Rumble, Facebook, Instagram, etc., and on what timing, was NOT determined
from this research.

## Reconciliation: repo vs observed

- AGREE (state with confidence): Full episode publishes Monday 4pm ET. Repo says it, and YouTube shows
  it exactly, 3 of 3 weeks. CONFIRMED.
- AGREE: Tuesday 8pm Central is the air slot. Repo + GSR website + GSN schedule all agree. CONFIRMED.
- AGREE: per-segment cadence is irregular and undocumented. The handoff predicted this; the data
  confirms it for everything except the strong Wed-Q&A / Fri-Kids-Corner pattern that emerged.
- NEW (not in repo): the Wednesday 11am Q&A and Friday 11am Kids Corner weekly slots are a real,
  consistent pattern the repo does not record. Worth confirming with Daniel and capturing in the canon.
- CANNOT DETERMINE from data: standalone publish days for Genesis Science Minute, The Heavens Declare
  (day floats), interviews, Ministry Report, Viewer Voices, Featured Resource.

## Open questions for Daniel (needs your confirmation)

1. Are Wednesday 11am (Q&A) and Friday 11am (Kids Corner) intentional fixed slots, or just how it
   happened to land the last 3 weeks?
2. What day/time does The Heavens Declare post as a standalone clip? Observed once on a Tuesday but
   the repo calls it irregular.
3. Do Genesis Science Minute, Ministry Report, Viewer Voices, and Featured Resource ever post as
   standalone YouTube clips, or only inside the full episode / podcast feed? If standalone, which days?
4. Are interview segments ever clipped out and posted separately, and when?
5. What were the untagged midweek science shorts ("Evidence of a Global Flood?", "C14 in Dino Bones",
   "Soft Tissue in T-Rex Bones??") - THD, GSM, or a separate short-form line? They post Wed/Thu evening
   most weeks.
6. Do the segment clips also go to Rumble / Facebook / Instagram / TikTok, and on the same schedule?

## Method notes and limits

- Strongest evidence is the YouTube uploads RSS feed (structured, timestamped). It returns only the
  last 15 uploads, so the day-of-week pattern rests on a 3-week window. A longer sample (YouTube Data
  API `search.list`, which the repo already plans to use) would firm up or correct the lower-confidence
  rows, especially THD, GSM, and the untagged shorts.
- Direct scrapes of the YouTube channel pages and playlist returned only page chrome (no titles/dates),
  so they were not usable; the RSS feed was the reliable source.
- Times are converted UTC to ET assuming EDT (UTC-4) for June 2026. The GSN linear schedule is stated
  in Central Time on the source page.

## Sources

- gsr-automation-v2/config/production.json
- gsr-automation-v2/docs/_handoff/GSR-WORKFLOW-CANON.md
- gsr-blueprint/docs/2026-06-03-gsr-handoff.md (line 137, posting-cadence note)
- YouTube uploads RSS: youtube.com/feeds/videos.xml?channel_id=UCNZS3IEQaAfwofwltbEBwuw
- GSN schedule: genesissciencenetwork.com/gsn-schedule/
- GSR show page: davidrivesministries.org/gsr/
