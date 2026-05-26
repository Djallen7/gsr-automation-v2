# GSR Hub UI Bible: Design Foundation for Christian Science TV Production Hub

**For:** Daniel/Mae (Producer)  
**Purpose:** Foundational reference for building role-based production hub UIs  
**Stack:** Next.js + Notion data layer + Liquid Glass aesthetic  
**Date:** May 2026

---

## Executive Summary: What You're Building

You're creating three role-based frontend UIs—Producer (pre-production), Myriam (post/social/uploads), Isaac (graphics/editing)—all pulling from the same Notion workspace. The goal: "gorgeous Apple frontend without sacrificing effectiveness of a boring dashboard."

**Core Design Direction:**
- Apple Liquid Glass aesthetic (matches your logo)
- Subtle background motion
- Dynamic animations and information reveals
- Mobile-friendly but desktop-primary
- "Steal the show" visually while remaining functional

**Key Finding from Research:** The most successful production tools balance clean, intuitive interfaces for casual users with deep, keyboard-driven power-user capabilities—all delivered through web-first, mobile-responsive architectures with embedded AI assistance.

---

## 1. Apple Liquid Glass Design Language (2025-2026)

### What It Is

Liquid Glass is Apple's unified design language announced at WWDC 2025, representing their most significant design evolution since iOS 7's flat design. It's a **dynamic, translucent material system** that mimics real glass through transparency, depth, lensing, and fluid motion.

**Core Principles:**

**Lensing**: Dynamic bending and concentration of light that distorts background content, creating separation while letting content shine through.

**Fluidity**: Gel-like flexibility—elements morph between states, materialize/dematerialize through light bending modulation.

**Adaptivity**: Material changes based on context—shadows become prominent over text, tint shifts to maintain legibility, switches between light/dark independently.

**Content Priority**: Controls float above content in distinct functional layer. Content always leads; UI visually recedes. Never glass-on-glass stacking.

**Material Composition** (Multi-Layer System):
- Highlights Layer (light sources responding to geometry/motion)
- Shadow Layer (dynamic opacity based on background)
- Glow/Interaction Layer (illumination during touch)
- Tint Layer (tones mapped to content brightness)
- Lensing/Refraction Layer (real-time light bending)

### Technical Implementation on Web

**Primary Method: CSS backdrop-filter**

```css
.glass-card {
  /* Semi-transparent background */
  background: rgba(255, 255, 255, 0.1);
  
  /* Core property */
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  
  /* Border for definition */
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  /* Depth shadow */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  border-radius: 16px;
}
```

**Browser Support:** 97%+ (Chrome 76+, Safari 9+, Firefox 103+, Edge 79+)

**Recommended Values for Production Hub:**
- Small elements (buttons): 8-12px blur
- Medium elements (cards): 12-16px blur  
- Large elements (modals): 16-24px blur
- Navigation bars: 20-30px blur
- Background opacity: 0.1-0.2 (dark backgrounds)

### React/Next.js Libraries That Nail This

**Primary Recommendation: @mawtech/glass-ui**
- 18 production-ready components
- Apple macOS/visionOS inspired
- Dark mode optimized
- Full TypeScript support
- Framer Motion animations built-in
- Tree-shakeable

```jsx
import { GlassCard, GlassButton } from '@mawtech/glass-ui';
import '@mawtech/glass-ui/styles.css';

function ProducerDashboard() {
  return (
    <GlassCard variant="glow" padding="lg">
      <h2>Episode Status</h2>
      <GlassButton variant="aurora">Review Cut</GlassButton>
    </GlassCard>
  );
}
```

**Alternative: @yhooi2/shadcn-glass-ui**
- 48 components (more comprehensive)
- 3 themes: Glass (dark), Light, Aurora (gradient glow)
- WCAG 2.1 AA compliant
- 704 tests (extremely reliable)
- React 19 + Tailwind v4 compatible

**For Simple Cases: TailwindCSS + Custom Config**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '8px',
        DEFAULT: '12px',
        md: '16px',
        lg: '24px',
        xl: '40px',
      },
    },
  },
};
```

### When to Use Liquid Glass

**✅ Perfect for:**
- Navigation layers (navbars, sidebars)
- Floating controls and toolbars
- Modal overlays and dialogs
- Cards over media-rich backgrounds (perfect for video thumbnails)
- Notifications and alerts

**❌ Avoid for:**
- Content areas (tables, article text)
- Glass on glass (stacking glass elements)
- Small text without adequate contrast
- Rapidly updating content (performance issues)

### Accessibility Requirements

- Maintain WCAG 2.1 AA contrast ratios (4.5:1 for text)
- Support `prefers-reduced-motion`
- Support `prefers-reduced-transparency`
- Add text-shadow for legibility when needed
- Ensure keyboard focus is visible on glass elements

---

## 2. Role-Based UI Patterns for Creative Teams

### The Three-Tier Permission Model

This is the winning pattern from Linear, Frame.io, Notion, and others:

```
Organization/Workspace Level → Team/Project Level → Resource Level
```

**For Your Hub:**
- **Workspace Level**: All three roles (Producer, Myriam, Isaac) access same Notion workspace
- **Team/Project Level**: Each role sees different "home" dashboard
- **Resource Level**: Specific episodes/assets have granular permissions

### Different Home Pages for Different Roles

**Pattern 1: Role-Specific Dashboards (Recommended for Your Hub)**

**Producer Dashboard:**
- Active Projects (with status overview)
- Pending Reviews (assets needing attention)
- Recent Activity (across all projects)
- Team Capacity (who's working on what)

**Myriam Dashboard (Post/Social):**
- In Progress Assets (assigned to me)
- Feedback Needed (assets with unresolved comments)
- Approved Assets (ready for upload)
- Social Media Queue
- Upload Status Panel

**Isaac Dashboard (Graphics/Editing):**
- Active Edit Projects
- Graphics Requests
- Assets Needing Graphics
- Render Queue Status
- Recent Uploads

**Implementation:** Use Next.js route guards with role detection:

```jsx
// app/dashboard/page.tsx
export default function Dashboard() {
  const { user } = useAuth();
  
  if (user.role === 'producer') return <ProducerDashboard />;
  if (user.role === 'myriam') return <MyriamDashboard />;
  if (user.role === 'isaac') return <IsaacDashboard />;
}
```

### Cross-Role Visibility Windows

**Best Pattern: "Peek" Views into Other Roles' Work**

**From Frame.io's Model:**
- All roles see the same asset player and timeline
- Comments/annotations visible to all permitted users
- Action buttons dynamically shown/hidden based on role
- Version stack shows history regardless of who uploaded

**For Your Hub:**
- Producer can "peek" into Isaac's editing status without leaving their view
- Myriam can see when Isaac marks graphics as "ready for post"
- Isaac can see Producer's review comments inline

**UI Pattern: Status Indicators**

```jsx
// Status sidebar that shows cross-role progress
<GlassSidebar>
  <StatusPanel>
    <h3>Where Isaac is</h3>
    <ProgressRing value={75} />
    <Status>Editing Episode 3 - 75% complete</Status>
  </StatusPanel>
  
  <StatusPanel>
    <h3>Myriam's Queue</h3>
    <Count>3 episodes ready to upload</Count>
  </StatusPanel>
</GlassSidebar>
```

**Visual Treatment:**
- Traffic light color coding (red/yellow/green)
- Status badge with icon + text
- Hover reveals "who, when, why" details
- Click shows full history

### Navigation Pattern: Role-Adaptive

**Sidebar Structure Changes by Role:**

```
Producer Navigation:
├─ Dashboard
├─ All Episodes
├─ Calendar/Schedule
├─ Team Status
├─ Settings
└─ Reports

Myriam Navigation:
├─ Dashboard
├─ Ready to Upload
├─ Social Queue
├─ Archive
└─ Upload History

Isaac Navigation:
├─ Dashboard
├─ Active Edits
├─ Graphics Queue
├─ Asset Library
└─ Render Queue
```

**Implementation:** Single component, conditional rendering based on role.

---

## 3. Notion-as-Data-Layer Architecture

### The Reality Check

**Good News:** Using Notion as a backend for custom frontends is viable and increasingly common.

**Critical Finding:** There are two paths—hosted solutions (Super.so, Potion.so) or custom builds (react-notion-x, Next.js Starter Kit).

**For Your Use Case (Internal Tool):** Custom Next.js frontend with react-notion-x is the right choice.

### Recommended Tech Stack

**Foundation: Next.js Notion Starter Kit**
- GitHub: https://github.com/transitive-bullshit/nextjs-notion-starter-kit
- Production-ready template using react-notion-x
- Single config file setup
- Automatic social images, pretty URLs, table of contents
- Redis caching for preview images
- Next.js ISR (Incremental Static Regeneration)

**Core Library: react-notion-x**
- Fast, accurate React renderer for Notion content
- 95%+ block support (databases, collections, toggles, equations, code)
- TypeScript batteries included
- 10-100x faster than Notion itself
- 95-100 Lighthouse scores
- Lazy loading for heavy components

```jsx
import { NotionAPI } from 'notion-client'
import { NotionRenderer } from 'react-notion-x'

export default function EpisodePage({ recordMap }) {
  return (
    <NotionRenderer 
      recordMap={recordMap} 
      fullPage={true}
      darkMode={false}
      components={{
        Code,        // Syntax highlighting
        Collection,  // Database views
        Equation,    // Math rendering
      }}
    />
  );
}

export async function getStaticProps({ params }) {
  const notion = new NotionAPI()
  const recordMap = await notion.getPage(params.pageId)
  
  return {
    props: { recordMap },
    revalidate: 3600 // Rebuild every hour
  }
}
```

### Architecture Pattern

**Static Generation with ISR (Incremental Static Regeneration):**

```
┌─────────────┐
│   Notion    │ Content lives here (episodes, statuses, metadata)
└──────┬──────┘
       │ Build-time fetch
┌──────▼──────┐
│  Next.js    │ Static generation + ISR every hour
│   + react-  │ Custom role-based dashboards
│  notion-x   │
└──────┬──────┘
       │ Deploy
┌──────▼──────┐
│   Vercel    │ Serves static pages, regenerates on-demand
│   + CDN     │
└─────────────┘
```

**Why This Works:**
- Notion API rate limit: ~3 requests/second
- ISR caches aggressively, only rebuilds when needed
- Fast page loads (static HTML)
- Real-time updates via webhooks + revalidation

### Notion Webhooks (Now Available!)

**Event Types:**
- `page.content_updated`
- `page.property_updated`
- `database.schema_updated`

**Implementation:**

```jsx
// app/api/webhooks/notion/route.ts
export async function POST(req) {
  const { type, data } = await req.json()
  
  if (type === 'page.content_updated') {
    // Trigger rebuild of affected page
    await revalidatePath(`/episodes/${data.page_id}`)
  }
  
  return Response.json({ success: true })
}
```

### Performance Considerations

**Image URLs Expire:** Notion returns temporary URLs (1 hour). Solutions:
1. Download images at build time, serve from your CDN
2. Use image proxy (Cloudflare Workers)
3. Cache in public folder during builds

**Rate Limits:** 
- Implement exponential backoff with jitter
- Use caching aggressively (Redis or Next.js built-in)
- Fetch at build time, not runtime

**Database Query Limitations:**
- No JOINs across databases
- No complex relational queries
- 1000 block limit per page
- Pagination required for large datasets

### How to Avoid Feeling Like a Notion Clone

**1. Custom Typography** (Don't use Notion's default Inter):
```css
body {
  font-family: 'SF Pro Display', -apple-system, sans-serif;
}
```

**2. Custom Color System:**
Override Notion classes with your brand colors

**3. Custom Layouts:**
Don't replicate Notion's center-column. Use sidebar + main for production feel.

**4. Brand-Specific Components:**
```jsx
<NotionRenderer
  recordMap={recordMap}
  components={{
    Callout: CustomCallout,  // Your glass-style callouts
    Code: CustomCodeBlock,   // Branded code blocks
  }}
/>
```

**5. Add Custom Functionality:**
- Comments system
- Social sharing buttons
- Related content suggestions
- Custom navigation
- Analytics overlays

---

## 4. Production Tool UI Analysis: What Works and What's Broken

### Universal Patterns That Work

**1. Frame-Accurate Commenting** (Industry Standard)
- Click on video timeline → comment appears at exact frame
- Timecode stamps on all feedback
- Visual markers show annotation density
- Frame.io pioneered this; it's now expected everywhere

**For Your Hub:** Integrate Frame.io or build custom timeline comment system for Myriam's review interface.

**2. Real-Time Collaboration**
- Multiple simultaneous users
- Instant sync across devices
- Visible presence indicators
- Conflict resolution systems

**3. Progressive Disclosure**
- Simple default interface
- Advanced features in expandable panels
- Contextual menus based on selection
- Power users find keyboard shortcuts

**4. Embedded Integration**
- Panels in creative tools (Premiere, FCPX, Resolve)
- Users stay in primary workspace
- Reduce context switching
- Bidirectional updates

**StudioBinder's Task Sidebar:** Tasks appear in sidebar on EVERY page (call sheets, scheduling, breakdowns). Context-aware task creation without leaving current page.

**For Your Hub:** Consider sidebar that shows episode status regardless of which role's dashboard you're on.

### Visual Hierarchy for Production Tools

**Video Production Dashboard:**
- 60-70% video player/asset preview
- 20-30% comments sidebar (collapsible)
- 10% controls (on hover)
- Minimal chrome

**Your Hub Should:**
- **Producer View:** 40% calendar/schedule, 30% episode status cards, 20% team status, 10% tools
- **Myriam View:** 50% asset queue (cards with thumbnails), 30% upload status, 20% social scheduler
- **Isaac View:** 60% current edit preview/workspace, 25% graphics queue, 15% asset library

### What's Broken in Current Tools (Avoid These)

**Frame.io V4 Problems:**
- Redesigned UI broke familiar patterns
- Lost integrations users depended on
- Mobile app slow uploads (5-10 min for 3-sec video)
- Only 3 videos uploadable at time on mobile
- Files upload as "white background" (40% failure rate)

**Lesson:** Don't redesign working patterns. Test mobile thoroughly. Maintain backward compatibility.

**Wipster Limitations:**
- Cannot draw on video (only point comments)
- Can't attach comment to frame range
- Storage restrictions too limiting (50GB at $12/user)

**Lesson:** Frame range comments are valuable for "this entire section feels too fast" feedback.

**Generic PM Tools (Trello, Asana for Video):**
- No video-specific features (no frame-accurate review)
- No built-in time tracking
- Not designed for visual assets

**Lesson:** Use production-specific patterns. General task managers don't fit video workflows well.

### Key Success Factors

✅ **Frame-accurate everything** (comments, markers, cuts)  
✅ **Automatic proxy generation** on upload  
✅ **Guest access** without accounts (for clients)  
✅ **Version control** automatic, not manual  
✅ **AI-powered tagging** and search  
✅ **Real-time + async** collaboration  
✅ **Clean client-facing views** separate from production UI

---

## 5. Inbox + Attention Management Patterns

### The Winning Philosophy

**Calm, focused interfaces** that progressively reveal complexity rather than overwhelming users. The most successful tools share:

1. Single-source-of-truth daily views
2. Guided workflows over freeform organization
3. Intentional friction to encourage mindful selection
4. Delightful completion states
5. Generous whitespace and minimalist aesthetics

### Three Patterns to Steal

**1. Superhuman's Split Inbox** (for Producer Role)

Horizontal swimlanes across top: "Inbox," "Team," "Episodes," "Urgent"
- Each split shows total message count
- Manual prioritization through inbox placement
- Process all team items, then all episode reviews—batching similar work maintains mental context

**For Your Hub:** Producer dashboard could have split sections:
- Pre-Production (episodes in planning)
- Active Production (filming this week)
- In Post (with Isaac)
- Ready for Upload (with Myriam)

**2. Sunsama's Daily Planning Ritual** (for Myriam's Daily Queue)

Guided daily planning walks through:
1. Review yesterday (what got done)
2. Import today's tasks
3. Set time estimates (workload counter)
4. Defer overload (visual warning if too much)
5. Order/time-block
6. Share plan (team check-in)

**For Your Hub:** Myriam's "Start Day" ritual:
1. Review yesterday's uploads
2. Import ready assets from Isaac
3. Estimate upload/social posting time
4. Queue priority order
5. Begin workflow

**3. Linear's Keyboard-First Design** (for Isaac's Workflow)

- Keyboard shortcut for every action (P=priority, L=labels, A=assign)
- "My Issues" view groups by status
- Keep "In Progress" to 1-2 items max
- Inbox Zero approach—archive as you process

**For Your Hub:** Isaac's graphics queue:
- Keyboard shortcuts for common actions
- "Active" limited to 2 projects max (focus)
- Archive completed graphics
- Quick-add new graphics request (Cmd+N)

### Visual Design: Calm Dashboards

**Characteristics:**
- **Generous whitespace** (60%+ of screen)
- **2-3 colors maximum** in UI chrome
- **Typography-driven** hierarchy
- **Minimal icons** (only when universally understood)
- **Animations subtle** and purposeful
- **Empty states celebrated**, not shameful
- **Single primary action** always visible

**Information Density:**
- Show less to accomplish more
- Filter to reduce, not reorganize
- Default to hiding metadata unless essential
- Hover/click for details

### Status Indicators for Multi-Role Progress

**Universal Pattern: Traffic Light + Detail-on-Demand**

```jsx
<EpisodeCard>
  {/* At-a-glance */}
  <StatusBadge color={statusColor} icon={statusIcon}>
    {statusText}
  </StatusBadge>
  
  {/* Hover reveals context */}
  <Tooltip>
    Changed to "In Review" by Isaac on May 20 at 2:30pm
  </Tooltip>
  
  {/* Click shows full history */}
  <ActivityFeed onClick={showHistory} />
</EpisodeCard>
```

**Color System:**
- Red/destructive: Errors, blocked, needs immediate action
- Yellow/warning: Needs attention, in review
- Green/success: Approved, complete, ready
- Blue/info: In progress, active work
- Gray/neutral: Inactive, archived, not started

**For Your Hub:**
- **Pre-Production** (gray): Planning, not started
- **Active Production** (blue): Currently filming
- **In Edit** (purple): Isaac working
- **In Review** (yellow): Awaiting approval
- **Ready to Upload** (green): Myriam's queue
- **Published** (gray): Archived

---

## 6. Daily Todo Patterns and Apple Notes Integration

### Critical Finding: Apple Notes Has NO Public API

**Reality:** Apple provides no framework for programmatic Notes access. Enhancement requests filed since 2015—still nothing in 2026.

**What IS Available:**
- **Apple Reminders API** (EventKit): Full CRUD, subtasks, tags, location triggers, time-based reminders
- **Shortcuts**: Create notes, append content (one-way only)
- **AppleScript**: macOS only, limited capabilities

**Recommendation for Your Hub:** Use Apple Reminders integration, not Notes. It provides:
- Two-way sync
- System-level integration (Siri, widgets)
- Native notifications
- Calendar integration

### Daily Rotation Patterns

**Best Pattern: Automatic Rollover with Archive Threshold** (Sunsama Model)

**How It Works:**
1. Tasks automatically roll over at midnight if incomplete
2. Visual indicator shows consecutive rollover days (numbered circle badge)
3. Auto-archive: Tasks rolling over 3+ days → moved to Archive
4. Setting: Configurable threshold or disable

**For Your Hub:**
- Producer's daily planning tasks roll over
- Myriam's upload queue items roll forward
- Isaac's graphics requests stay in queue until complete

**UI Implementation:**
```jsx
<DailyView>
  <TaskCard rollovers={3}>
    <RolloverBadge count={3} /> {/* Pink badge, showing 3 days */}
    <Task>Review Episode 5 Script</Task>
    <Actions>
      <Button>Complete</Button>
      <Button>Reschedule</Button>
      <Button>Archive</Button>
    </Actions>
  </TaskCard>
</DailyView>
```

### "Today Only" Focus with Weekly Drill-Down

**NotePlan Pattern:**
- Daily note is primary workspace
- Calendar sidebar shows week/month view without cluttering daily
- Folding: Hide subtasks until needed
- Review filters for specific queries only

**For Your Hub:**
- **Today View** (default): Tasks/episodes due today
- **Sidebar Calendar**: Mini week view, collapse for focus
- **Review Panel** (separate tab): All overdue + upcoming
- **Filter by Role**: Quick switch between what Producer/Myriam/Isaac need today

### Mobile-Desktop Sync

**Use CloudKit** (Apple's sync framework):
- Automatic sync via iCloud account
- End-to-end encryption
- Works across iOS, iPadOS, macOS
- Real-time push notifications
- Offline mode with queue

**Alternative for Cross-Platform:** Web-based sync (Supabase, Firebase) with CloudKit wrapper for Apple devices.

---

## 7. Card-Based Progress Tracking for Video Editors

### Optimal Stage Model for Video Production

**The Standard 5-7 Stage Layout:**

```
Backlog → Pre-Production → Filming → Rough Cut → Review → Revisions → Published
```

**Visual Treatment:**
- Color gradients across columns (cool to warm as work progresses)
- Left-to-right flow matches mental model of time
- "Published" column gets celebratory color (green/gold)
- Column headers show WIP limits: "In Review (3/5)"

### Card Design for Video Projects

**Information Hierarchy (Priority Order):**

```
┌─────────────────────────────────────┐
│ [Episode Badge] [Status Badge]      │
│                                     │
│ ╔═══════════════════════════════╗ │
│ ║   [Thumbnail/Preview]         ║ │
│ ╚═══════════════════════════════╝ │
│                                     │
│ Episode 3: "The Genesis Account"   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 👤 Isaac  📅 Due: May 25           │
│                                     │
│ ▓▓▓▓▓░░░░░ 5/10 tasks             │
│                                     │
│ 💬 3  📎 2                         │
└─────────────────────────────────────┘
```

**Primary (Always Visible):**
1. Episode badge (colored, numbered)
2. Status indicator (colored badge)
3. Thumbnail/visual preview
4. Episode number + title (bold, large)
5. Assignee avatar(s)
6. Due date

**Secondary (Hover/Condensed):**
7. Comment count
8. Attachment count
9. Progress bar (4/7 completed)

### Handling 2-5 Episodes Simultaneously

**Approach: Vertical Swimlanes**

Each episode gets its own row, columns represent stages:

```
Episode 1: [Pre-Prod] → [Filming] →           →          → [Published]
Episode 2: [Pre-Prod] →           → [Editing] →          →
Episode 3:            → [Filming] →           → [Review] →
Episode 4: [Backlog]  →           →           →          →
Episode 5: [Backlog]  →           →           →          →
```

**Color-Coding:**
- Episode 1 = Blue cards
- Episode 2 = Green cards
- Episode 3 = Purple cards
- Episode 4 = Orange cards
- Episode 5 = Pink cards

**Master View Toggle:**
- Default: Show all episodes
- Filter: "Currently Working On" (only active 2-3)
- Timeline View: Gantt-style to see overlap

### Progress Indicators That Work

**Checklist-Based:**
- "5/12 tasks completed"
- Progress bar beneath card title
- Updates as team checks off items

**For Your Hub Episode Cards:**
```jsx
<EpisodeCard>
  <ProgressBar value={75} />
  <ChecklistSummary>
    ✓ Script approved
    ✓ Filming complete
    ✓ Rough cut done
    ⏳ Graphics in progress (Isaac)
    ⏳ Color grading pending
  </ChecklistSummary>
</EpisodeCard>
```

### Tool Recommendations

**For Your Internal Hub:** Don't use external tools—build custom cards in Next.js.

**Inspiration to Steal From:**
- **StudioBinder**: Task sidebar on every page, context-aware creation
- **Air**: Visual-first with large thumbnails, hover for playback
- **Trello**: Simple drag-and-drop, color labels
- **Linear**: Keyboard-first, fast, minimal chrome

---

## 8. Animation and Motion Design Libraries

### The Big Decision Matrix

| Library | Size | Best For | Learning Curve |
|---------|------|----------|---------------|
| **Framer Motion** | 34KB | React apps, UI state transitions | Low |
| **GSAP** | 23KB | Scroll animations, complex sequences | Medium |
| **React Spring** | 18KB | Physics-based, natural motion | Medium |
| **TailwindCSS Motion** | 5KB | Simple CSS animations | Very Low |
| **Auto-Animate** | 3KB | Zero-config drop-in | Very Low |

### Recommendations for Your Hub

**For UI State Transitions (Modals, Drawers, Cards):**
Use **Framer Motion**

```jsx
import { motion, AnimatePresence } from 'motion/react';

export function EpisodeModal({ isOpen, onClose, episode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="glass-modal"
        >
          {/* Episode details */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Why:** AnimatePresence handles exit animations (critical for modals). Layout animations happen automatically. React-native API feels natural.

**For Scroll-Triggered Reveals and Background Motion:**
Use **GSAP + ScrollTrigger**

```jsx
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from('.episode-card', {
      opacity: 0,
      y: 50,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.episode-grid',
        start: 'top 80%',
      },
    });
  }, { scope: container });

  return <section ref={container}>...</section>;
}
```

**Why:** Best scroll performance, industry standard (Disney, Google, Apple, Stripe use it), precise timeline control.

**For Simple Hover States and Transitions:**
Use **TailwindCSS** (no library needed)

```jsx
<div className="transition-all duration-200 hover:scale-105 hover:shadow-xl">
  Episode Card
</div>
```

**Why:** Zero bundle overhead, fast, CSS-only.

### Subtle Background Movement Techniques

**1. Floating Gradient (Recommended)**

```css
.hero-background {
  background: linear-gradient(135deg, 
    #1E1B4B 0%,   /* Deep blue */
    #4F46E5 25%,  /* Indigo */
    #7C3AED 50%,  /* Purple */
    #581C87 100%  /* Deep violet */
  );
  background-size: 400% 400%;
  animation: gradientShift 90s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

**2. Noise Texture Overlay** (Adds depth, used by Apple/Stripe/Linear)
- 3-5% opacity maximum
- Blend mode: `overlay` or `soft-light`
- Fine grain (1-2px)

**3. Parallax Scrolling** (GSAP ScrollTrigger)

```jsx
gsap.to('.background-layer', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.container',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});
```

### Dynamic Information Reveals

**Stagger Effect for Episode Cards:**

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // 100ms delay between cards
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  className="episode-grid"
>
  {episodes.map(ep => (
    <motion.div key={ep.id} variants={cardVariants}>
      <EpisodeCard {...ep} />
    </motion.div>
  ))}
</motion.div>
```

### Performance Best Practices

**Critical Rules:**
1. **Animate only**: transform (translate/scale/rotate) and opacity
2. **Avoid**: width, height, top, left (trigger layout reflow)
3. **Keep animations under 300ms** for state changes
4. **Use `will-change` sparingly** (only during animation)
5. **Respect `prefers-reduced-motion`**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Target:** 60fps (16.67ms per frame)  
**Test on:** Mid-range Android devices (performance bottleneck)

---

## 9. Mobile-Responsive Patterns (Desktop-Primary)

### Core Philosophy

Design for your primary platform's strengths first (desktop for production work), then thoughtfully adapt—don't compromise.

**Desktop Strengths:**
- Smaller fonts remain readable (higher density)
- Multi-column layouts (2D information architecture)
- Hover states for progressive disclosure
- Click targets can be 24x24px
- Keyboard shortcuts for power users

**Mobile Constraints:**
- Minimum 44-48px touch targets
- Single column, vertical scrolling (1D)
- More white space required (16-32px minimum)
- No hover states—all actions explicit
- Text minimum 16px

### Layout Transformation Pattern

**Two-Dimensional (Desktop) → One-Dimensional (Mobile)**

**Desktop:**
```
┌─────────────────────────────────────┐
│ [Sidebar]  │ [Main Content]         │
│            │                         │
│ Nav        │ Episode Grid            │
│ Status     │ [Card] [Card] [Card]   │
│ Tools      │ [Card] [Card] [Card]   │
│            │                         │
└─────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────┐
│ [Header]    │
│ ☰ Menu      │
├─────────────┤
│ Episode 1   │
│ [Preview]   │
│ Details...  │
├─────────────┤
│ Episode 2   │
│ [Preview]   │
│ Details...  │
└─────────────┘
```

**Sidebar becomes off-canvas drawer:**
- Hamburger menu trigger
- Full-width when open (or 80% with backdrop)
- Swipe from edge to open
- Tap outside to close

### Responsive Navigation for Your Hub

**Desktop: Persistent Sidebar (250px)**
```jsx
<Sidebar className="w-[250px] fixed left-0">
  <Logo />
  <RoleSwitch /> {/* If multi-role user */}
  <Nav>
    <NavItem icon="dashboard">Dashboard</NavItem>
    <NavItem icon="episodes">Episodes</NavItem>
    <NavItem icon="team">Team Status</NavItem>
    <NavItem icon="settings">Settings</NavItem>
  </Nav>
</Sidebar>

<MainContent className="ml-[250px]">
  {/* Dashboard content */}
</MainContent>
```

**Mobile: Collapsible Drawer**
```jsx
<MobileHeader>
  <MenuButton onClick={toggleMenu} />
  <Logo />
  <UserAvatar />
</MobileHeader>

<Drawer isOpen={menuOpen} onClose={closeMenu}>
  {/* Same nav items, full-width */}
</Drawer>

<MainContent className="ml-0">
  {/* Full-width content */}
</MainContent>
```

### Progressive Disclosure for Mobile

**Pattern: Accordions/Expandable Sections**

**Desktop: Episode Card (Expanded)**
```jsx
<EpisodeCard>
  <Thumbnail />
  <Details>
    <Title>Episode 3: Genesis Account</Title>
    <Metadata>
      <Assignee>Isaac</Assignee>
      <DueDate>May 25</DueDate>
      <Status>In Edit</Status>
      <Progress>5/10 tasks</Progress>
    </Metadata>
    <Description>Full description visible...</Description>
    <Actions>
      <Button>Review</Button>
      <Button>Comment</Button>
      <Button>Share</Button>
    </Actions>
  </Details>
</EpisodeCard>
```

**Mobile: Episode Card (Collapsed Initially)**
```jsx
<EpisodeCard onClick={toggleExpand}>
  <Thumbnail />
  <Title>Episode 3: Genesis Account</Title>
  <Status>In Edit</Status>
  
  {isExpanded && (
    <ExpandedDetails>
      <Metadata>...</Metadata>
      <Description>...</Description>
      <Actions>...</Actions>
    </ExpandedDetails>
  )}
</EpisodeCard>
```

### Touch vs Mouse Interactions

**Desktop: Hover States**
```css
.episode-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}
```

**Mobile: Explicit Actions**
```jsx
<EpisodeCard>
  <SwipeActions
    leftActions={[
      { icon: 'archive', action: archive },
    ]}
    rightActions={[
      { icon: 'edit', action: edit },
      { icon: 'share', action: share },
    ]}
  >
    <CardContent />
  </SwipeActions>
</EpisodeCard>
```

**Gestures to Implement:**
- Swipe right: Archive/mark complete
- Swipe left: Edit/share options
- Long-press: Context menu
- Pull-to-refresh: Sync latest from Notion

### Responsive Breakpoints

```css
/* Mobile first */
.container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
  
  .episode-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
  }
  
  .episode-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .sidebar {
    display: block; /* Show persistent sidebar */
  }
}

/* Large desktop */
@media (min-width: 1440px) {
  .episode-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Real-World Success Pattern: Linear Mobile

**What They Did Right:**
- Built custom Liquid Glass implementation for iOS
- Touch targets lift on contact (visual feedback)
- Dragging beyond edge distorts view (physical tension)
- Variable blur intensifies at scroll edges
- Performance parity with desktop
- Customizable tab bar (expands to accommodate 5+ items)
- "Away from keyboard companion" philosophy, not degraded desktop

**For Your Hub:** Don't port desktop to mobile—design mobile as focused companion for on-set/on-the-go.

---

## 10. Specific Aesthetic and Design Ideas

### Typography: The Foundation

**Use Inter + JetBrains Mono. Stop debating.**

Inter is battle-tested (500M+ monthly requests), used by Linear, open-source, designed specifically for screens.

```css
:root {
  --font-display: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

.heading {
  font-family: var(--font-display);
  font-weight: 600; /* Semibold for headings */
  letter-spacing: -0.02em; /* Tighter for large text */
  line-height: 1.2;
}

.body {
  font-family: var(--font-display);
  font-weight: 400; /* Regular for body */
  letter-spacing: 0;
  line-height: 1.5;
}

.code {
  font-family: var(--font-mono);
  font-size: 0.9em;
}
```

**Scale (Use 4-6 Sizes Maximum):**
- Display: 48-60px
- H1: 36-40px
- H2: 28-32px
- H3: 20-24px
- Body: 16-18px
- Small: 14px

**Why This Works:** One family at multiple sizes creates cohesion. Typography IS the brand anchor.

### Color Palette: Trustworthy Scientific Blue-Violet

**Foundation: Tinted Neutrals (Dark Mode)**

```css
:root {
  /* Backgrounds */
  --bg-base: #0A0A0B;        /* Near-black, cool tint */
  --bg-elevated: #18181B;
  --bg-subtle: #27272A;
  --bg-glass: rgba(24, 24, 27, 0.7);
  
  /* Text */
  --text-primary: #FAFAFA;
  --text-secondary: #A1A1AA;  /* 70% opacity */
  --text-tertiary: #71717A;   /* 50% opacity */
  
  /* Accent */
  --accent-primary: #6366F1;    /* Indigo 500 */
  --accent-hover: #4F46E5;      /* Indigo 600 */
  --accent-pressed: #4338CA;    /* Indigo 700 */
  --accent-subtle: rgba(99, 102, 241, 0.15);
  
  /* Semantic */
  --success: #10B981;    /* Green */
  --warning: #F59E0B;    /* Amber */
  --error: #EF4444;      /* Red */
  --info: #3B82F6;       /* Blue */
}
```

**Why Indigo:** Used by Stripe and Linear. Conveys trust, intelligence, professionalism. Works beautifully with glass effects due to luminosity.

**Glass-Specific Colors:**

```css
.glass-card {
  background: rgba(24, 24, 27, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px) saturate(180%);
}
```

**Accessibility:** Ensure 4.5:1 minimum contrast ratio. Use WillowTree's Figma Contrast plugin.

### Background Motion: Subtle Gradient Mesh

```css
.hero-background {
  background: linear-gradient(135deg, 
    #1E1B4B 0%,   /* Deep blue */
    #4F46E5 25%,  /* Indigo */
    #7C3AED 50%,  /* Purple */
    #581C87 100%  /* Deep violet */
  );
  background-size: 400% 400%;
  animation: gradientShift 90s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Add noise texture overlay */
.hero-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/noise.png');
  opacity: 0.05;
  mix-blend-mode: overlay;
}
```

**Timing:** 60-120 second loop (very slow, almost imperceptible).

### Iconography: Heroicons (SF Symbols Alternative)

**Use Heroicons** (open-source, 292 icons, designed by Tailwind creators):
- Style: Outline (24×24px at 1.5px stroke)
- Variants: Solid for active/selected states
- Download: https://heroicons.com/

```jsx
import { VideoCameraIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

<StatusBadge>
  <VideoCameraIcon className="w-5 h-5" />
  <span>In Production</span>
</StatusBadge>
```

**Animation States:**

```css
.icon {
  transition: transform 150ms ease-out, color 150ms ease-out;
}

.icon:hover {
  transform: translateY(-2px);
  color: var(--accent-primary);
}

.icon.active {
  color: var(--accent-primary);
  filter: drop-shadow(0 0 8px var(--accent-primary));
}
```

### Depth and Layering: Stacked Shadows

**Don't use single shadows—they look flat.**

```css
.card-premium {
  box-shadow: 
    0 1px 1px hsl(0deg 0% 0% / 0.075),
    0 2px 2px hsl(0deg 0% 0% / 0.075),
    0 4px 4px hsl(0deg 0% 0% / 0.075),
    0 8px 8px hsl(0deg 0% 0% / 0.075),
    0 16px 16px hsl(0deg 0% 0% / 0.075);
}
```

**Elevation System (6 Levels):**

```css
--elevation-0: none; /* Base surface */
--elevation-1: 0 2px 4px rgba(0,0,0,0.1); /* Cards */
--elevation-2: 0 4px 8px rgba(0,0,0,0.15); /* Dropdowns */
--elevation-3: 0 8px 16px rgba(0,0,0,0.2); /* Modals */
--elevation-4: 0 12px 24px rgba(0,0,0,0.25); /* Overlays */
--elevation-5: 0 16px 32px rgba(0,0,0,0.3); /* Tooltips */
```

**Glass Layer Stacking:**
1. Background (z-index: 1): Content/video
2. Glass Layer (z-index: 10): Semi-transparent panels with blur
3. Content Layer (z-index: 20): Text/buttons on solid backgrounds

### Micro-Interactions: Button Hover Pattern

```css
.btn-premium {
  background: var(--accent-primary);
  border-radius: 8px;
  padding: 12px 24px;
  transition: 
    transform 150ms ease-out,
    background-color 150ms ease-out,
    box-shadow 150ms ease-out;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.btn-premium:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

.btn-premium:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}
```

**Timing:** 100-150ms (fast enough to feel instant, slow enough to perceive).

**Easing Functions:**
- Ease-out (entering): `cubic-bezier(0.16, 1, 0.3, 1)`
- Ease-in (exiting): `cubic-bezier(0.7, 0, 0.84, 0)`
- Spring (playful): `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

### Loading States: Skeleton Screens

**Better than spinners—shows structure, reduces perceived wait.**

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 0%,
    var(--bg-subtle) 50%,
    var(--bg-elevated) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Success Animations: Checkmark

```jsx
import { motion } from 'motion/react';

<motion.svg
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  <motion.path
    d="M5 13l4 4L19 7" /* Checkmark path */
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.3 }}
  />
</motion.svg>
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Typography + Color System:**
- Install Inter and JetBrains Mono
- Set up CSS variables for color tokens
- Create base styles (headings, body, code)
- Test contrast ratios (WCAG 2.1 AA)

**Tech Stack Setup:**
- Initialize Next.js 15+ project
- Install Tailwind CSS + configure custom theme
- Set up @mawtech/glass-ui or build custom glass components
- Configure Notion API connection

### Phase 2: Core Components (Weeks 3-4)

**Glass Components:**
- GlassCard (base component)
- GlassButton (primary actions)
- GlassModal (overlays)
- GlassSidebar (navigation)

**Animation Setup:**
- Install Framer Motion
- Install GSAP + ScrollTrigger
- Create base animation variants
- Set up `prefers-reduced-motion` support

### Phase 3: Role-Based Dashboards (Weeks 5-6)

**Producer Dashboard:**
- Episode status cards with progress indicators
- Calendar/schedule integration
- Team status panel (where Isaac/Myriam are)
- Quick actions (review, comment, approve)

**Myriam Dashboard:**
- Upload queue with thumbnails
- Social media scheduler
- Approved assets gallery
- Upload status panel

**Isaac Dashboard:**
- Active edits workspace
- Graphics queue
- Asset library browser
- Render queue monitor

### Phase 4: Notion Integration (Weeks 7-8)

**Data Fetching:**
- Set up Next.js ISR (Incremental Static Regeneration)
- Configure Notion webhooks for real-time updates
- Implement Redis caching (optional, for performance)
- Build custom components for Notion block rendering

**Episode Management:**
- Fetch episode database from Notion
- Display episode cards with metadata
- Status updates (two-way sync)
- Comment threading

### Phase 5: Polish + Mobile (Weeks 9-10)

**Responsive Design:**
- Mobile sidebar (off-canvas drawer)
- Touch-optimized tap targets (44-48px)
- Swipe gestures
- Progressive disclosure for mobile

**Performance Optimization:**
- Lazy load animation libraries
- Optimize images (Next.js Image component)
- Code splitting by route
- Lighthouse audit (target 90+ scores)

**Accessibility:**
- Keyboard navigation
- Focus states
- Screen reader testing
- Color contrast verification

---

## Critical Success Factors

### DO:

1. **Use proven patterns.** Don't reinvent. Linear, Notion, StudioBinder have solved these problems.

2. **Start with Inter + JetBrains Mono.** This typography pairing is proven and free.

3. **Commit to Indigo (#6366F1) as primary accent.** It's trustworthy, scientific, premium.

4. **Keep animations under 200ms** for state changes. Speed = premium feel.

5. **Use Heroicons.** Free, comprehensive, SF Symbols-like.

6. **Blur backgrounds heavily (40-60px)** for glass effects.

7. **Design all 6 states** for interactive elements: default, hover, focus, active, disabled, loading.

8. **Test on mid-range Android** (performance bottleneck).

9. **Use Next.js ISR** for Notion data (static generation with hourly revalidation).

10. **Build role-specific dashboards** from day one. Don't try to make one dashboard serve all roles.

### DON'T:

1. **Don't use pure black (#000) or pure white (#FFF).** Use tinted neutrals.

2. **Don't mix multiple font families.** One family = cohesion.

3. **Don't animate for aesthetics only.** Every animation must serve purpose.

4. **Don't build custom sync.** Use CloudKit (Apple) or web-based (Supabase/Firebase).

5. **Don't copy Stripe/Linear colors directly.** Copy their process.

6. **Don't use light glass on light backgrounds** without 40px+ blur.

7. **Don't try to integrate Apple Notes.** No API exists. Use Reminders instead.

8. **Don't make mobile feel like afterthought.** Design as focused companion.

9. **Don't skip accessibility.** WCAG 2.1 AA is minimum (4.5:1 contrast).

10. **Don't optimize prematurely.** Build, measure, then optimize.

---

## Key Resources and URLs

### Typography:
- Inter: https://rsms.me/inter/
- JetBrains Mono: https://www.jetbrains.com/lp/mono/
- Geist (alternative): https://vercel.com/font

### Icons:
- Heroicons: https://heroicons.com/
- Phosphor Icons: https://phosphoricons.com/

### Glass UI Libraries:
- @mawtech/glass-ui: https://www.npmjs.com/package/@mawtech/glass-ui
- @yhooi2/shadcn-glass-ui: https://www.npmjs.com/package/@yhooi2/shadcn-glass-ui

### Animation:
- Framer Motion: https://www.framer.com/motion/
- GSAP: https://greensock.com/gsap/
- AOS (scroll animations): https://michalsnik.github.io/aos/

### Notion Integration:
- Next.js Starter Kit: https://github.com/transitive-bullshit/nextjs-notion-starter-kit
- react-notion-x: https://github.com/NotionX/react-notion-x
- Official Notion API: https://developers.notion.com/

### Design Tools:
- Glassmorphism Generator: https://hype4.academy/tools/glassmorphism-generator
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- CSS Noise Generator: https://www.noisetexturegenerator.com/

### Inspiration:
- Awwwards: https://www.awwwards.com/
- Godly: https://godly.website/
- Linear Method: https://linear.app/method
- Rauno Freiberg's Craft: https://rauno.me/craft

### Production Tool Research:
- Frame.io: https://frame.io/
- StudioBinder: https://www.studiobinder.com/
- Air: https://www.air.inc/
- Iconik: https://iconik.io/

---

## Final Notes for Daniel/Mae

This Bible represents the current state of the art for building production hub UIs in 2026. The research is comprehensive, the recommendations are opinionated and based on what actually works in production.

**The Pattern:** Premium UI isn't about decoration—it's about completeness. Every element should have visible decisions behind it. The pattern across Stripe, Linear, and Vercel isn't a specific aesthetic—it's a consistent level of craft.

**Your Competitive Advantage:** Most production tools are either beautiful but limited (consumer apps) or powerful but ugly (broadcast software). You're building something that's both—gorgeous AND functional. That's rare and valuable.

**Where to Start:** 
1. Set up Next.js + Notion integration first (get data flowing)
2. Build one role's dashboard (Producer) with 3-5 core components
3. Add glass aesthetic and animations
4. Replicate for other roles
5. Polish and optimize

**When You Get Stuck:** Reference this document. It's designed to answer "how should I design X?" questions that come up during implementation.

Build something beautiful. Make it steal the show while remaining functional. That's the GSR Hub way.

—End of GSR Hub UI Bible—