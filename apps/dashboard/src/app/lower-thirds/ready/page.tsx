import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ReadyOutput } from './ready-output'

interface ApprovedGraphic {
  id: string
  segment: string
  beat_number: number | null
  initial_text: string
  approved_text: string | null
  propresenter_added: boolean
  episode: { season: number; episode_number: number; title: string | null } | Array<{ season: number; episode_number: number; title: string | null }> | null
}

export default async function LowerThirdsReadyPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: graphics } = await supabase
    .from('graphics')
    .select(
      'id, segment, beat_number, initial_text, approved_text, propresenter_added, episode:episodes(season, episode_number, title)',
    )
    .eq('status', 'approved')
    .order('beat_number', { ascending: true })

  const rows = (graphics ?? []) as ApprovedGraphic[]

  // Group by episode then segment
  const byEpisode = new Map<
    string,
    {
      season: number
      episodeNumber: number
      title: string | null
      segments: Map<string, typeof rows>
    }
  >()

  for (const g of rows) {
    const ep = Array.isArray(g.episode) ? g.episode[0] : g.episode
    if (!ep) continue
    const key = `${ep.season}-${String(ep.episode_number).padStart(3, '0')}`
    if (!byEpisode.has(key)) {
      byEpisode.set(key, {
        season: ep.season,
        episodeNumber: ep.episode_number,
        title: ep.title,
        segments: new Map(),
      })
    }
    const entry = byEpisode.get(key)!
    const segArr = entry.segments.get(g.segment) ?? []
    segArr.push(g)
    entry.segments.set(g.segment, segArr)
  }

  const sortedEpisodes = [...byEpisode.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v)

  return (
    <main className="mx-auto max-w-3xl p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/lower-thirds"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← All episodes
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">Ready for ProPresenter</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approved lower-thirds, grouped by episode and segment.
          </p>
        </div>
      </header>

      <section className="mt-8 space-y-8">
        {sortedEpisodes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No approved lower-thirds yet. Go to an episode to review and approve lower-thirds.
          </p>
        ) : (
          sortedEpisodes.map((ep) => (
            <ReadyOutput
              key={`${ep.season}-${ep.episodeNumber}`}
              season={ep.season}
              episodeNumber={ep.episodeNumber}
              title={ep.title}
              segments={[...ep.segments.entries()].map(([segment, epGraphics]) => ({
                segment,
                graphics: epGraphics,
              }))}
            />
          ))
        )}
      </section>
    </main>
  )
}
