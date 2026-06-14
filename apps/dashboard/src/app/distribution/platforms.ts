// Distribution tracker config.
// The platform ids are the LIVE distributions.platform enum (migration
// 20260528003000_correct_distributions_platforms.sql) and are the authoritative
// registry per GSR-WORKFLOW-CANON.md section 11. Order is webstream-first.
// The status values are the live distributions_status CHECK constraint
// (migration 20260528001200_add_distributions.sql).

export type DistStatus =
  | 'pending'
  | 'uploading'
  | 'scheduled'
  | 'live'
  | 'failed'
  | 'not_applicable'

export interface PlatformDef {
  id: string
  label: string
  blurb: string
}

export const PLATFORMS: PlatformDef[] = [
  { id: 'youtube', label: 'YouTube', blurb: 'Main episode post. Monday 4PM ET, private until approved.' },
  { id: 'rumble', label: 'Rumble', blurb: 'Secondary video. Manual upload (no working API).' },
  { id: 'streamhoster', label: 'StreamHoster', blurb: 'One FTPS upload feeds Roku, Apple TV, the iOS app, and LG TV.' },
  { id: 'genesis_science_network', label: 'GSN', blurb: 'genesissciencenetwork.com 24/7 web stream.' },
  { id: 'real_life_network', label: 'RightNow / RLN', blurb: 'Signiant Media Shuttle delivery. -20 LKFS audio.' },
  { id: 'dropbox', label: 'Dropbox', blurb: 'Broadcast master to partner stations; also the OTA source.' },
  { id: 'fireside_podcast', label: 'Podcast', blurb: 'Fireside MP3. Feeds Spotify + Apple Podcasts via RSS.' },
  { id: 'social_clip', label: 'Social clip', blurb: 'Episode-level short-form status flag.' },
  { id: 'other', label: 'Other', blurb: 'Catch-all.' },
]

export const PLATFORM_IDS: string[] = PLATFORMS.map((p) => p.id)

export const STATUS_VALUES: DistStatus[] = [
  'pending',
  'uploading',
  'scheduled',
  'live',
  'failed',
  'not_applicable',
]

export const STATUS_META: Record<DistStatus, { label: string; chip: string; text: string }> = {
  pending: { label: 'To do', chip: 'border-border bg-muted/40', text: 'text-muted-foreground' },
  uploading: { label: 'Uploading', chip: 'border-amber-500/30 bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  scheduled: { label: 'Scheduled', chip: 'border-blue-500/30 bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  live: { label: 'Live', chip: 'border-green-500/30 bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
  failed: { label: 'Failed', chip: 'border-red-500/40 bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
  not_applicable: { label: 'N/A', chip: 'border-border/50 bg-transparent', text: 'text-muted-foreground/50' },
}

// Episode fields the tracker derives an initial status from when no
// distributions row has been recorded yet. Stored rows always override these.
export interface EpisodeDeriveInput {
  youtube_url: string | null
  youtube_published_at: string | null
  youtube_scheduled_publish_at: string | null
  rumble_url: string | null
  podcast_url: string | null
}

export function deriveStatus(platformId: string, ep: EpisodeDeriveInput): DistStatus {
  switch (platformId) {
    case 'youtube':
      if (ep.youtube_published_at || ep.youtube_url) return 'live'
      if (ep.youtube_scheduled_publish_at) return 'scheduled'
      return 'pending'
    case 'rumble':
      return ep.rumble_url ? 'live' : 'pending'
    case 'fireside_podcast':
      return ep.podcast_url ? 'live' : 'pending'
    default:
      return 'pending'
  }
}

export function deriveUrl(platformId: string, ep: EpisodeDeriveInput): string | null {
  switch (platformId) {
    case 'youtube':
      return ep.youtube_url
    case 'rumble':
      return ep.rumble_url
    case 'fireside_podcast':
      return ep.podcast_url
    default:
      return null
  }
}

// Shape passed from the server page to the client board.
export interface PlatformCell {
  id: string
  label: string
  blurb: string
  status: DistStatus
  url: string | null
}

export interface EpisodeDist {
  id: string
  code: string
  title: string | null
  guest: string | null
  dateLabel: string
  countdownLabel: string
  tone: 'past' | 'soon' | 'future' | 'none'
  liveCount: number
  applicable: number
  platforms: PlatformCell[]
}
