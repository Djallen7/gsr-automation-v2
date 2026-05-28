<!-- ARCHIVE: GSR Automation Reference -->
<!-- DOMAIN: workflow -->
<!-- KEYWORDS: schedule, timing, day-of-week, hour-of-day, workflow mode, planning, producing, idle, Friday, Tuesday, Wednesday, 8pm, late night, Drive patterns, Claude patterns -->
<!-- SOURCES: MONTHLY_CYCLE_REPORT.md, FINDINGS.md -->
<!-- UPDATED: 2026-05-28 -->

# GSR Workflow Patterns — Timing & Activity Reference

## Data Provenance Caveat

**May 19, 2026 security incident:** Cloud-first rebuild contaminated local filesystem timestamps. Pre-incident file dates are unreliable. Behavioral patterns below derive from 392,741 events across 7 data sources; treat pre-May-19 timestamp precision as approximate.

---

## Day-of-Week Patterns (392,741 events, 7 sources)

| Day | Drive | Claude Code | Claude Web | iMessage | Notes |
|---|---|---|---|---|---|
| Monday | — | — | — | ~3,200 | Ramp-up |
| **Tuesday** | **12,459** | — | **3,797** | ~3,400 | Production day — planning via Claude Web peaks |
| **Wednesday** | **14,174** | — | — | ~3,800 | Production peak — heaviest Drive editing |
| **Thursday** | **12,819** | **5,388** | — | ~3,500 | Production + code build overlap |
| **Friday** | — | **6,105** | — | ~3,200 | Code built end of week — Claude Code peak |
| Saturday | — | — | — | ~2,800 | Trailing off |
| **Sunday** | **432** | — | lowest | ~2,800 | **True day off** — lowest Drive and Claude Web |

**Key reads:**
- Production (Drive editing) happens Tue–Thu.
- Claude Code usage peaks Fri, with secondary Thu — code is built after production, not during.
- Claude Web (planning/conversation) peaks Tue — planning happens on production days.
- iMessage traffic is flat across the week (2,800–3,800/day) — communication is work-cycle-independent.
- Sunday is the confirmed rest day.

---

## Hour-of-Day Patterns

### Overall Activity (mac_apt behavioral sources)

| Period | Detail |
|---|---|
| **Peak hour** | **20:00 (8 PM) — 6,559 events** |
| Active band | 14:00–01:00 |
| Dead zone | 09:00–11:00 AM |
| Late-night regular | Routinely works 01:00–03:00 AM |

### Drive Editing Hour

| Period | Events |
|---|---|
| **Peak** | **17:00 (5 PM) — 13,731 events** |
| Concentrated band | 17:00–19:00 |

**Interpretation:** Drive editing (episode production) runs 5–7 PM; general computer work extends through the evening to 8 PM peak and beyond into late night.

---

## Workflow Mode Distribution (60-day window, hourly resolution)

| Mode | Hours | % |
|---|---|---|
| idle | 393 | 39% |
| planning / AI-dominant | 263 | 26% |
| producing / Drive-dominant | 227 | 23% |
| mixed | 45 | 4% |
| batch (filesystem dump) | 20 | 2% |
| transcribing | 19 | 2% |

**Key reads:**
- Nearly a quarter of all computer hours are Drive-dominant production work.
- Planning/AI use accounts for over a quarter — Claude is a constant working partner, not an occasional tool.
- Idle at 39% includes sleep and genuine rest time; the machine is on but unattended.
- Transcribing (19 hrs / 2%) is a discrete workflow, likely tied to episode prep.

---

## Working Session Intensity (last 14 days from May 23 analysis)

- During intense build periods: **12–23 hours of computer-touching per day**.
- May 19 onward: sustained high-intensity recovery + rebuild mode following the security incident.

---

## Weekly Production Cycle (inferred)

```
Mon        Tue           Wed           Thu           Fri          Sat/Sun
Ramp-up    Plan/Shoot    Drive peak    Drive+Code    Code/Ship    Off (Sun=rest)
           Claude Web↑   14k Drive     12k Drive     Claude↑
                         events        5k Claude
```

---

## Download / File Ingestion Pattern

| Source | Volume |
|---|---|
| iMessage | 1,826 messages (dominant) |
| Chrome downloads | 108 |
| AirDrop | — |
| Safari | — |
| Homebrew | — |

Files arrive primarily through iMessage, not the browser. Browser downloads are secondary.
