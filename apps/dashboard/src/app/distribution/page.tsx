import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import {
  PLATFORMS,
  deriveStatus,
  deriveUrl,
  type DistStatus,
  type EpisodeDist,
  type PlatformCell,
} from './platforms'
import { DistributionBoard } from './distribution-board'

// How many episodes to surface. The tracker is about current work, so the most
// recent / upcoming episodes lead; older fully-distributed ones are not noise.
const SHOWN = 12

interface EpisodeRow {
  id: string
  title: string | null
  season: number | null
  episode_number: number | null
  guest_name: string | null
  air_date: string | null
  webstream_scheduled_publish_at: string | null
  youtube_url: string | null
  youtube_published_at: string | null
  youtube_scheduled_publish_at: string | null
  rumble_url: string | null
  podcast_url: string | null
}

interface DistRow {
  episode_id: string
  platform: string
  status: string
  platform_url: string | null
}

const DAY_MS = 86_400_000

// Read request time once, memoized for the render pass (stable + pure per request).
const getNow = cache(() => Date.now())

function primaryDate(ep: EpisodeRow): string | null {
  return ep.webstream_scheduled_publish_at ?? ep.air_date
}

function formatDate(value: string | null): string {
  if (!value) return 'No date set'
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return 'No date set'
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function countdown(value: string | null, now: number): { label: string; tone: EpisodeDist['tone'] } {
  if (!value) return { label: 'Unscheduled', tone: 'none' }
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return { label: 'Unscheduled', tone: 'none' }
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const days = Math.round((dt.setHours(0, 0, 0, 0) - startOfToday.getTime()) / DAY_MS)
  if (days === 0) return { label: 'Today', tone: 'soon' }
  if (days === 1) return { label: 'Tomorrow', tone: 'soon' }
  if (days === -1) return { label: 'Yesterday', tone: 'past' }
  if (days > 1 && days <= 7) return { label: `in ${days} days`, tone: 'soon' }
  if (days > 7) return { label: `in ${days} days`, tone: 'future' }
  return { label: `${-days} days ago`, tone: 'past' }
}

export default async function DistributionPage() {
  const supabase = await createClient()

  const [episodesResult, distResult] = await Promise.all([
    supabase
      .from('episodes')
      .select(
        `id, title, season, episode_number, guest_name, air_date,
         webstream_scheduled_publish_at, youtube_url, youtube_published_at,
         youtube_scheduled_publish_at, rumble_url, podcast_url`,
      ),
    supabase.from('distributions').select('episode_id, platform, status, platform_url'),
  ])

  if (episodesResult.error) {
    return (
      <main className="mx-auto max-w-5xl px-8 py-8">
        <p className="text-sm text-destructive">
          Failed to load episodes: {episodesResult.error.message}
        </p>
      </main>
    )
  }

  const episodes = (episodesResult.data ?? []) as EpisodeRow[]
  const dists = (distResult.data ?? []) as DistRow[]

  // episode_id -> platform -> stored row (the human-maintained truth).
  const storedByEpisode = new Map<string, Map<string, DistRow>>()
  for (const row of dists) {
    let byPlatform = storedByEpisode.get(row.episode_id)
    if (!byPlatform) {
      byPlatform = new Map<string, DistRow>()
      storedByEpisode.set(row.episode_id, byPlatform)
    }
    if (!byPlatform.has(row.platform)) byPlatform.set(row.platform, row)
  }

  const now = getNow()

  // The tracker centers on current work: most-recently-aired episodes first
  // (those are the ones actively being pushed to every platform), then the
  // nearest upcoming, then anything undated.
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const todayMs = startOfToday.getTime()

  const dateMs = (ep: EpisodeRow): number | null => {
    const d = primaryDate(ep)
    if (!d) return null
    const t = new Date(d).getTime()
    return Number.isNaN(t) ? null : t
  }

  const aired = episodes
    .filter((e) => {
      const t = dateMs(e)
      return t !== null && t <= todayMs
    })
    .sort((a, b) => (dateMs(b) ?? 0) - (dateMs(a) ?? 0))
  const upcoming = episodes
    .filter((e) => {
      const t = dateMs(e)
      return t !== null && t > todayMs
    })
    .sort((a, b) => (dateMs(a) ?? 0) - (dateMs(b) ?? 0))
  const undated = episodes.filter((e) => dateMs(e) === null)
  const ordered = [...aired, ...upcoming, ...undated]

  const board: EpisodeDist[] = ordered.slice(0, SHOWN).map((ep) => {
    const stored = storedByEpisode.get(ep.id)
    const platforms: PlatformCell[] = PLATFORMS.map((p) => {
      const row = stored?.get(p.id)
      const status: DistStatus = row ? (row.status as DistStatus) : deriveStatus(p.id, ep)
      const url = row?.platform_url ?? deriveUrl(p.id, ep)
      return { id: p.id, label: p.label, blurb: p.blurb, status, url }
    })
    const applicablePlatforms = platforms.filter((p) => p.status !== 'not_applicable')
    const liveCount = applicablePlatforms.filter((p) => p.status === 'live').length
    const { label: countdownLabel, tone } = countdown(primaryDate(ep), now)
    const code =
      ep.season != null && ep.episode_number != null
        ? `S${ep.season}E${String(ep.episode_number).padStart(2, '0')}`
        : 'Episode'

    return {
      id: ep.id,
      code,
      title: ep.title,
      guest: ep.guest_name,
      dateLabel: formatDate(primaryDate(ep)),
      countdownLabel,
      tone,
      liveCount,
      applicable: applicablePlatforms.length,
      platforms,
    }
  })

  return (
    <main className="mx-auto max-w-5xl px-8 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Distribution</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Where each recent episode stands across every release target. Tap a platform to
          update its status. Showing {board.length} of {episodes.length} episodes.
        </p>
      </div>

      <DistributionBoard episodes={board} />
    </main>
  )
}
