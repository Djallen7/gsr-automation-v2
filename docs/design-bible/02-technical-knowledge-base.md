# GSR Hub — Technical Knowledge Base

*Durable technical reference for `/docs/design-bible/`*

---

## Chapter 1: Next.js App Router for Internal Tools

### App Router vs Pages Router: Use App Router

For new projects in 2026, **App Router is the only choice**. Pages Router is maintenance mode.

**Why App Router for GSR Hub**: Server Components by default (fetch Notion on server, zero client JS for static content), layouts and nested routes (shared nav across roles), route groups (organize by role without affecting URLs), parallel routes (show multiple views simultaneously), intercepting routes (modals without page navigation), Server Actions (write to Notion from forms without API routes), streaming (show cards as they load).

### Server Components vs Client Components

**Server Components** (default):
```typescript
// app/dashboard/page.tsx
import { getNotionDatabase } from '@/lib/notion'

export default async function DashboardPage() {
  const episodes = await getNotionDatabase('your-database-id')
  return <div>{episodes.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}</div>
}
```

**Client Components** (add `'use client'`):
```typescript
'use client'
import { useState } from 'react'

export function FilterBar() {
  const [filter, setFilter] = useState('all')
  return <select value={filter} onChange={e => setFilter(e.target.value)}>...</select>
}
```

**Rule**: Server by default, client only for interactivity.

### Route Groups for Role-Based Segmentation

```
app/
├── (producer)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx      # URL: /dashboard
│   └── schedule/page.tsx       # URL: /schedule
├── (myriam)/
│   └── uploads/page.tsx        # URL: /uploads
├── (isaac)/
│   └── graphics/page.tsx       # URL: /graphics
└── layout.tsx
```

Each role gets custom layout with its own navigation, but URLs stay clean (`/dashboard`, not `/producer/dashboard`).

### Concrete Folder Structure for GSR Hub

```
app/
├── (dashboard)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx      # Producer home
│   ├── uploads/page.tsx        # Myriam's queue
│   ├── graphics/page.tsx       # Isaac's tracker
│   └── settings/page.tsx
├── api/
│   ├── revalidate/route.ts     # n8n webhook target
│   ├── sse/route.ts            # Real-time updates
│   └── notion-image/[key]/route.ts
├── actions.ts                  # Server Actions
├── providers.tsx               # TanStack Query, Zustand
└── layout.tsx

components/
├── ui/                         # shadcn/ui
├── episodes/
│   ├── episode-card.tsx
│   └── status-ring.tsx
└── command-menu.tsx

lib/
├── notion/
│   ├── client.ts
│   ├── queries.ts
│   └── types.ts
└── utils.ts

stores/
└── use-app-store.ts            # Zustand

styles/
└── globals.css
```

---

## Chapter 2: Notion as a Live Data Layer

### Notion DATABASE API for Structured Episode Data

**Episode database schema**:
- Title (title)
- Status (select: Draft, Recorded, Editing, Approved, Published)
- Air Date (date)
- Scripture References (rich text)
- Show (select: GSN, WWN, etc.)
- Phase (formula/select)
- Uploaded Platforms (multi-select: YouTube, Rumble, etc.)
- Thumbnail URL (file)
- Transcript (rich text)
- Assigned To (person: Producer, Myriam, Isaac)

### Query Patterns

**Fetch all episodes**:
```typescript
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID!,
  sorts: [{ property: 'Air Date', direction: 'descending' }]
})
```

**Filter by status**:
```typescript
const approvedEpisodes = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID!,
  filter: {
    property: 'Status',
    select: { equals: 'Approved' }
  }
})
```

**Complex filters**:
```typescript
const myriamQueue = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID!,
  filter: {
    and: [
      { property: 'Status', select: { equals: 'Approved' } },
      { property: 'Assigned To', people: { contains: 'myriam-user-id' } }
    ]
  },
  sorts: [{ property: 'Air Date', direction: 'ascending' }]
})
```

### Large Database Pagination

```typescript
async function fetchAllEpisodes(databaseId: string) {
  let allResults: any[] = []
  let hasMore = true
  let startCursor: string | undefined

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      page_size: 100
    })
    allResults = [...allResults, ...response.results]
    hasMore = response.has_more
    startCursor = response.next_cursor || undefined
  }
  return allResults
}
```

### Image URL Caching (URLs Expire in 1 Hour)

**Solution: Proxy through Next.js**:
```typescript
// app/api/notion-image/[pageId]/route.ts
export async function GET(req: Request, { params }: { params: { pageId: string } }) {
  const page = await notion.pages.retrieve({ page_id: params.pageId })
  const imageUrl = (page.properties['Thumbnail URL'] as any).files[0]?.url
  
  if (!imageUrl) return new Response('No image', { status: 404 })
  
  const imageRes = await fetch(imageUrl)
  const buffer = await imageRes.arrayBuffer()
  
  return new Response(buffer, {
    headers: {
      'Content-Type': imageRes.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    }
  })
}

// Usage
<Image src={`/api/notion-image/${episode.id}`} alt={episode.title} />
```

### Webhook Patterns for Real-Time Updates

**Next.js revalidation endpoint**:
```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { pageId, databaseId } = await req.json()

  revalidatePath('/dashboard')
  revalidatePath('/uploads')
  revalidatePath('/graphics')
  revalidateTag(`notion-${databaseId}`)

  return Response.json({ revalidated: true, now: Date.now() })
}
```

### Rate Limiting

**Notion API**: 3 requests/second (2,700 calls per 15 minutes)

**Implementation**:
```typescript
import Bottleneck from 'bottleneck'

export const notionLimiter = new Bottleneck({
  reservoir: 2700,
  reservoirRefreshAmount: 2700,
  reservoirRefreshInterval: 15 * 60 * 1000,
  minTime: 333,
})

const episodes = await notionLimiter.schedule(() =>
  notion.databases.query({ database_id: dbId })
)
```

---

## Chapter 3: Real-Time Data Patterns

### Recommendation: SSE + Webhook-Triggered Revalidation

**For GSR Hub**: SSE for unidirectional updates, webhook-triggered revalidation for Notion changes.

### Server-Sent Events Implementation

**Server endpoint**:
```typescript
// app/api/sse/updates/route.ts
export async function GET(req: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      
      const keepAliveInterval = setInterval(() => {
        controller.enqueue(encoder.encode(': keep-alive\n\n'))
      }, 30000)
      
      function sendUpdate(data: any) {
        const payload = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(payload))
      }
      
      req.signal.addEventListener('abort', () => {
        clearInterval(keepAliveInterval)
        controller.close()
      })
      
      sendUpdate({ type: 'connected', timestamp: Date.now() })
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    }
  })
}
```

**Client hook**:
```typescript
'use client'
import { useEffect, useState } from 'react'

export function useStatusUpdates() {
  const [updates, setUpdates] = useState<any[]>([])
  
  useEffect(() => {
    const eventSource = new EventSource('/api/sse/updates')
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setUpdates(prev => [...prev, data])
    }
    
    eventSource.onerror = (error) => {
      console.error('SSE error, will auto-reconnect:', error)
    }
    
    return () => eventSource.close()
  }, [])
  
  return updates
}
```

### TanStack Query for Server State

**Setup**:
```typescript
// app/providers.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: 3,
      },
    },
  }))
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

**Fetch episodes**:
```typescript
'use client'
import { useQuery } from '@tanstack/react-query'

export function EpisodeList() {
  const { data: episodes, isLoading } = useQuery({
    queryKey: ['episodes'],
    queryFn: async () => {
      const res = await fetch('/api/episodes')
      return res.json()
    },
    staleTime: 60_000,
  })
  
  if (isLoading) return <div>Loading...</div>
  return <div>{episodes.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}</div>
}
```

**Optimistic updates**:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function ApproveButton({ episodeId }: { episodeId: string }) {
  const queryClient = useQueryClient()
  
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/episodes/${id}/approve`, { method: 'POST' })
      return res.json()
    },
    
    onMutate: async (episodeId) => {
      await queryClient.cancelQueries({ queryKey: ['episodes'] })
      const previousEpisodes = queryClient.getQueryData(['episodes'])
      
      queryClient.setQueryData(['episodes'], (old: any[]) =>
        old.map(ep => ep.id === episodeId ? { ...ep, status: 'Approved' } : ep)
      )
      
      return { previousEpisodes }
    },
    
    onError: (err, variables, context) => {
      if (context?.previousEpisodes) {
        queryClient.setQueryData(['episodes'], context.previousEpisodes)
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] })
    },
  })
  
  return (
    <button onClick={() => approveMutation.mutate(episodeId)}>
      {approveMutation.isPending ? 'Approving...' : 'Approve'}
    </button>
  )
}
```

### Zustand for UI State

```typescript
// stores/use-app-store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  currentRole: 'producer' | 'myriam' | 'isaac'
  sidebarOpen: boolean
  selectedEpisodeId: string | null
  setCurrentRole: (role: 'producer' | 'myriam' | 'isaac') => void
  toggleSidebar: () => void
  selectEpisode: (id: string | null) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        currentRole: 'producer',
        sidebarOpen: true,
        selectedEpisodeId: null,
        setCurrentRole: (role) => set({ currentRole: role }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        selectEpisode: (id) => set({ selectedEpisodeId: id }),
      }),
      { name: 'gsr-hub-storage' }
    )
  )
)
```

### nuqs for URL State

```typescript
'use client'
import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs'

export function EpisodeFilters() {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(''),
    status: parseAsString.withDefault('all'),
    page: parseAsInteger.withDefault(1),
  })
  
  return (
    <div>
      <input
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
      />
      <select
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
      >
        <option value="all">All</option>
        <option value="Approved">Approved</option>
      </select>
    </div>
  )
}
```

---

## Chapter 4: Authentication for Internal Tools

### Recommended: localStorage Picker

```typescript
// app/providers.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Role = 'producer' | 'myriam' | 'isaac'

const RoleContext = createContext<{
  role: Role | null
  setRole: (role: Role) => void
}>({ role: null, setRole: () => {} })

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null)
  
  useEffect(() => {
    const stored = localStorage.getItem('gsr-role') as Role | null
    if (stored) setRoleState(stored)
  }, [])
  
  const setRole = (newRole: Role) => {
    localStorage.setItem('gsr-role', newRole)
    setRoleState(newRole)
  }
  
  if (!role) return <RolePicker onSelect={setRole} />
  
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}

export const useRole = () => useContext(RoleContext)

function RolePicker({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Who are you?</h1>
        <button onClick={() => onSelect('producer')}>Producer (Daniel)</button>
        <button onClick={() => onSelect('myriam')}>Myriam (Post/Social)</button>
        <button onClick={() => onSelect('isaac')}>Isaac (Graphics/Editing)</button>
      </div>
    </div>
  )
}
```

**For now**: Skip real auth. localStorage sufficient behind Tailscale. Upgrade to Better Auth later if needed.

---

## Chapter 5: AI Integration Beyond Round 1

### generateObject for Structured Metadata

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const metadataSchema = z.object({
  title: z.string().describe('Episode title (max 100 chars)'),
  description: z.string().describe('YouTube description'),
  tags: z.array(z.string()).describe('5-10 relevant tags'),
  scriptureRefs: z.array(z.string()).describe('Bible verses mentioned'),
})

export async function generateEpisodeMetadata(transcript: string) {
  const { object } = await generateObject({
    model: anthropic('claude-3-5-sonnet-20241022'),
    schema: metadataSchema,
    prompt: `Generate metadata for Genesis Science Network episode. Guidelines:
- Title: compelling, mention key topic
- Description: YouTube-optimized with timestamps
- Tags: mix broad (Christianity, Science) and specific
- Scripture: format "Genesis 1:1, Psalm 19:1-4"

Transcript: ${transcript}`,
  })
  
  return object
}
```

**Usage in Server Action**:
```typescript
'use server'
export async function generateMetadataAction(episodeId: string) {
  const transcript = await getTranscript(episodeId)
  const metadata = await generateEpisodeMetadata(transcript)
  
  await notion.pages.update({
    page_id: episodeId,
    properties: {
      Title: { title: [{ text: { content: metadata.title } }] },
      Description: { rich_text: [{ text: { content: metadata.description } }] },
      Tags: { multi_select: metadata.tags.map(name => ({ name })) },
    }
  })
  
  return metadata
}
```

---

## Chapter 6-8: Additional Topics

**Chapter 6**: Use shadcn/ui (foundation) + Tremor (data viz) + cmdk (command palette) + Vaul (drawer) + Lucide (icons)

**Chapter 7**: GPU-accelerated properties only (transform, opacity, filter). Use CSS animations for 60fps+. Implement prefers-reduced-motion with alternative motion, not no motion.

**Chapter 8**: Covered in Chapter 3.

---

## Chapter 9: Command Palette Implementation

```bash
npx shadcn@latest add command
```

```typescript
'use client'
import { CommandDialog, CommandInput, CommandItem, CommandList, CommandGroup } from '@/components/ui/command'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])
  
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => { router.push('/dashboard'); setOpen(false) }}>
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => { router.push('/uploads'); setOpen(false) }}>
            Upload Queue
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

---

## Chapter 10-15: Additional Implementation Details

**Chapter 10**: Use Vaul drawer for mobile, PWA for offline access

**Chapter 11**: Deploy to Vercel (recommended), automatic preview deployments on PRs

**Chapter 12**: Ensure 4.5:1 contrast on glass surfaces, visible focus rings, ARIA live regions for status updates, test with color-blind simulators

**Chapter 13**: Use Lucide React (1,694 icons, tree-shakeable, 1KB each)

**Chapter 14**: Progress rings (custom SVG), Kanban (@dnd-kit), Tremor for charts

**Chapter 15**: Start with static Hubble Deep Field image at 6-8% opacity, add CSS animated gradient if needed more motion, skip WebGL for v1

---

## Chapter 16: Inspiration Catalog

Full URLs provided in Document 1. Key sites:
- Linear - https://linear.app/
- Stripe - https://stripe.com/
- Vercel - https://vercel.com/
- Bruno Simon - https://bruno-simon.com/
- Rauno's Craft - https://rauno.me/craft
- NASA Webb Gallery - https://science.nasa.gov/mission/webb/multimedia/images/
- Awwwards - https://www.awwwards.com/websites/sites_of_the_day/
- GOV.UK Design System - https://design-system.service.gov.uk/

---

## Chapter 17: Round 1 Gaps and Open Questions

**Key unresolved questions**:

1. **Producer vs Myriam overlap**: Episode appears in both dashboards with different emphasis
2. **Manual upload pattern**: "Copy to Clipboard" buttons + external links + checklist
3. **Apple Notes**: Still skip (no API)
4. **Multi-brand expansion**: Use "Show" filter, assign secondary accent per show if needed
5. **Schema finalization**: Add Transcript Status, AI Metadata Generated, Upload URLs, Notes fields
6. **Error handling**: n8n sends SSE update with error, UI shows red indicator + retry button
7. **Cosmic background**: Start with Pillars of Creation or Hubble Deep Field at 6-8% opacity
8. **Role switching**: Yes, dropdown in nav, persists in localStorage
9. **Mobile strategy**: Desktop-first, mobile for Myriam status checks, Vaul drawer for details
10. **Team testing**: Build Producer view first (Daniel tests), then Myriam's (preview + feedback), then Isaac's

---

## FINAL IMPLEMENTATION CHECKLIST

### Week 1-2: Foundation
- [ ] Next.js App Router project
- [ ] Tailwind + shadcn/ui
- [ ] Cosmic background image (static Hubble Deep Field)
- [ ] Glass card components
- [ ] Inter + JetBrains Mono fonts
- [ ] Role picker (localStorage)
- [ ] Notion client with rate limiting

### Week 3-4: Producer Dashboard
- [ ] Fetch episodes from Notion
- [ ] TanStack Query setup
- [ ] Episode cards with status rings
- [ ] Filters (status, show, date)
- [ ] nuqs for URL state
- [ ] Command palette (⌘K)

### Week 5-6: Myriam's Upload Queue
- [ ] Filter "Approved" episodes
- [ ] Upload status indicators
- [ ] Copy metadata buttons
- [ ] Platform checklist UI
- [ ] Vaul drawer for mobile

### Week 7-8: Isaac's Graphics Tracker
- [ ] @dnd-kit Kanban board
- [ ] Render progress indicators
- [ ] File preview

### Week 9-10: Real-Time & Polish
- [ ] SSE endpoint for live updates
- [ ] n8n webhook → revalidation
- [ ] AI metadata generation UI
- [ ] Framer Motion animations
- [ ] Accessibility audit
- [ ] Deploy to Vercel
