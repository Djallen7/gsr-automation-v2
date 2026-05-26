import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { GraphicCard } from './graphic-card'

interface EpisodeJoin {
  season: number
  episode_number: number
  title: string | null
}

interface GraphicRow {
  id: string
  segment: string
  beat_number: number | null
  initial_text: string
  status: string
  current_image_url: string
  episode: EpisodeJoin | EpisodeJoin[] | null
}

export default async function LowerThirdsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: graphics } = await supabase
    .from('graphics')
    .select(
      `id, segment, beat_number, initial_text, status, current_image_url,
       episode:episodes(season, episode_number, title)`,
    )
    .order('uploaded_at', { ascending: false })
    .limit(100)

  const rows = (graphics ?? []) as GraphicRow[]

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Lower-thirds review</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as {user?.email ?? 'unknown'}.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/approved" className={buttonVariants({ variant: 'outline' })}>
            Approved queue
          </Link>
          <Link href="/upload" className={buttonVariants()}>
            Upload
          </Link>
        </div>
      </header>

      <section className="mt-8">
        {rows.length > 0 ? (
          <ul className="grid gap-3">
            {rows.map((g) => {
              const ep = Array.isArray(g.episode) ? g.episode[0] : g.episode
              const label = ep
                ? `S${ep.season}E${ep.episode_number}${ep.title ? ` — ${ep.title}` : ''}`
                : 'No episode'
              return (
                <li key={g.id}>
                  <GraphicCard
                    id={g.id}
                    segment={g.segment}
                    beatNumber={g.beat_number}
                    initialText={g.initial_text}
                    status={g.status}
                    currentImageUrl={g.current_image_url}
                    episodeLabel={label}
                  />
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No lower-thirds uploaded yet. Hit Upload to add the first one.
          </p>
        )}
      </section>
    </main>
  )
}
