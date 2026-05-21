# GSR Production Hub UI Bible
**Version:** 0.1 — Concept Draft  
**Status:** Not in stone — working document for mockup and evaluation  
**Last updated:** 2026-05-21

---

## The Core Idea

One Notion workspace. One API. Three role-optimized frontends.

Every person sees exactly what they need to do their job. Nobody sees what they don't need. The underlying data is shared, so there's no sync problem, no duplication, no drift between systems.

This is a well-established pattern (Airtable Interface Designer, Frame.io, Coda, Retool all do this). The novelty here is building it custom so it fits GSR's actual workflow instead of adapting to someone else's tool.

---

## Architecture Decision: One Workspace, Three Views

**Do NOT create 3 separate Notion workspaces.**

Three workspaces = three copies of data that need to stay in sync. The moment someone adds an episode in workspace A, it doesn't exist in workspaces B and C until you write sync logic. That sync logic breaks. Now you have drift. Drift causes mistakes on air.

**The right structure:**

```
Notion Workspace (single source of truth)
├── Episodes DB
├── Guests DB
├── Tasks DB
├── Assets DB
├── Graphics Tracking DB
├── Drive Files DB
└── ADRs DB
         │
         │  Notion API
         │
    ┌────┴─────────────────────────────┐
    │                                  │
  Frontend App (1 codebase)            │
    │                                  │
    ├── /daniel  → Pre-Production Hub  │
    ├── /isaac   → Graphics + Post Hub │
    └── /miriam  → Social/Upload Hub   │
```

One codebase. Role-based routing on login. All three views pull from the same Notion API calls, just filtered and arranged differently for each person.

**Maintenance reality:** Adding a new database field means it's available to all three views automatically. You're not maintaining three separate data layers — just three arrangements of the same components. This is not significantly more work than maintaining one UI.

---

## The Three Personas

### Daniel — Pre-Production Hub
**Role:** Executive Producer / Host  
**Primary work zone:** Pre-production (research, guests, episode planning)  
**Secondary access:** Can navigate to post-production pages, but doesn't start there  

**What he needs on his home screen:**
- Inbox panel — consolidated view of things that have arrived (new tasks assigned, guest responses, flagged items)
- Urgency tracker — what needs attention now vs this week, ranked by production urgency
- Rolling daily todo list — today's items only by default, click through to see full week; syncs with Apple Notes Monday checklist
- Episode pipeline — quick overview of where all active episodes sit in the production process

**What he does NOT need front and center:**
- Graphics tracking (can access it, but it's not his primary tool)
- Thumbnail status grid
- Post-production editing cards

**Open question:** How busy is too busy? Daniel's mockups have historically felt overwhelming. The design principle here should be *progressive disclosure* — surface only what requires attention, hide what's just informational until asked.

---

### Isaac — Graphics + Post-Production Hub
**Role:** Graphics Editor + Post-Production Editor  
**Primary work zones:** TWO distinct modes
1. Pre-production: editing graphics, lower thirds (uses Graphics Tracker heavily)
2. Post-production: editing recorded shows, getting them ready to air

**What he needs on his home screen:**
- Episode editing pipeline — card-based kanban showing all episodes in his queue
  - Columns: In the Tank | In Editing | Color/Audio | Ready to Air
  - Always 2–5 episodes in tank, 2–3 actively in editing
- Graphics Tracker — quick access, always one click away from home
- Status indicators on each episode card showing which elements are done (graphics loaded, lower thirds, title card, etc.)

**Design principle:** Cards over lists. Isaac is managing multiple episodes simultaneously, so spatial layout (kanban) helps him see the full picture at a glance without reading rows.

---

### Miriam — Social / Upload Hub
**Role:** Social Media, Uploads, YouTube/Platform Publishing  
**Primary work zone:** Post-production delivery  
**What she never needs to see:** Pre-production planning, guest research, episode scripts, production scheduling

**What she needs on her home screen:**
- Episode queue — list of episodes with clear status: Is it ready for me? Has Jakob made the thumbnail? Is the transcript there?
- Thumbnail status — visual grid showing thumbnail made / pending / needs approval; Jakob's name is the trigger
- Metadata panel — for each episode: title, description, tags, thumbnail, captions — everything needed to publish
- Transcript access — per episode, for captions and social copy
- Isaac's status sidebar — narrow panel showing where Isaac is in the editing process for each episode so she knows when something is about to land in her queue

**Design principle:** Miriam's view is a *queue with status indicators*. She shouldn't have to ask anyone "is this ready?" — the UI should tell her.

---

## Shared Design Language

Regardless of which hub, these principles apply across all three:

| Principle | Why |
|-----------|-----|
| Dark mode | Production tools are dark. Eyes spend long hours here. |
| Status colors consistent across all views | Same color = same meaning everywhere: green = done, yellow = in progress, red = urgent/blocked, gray = not started |
| One primary action per screen | Each view has one thing that's "do this next." Don't make anyone hunt. |
| Mobile-accessible | Daniel especially will check this on his phone |
| No login complexity | Simple role routing on first load, not a full auth system for v1 |

---

## UI Layout Concepts (to be validated in mockups)

### Daniel — Home Screen Layout Concept

```
┌─────────────────────────────────────────────────────────────┐
│ GSR PRODUCTION HUB                              [Daniel ▾]  │
├──────────┬──────────────────────────────────┬───────────────┤
│          │  TODAY'S FOCUS                   │               │
│  NAV     │  ┌─────────────────────────┐    │  INBOX        │
│          │  │ ☐ Confirm S03E028 guest │    │               │
│  Home    │  │ ☐ Review show outline   │    │  3 new items  │
│  Episodes│  │ ☐ Approve graphics EP25 │    │  ───────────  │
│  Guests  │  └─────────────────────────┘    │  • Task from  │
│  Tasks   │  [See full week →]              │    Isaac      │
│  Assets  │                                  │  • Guest reply│
│          │  NEEDS ATTENTION                 │  • Flag on    │
│  ──────  │  ┌──────────────────────────┐   │    EP022 art  │
│          │  │ 🔴 EP023 guest not conf. │   │               │
│  Isaac's │  │ 🟡 EP025 script overdue  │   │               │
│  Hub     │  │ 🟡 Graphics EP021 3 left │   │               │
│  Miriam's│  └──────────────────────────┘   │               │
│  Hub     │                                  │               │
│          │  EPISODE PIPELINE                │               │
│          │  EP021 ████████░░ 80%  Editing   │               │
│          │  EP022 ████░░░░░░ 40%  Pre-prod  │               │
│          │  EP023 ██░░░░░░░░ 20%  Research  │               │
└──────────┴──────────────────────────────────┴───────────────┘
```

---

### Isaac — Home Screen Layout Concept

```
┌─────────────────────────────────────────────────────────────┐
│ GSR PRODUCTION HUB                               [Isaac ▾]  │
├──────────┬──────────────────────────────────────────────────┤
│          │  EDITING PIPELINE                                 │
│  NAV     │                                                   │
│          │  IN TANK        IN EDITING      READY TO AIR     │
│  Home    │  ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  Graphics│  │ EP026    │   │ EP023    │   │ EP021    │    │
│  Tracker │  │ ░ Record │   │ ▓ Cut    │   │ ✓ Done   │    │
│          │  │ ░ Graphics│  │ ▓ Audio  │   └──────────┘    │
│  ──────  │  └──────────┘   │ ░ Color  │                    │
│          │  ┌──────────┐   │ ░ Review │   ┌──────────┐    │
│  Episodes│  │ EP027    │   └──────────┘   │ EP022    │    │
│          │  │ ░ Record │   ┌──────────┐   │ ▓ Review │    │
│          │  └──────────┘   │ EP024    │   └──────────┘    │
│          │                  │ ▓ Cut    │                    │
│          │  ──────────────  └──────────┘                    │
│          │  GRAPHICS TRACKER — EP021 Show 1                 │
│          │  ┌───────────────────────────────────────────┐   │
│          │  │ Opening Monologue  12/20 loaded  [Open →] │   │
│          │  └───────────────────────────────────────────┘   │
└──────────┴──────────────────────────────────────────────────┘
```

---

### Miriam — Home Screen Layout Concept

```
┌─────────────────────────────────────────────────────────────┐
│ GSR PRODUCTION HUB                              [Miriam ▾]  │
├──────────┬────────────────────────────┬────────────────────-┤
│          │  READY TO PUBLISH          │  ISAAC'S STATUS     │
│  NAV     │                            │                     │
│          │  EP021                     │  EP021  ✓ Done      │
│  Home    │  ✓ Transcript              │  EP022  ▓ Audio     │
│  Episodes│  ✓ Thumbnail (Jakob)       │  EP023  ▓ Cutting   │
│  Upload  │  ✓ Metadata complete       │  EP024  ░ Not yet   │
│  Social  │  [Publish →]               │                     │
│          │                            │                     │
│          │  NEEDS ACTION              │                     │
│          │  EP022                     │                     │
│          │  ✓ Transcript              │                     │
│          │  ✗ Thumbnail (pending)     │                     │
│          │  ▓ Metadata 80%            │                     │
│          │  [Continue →]              │                     │
│          │                            │                     │
│          │  COMING UP                 │                     │
│          │  EP023  ░ Isaac editing    │                     │
│          │  EP024  ░ Not yet          │                     │
└──────────┴────────────────────────────┴─────────────────────┘
```

---

## Open Questions (to resolve in mockup phase)

| Question | Options | Not yet decided |
|----------|---------|-----------------|
| Is this one app with role routing, or three separate deployed apps? | One app (easier to maintain) vs three (cleaner URLs, can deploy independently) | Open |
| Apple Notes sync for Daniel's todos — real-time API or manual export? | Apple Reminders has a URL scheme; could use Shortcuts automation | Open |
| What framework? | Next.js + Tailwind (recommended for Notion API), or something simpler | Open |
| Authentication for v1 | No auth (just bookmarked URLs per role) vs simple password per role | Open |
| Mobile priority | Daniel's view mobile-first? Others desktop-only for v1? | Open |
| Graphics Tracker — inline on Isaac's hub or always separate page? | Isaac wants it one click away, not embedded | Leaning separate |
| Does Miriam need edit access or read-only? | She needs to mark things as uploaded/scheduled | Needs edit on specific fields |

---

## What's NOT in This Bible Yet

- Specific episode page layouts (what does a single episode look like when you click into it?)
- Guest database view for Daniel
- Social scheduling workflow for Miriam
- How notifications/inbox items are generated and cleared
- Mobile layout specifics
- The actual metadata structure for Miriam's publishing panel
- Whether the "Claude Cache" tab data from Graphics Tracking migrates or stays in Sheets

---

## Research Findings (2026-05-21)

### Precedents — This Pattern Is Well-Established

**Frame.io V4** is the clearest production industry reference. One underlying asset database, role-aware display layer. Producers see status and review states; editors see technical metadata; clients see a stripped-down review view. Their V4 redesign explicitly built a metadata framework that controls which fields surface per role — the data model is flat, the display is role-aware. This is exactly the architecture being proposed here.

**ftrack Studio / ShotGrid (Autodesk Flow)** are the production-native implementations at larger scale. Same shot/episode data surfaced in role-specific dashboards: producer sees schedule summaries, supervisor sees review queues, artist sees only their assigned tasks. This is the reference for Isaac's editing pipeline view.

**Airtable Interface Designer** is the accessible general-purpose version: one base, multiple interfaces. The main limitation is write interactions still push users back to the grid — which is why building custom (React/Next.js) is worth it for a team that will live in this tool every day.

### Architecture: Single Workspace Confirmed

Research confirmed: **do not create 3 separate Notion workspaces.** Multiple workspaces at small scale create sync nightmares and have no cross-workspace search. The correct approach is one Notion workspace with Teamspaces handling permission separation.

Notion's own guidance says: use the fewest workspaces possible. The role separation happening here is a view problem, not a workspace architecture problem.

### Dashboard Design: Three-Zone Pattern

The validated pattern for a coordinator home screen (Daniel's hub) is three distinct zones:
1. **Inbox** — reactive items requiring a decision, each with a clear action verb
2. **Priority/urgency tracker** — 5–9 items max, ranked by deadline/escalation; color for urgency only, not categories
3. **Committed todos** — today's tasks, separate from inbox; inbox = reactive, todos = committed

Keep these zones separate. Mixing inbox and todos into one list is the most common reason dashboards feel overwhelming. The two serve different cognitive modes.

Linear.app (software but widely used in production-adjacent teams) is the clearest UI implementation of this pattern.

### Isaac's View: Kanban With Age Indicators

Research confirmed kanban (horizontal pipeline board) as the right pattern for multi-episode editing tracking. Key findings:
- Cards should show: episode name, assigned editor, due date, status — nothing more. Dense cards cause cognitive overload.
- **Age indicators** (how long a card has sat in a column) are more useful than priority labels for editors — they surface stuck work without manual tagging. This is already in the wireframe.
- Swimlanes by series if the editor ever works across multiple shows simultaneously.

### Performance: Not a Concern at This Scale

At under 1,000 rows and 3 users, role-based UI complexity has no measurable impact on load times. The research is unambiguous:
- At sub-1,000 rows, everything can load client-side on first fetch, filtered in memory
- Conditional rendering (showing/hiding components by role) is a boolean check, not a network call
- Performance risks at this scale come from unoptimized asset/image handling, not from the role logic

The 2024 Core Web Vitals shift to INP (Interaction to Next Paint) means responsiveness is the metric to watch. Role-based rendering has zero impact on INP at this scale.

**Bottom line:** Build the role-based UI you need. If loading gets slow later, the fix is API response caching and lazy image loading — not simplifying the role architecture.

### Build Order Recommendation

1. **Miriam first** — simplest, most clearly defined, delivers immediate value (she currently has no purpose-built tool)
2. **Isaac second** — well-defined workflow, editing pipeline is a known pattern
3. **Daniel last** — most complex (inbox + urgency + todos + Apple Notes sync), and your own preferences will evolve as you watch the others work

Each hub is usable independently. You don't need all three before any one of them is valuable.

---

*Draft generated 2026-05-21. Research findings added same day. Everything here is a starting point, not a commitment.*
