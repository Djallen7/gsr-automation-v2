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
  font_family: string | null
  font_size_pt: number | null
  font_color: string | null
  episode: EpisodeJoin | EpisodeJoin[] | null
}

export default async function LowerThirdsPage() {
  const supabase = await createClient()
  // Middleware already verified the session — use getSession() for the
  // email display so we don't pay a JWT-verification round trip per page load.
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const email = session?.user.email ?? 'unknown'

  const { data: graphics } = await supabase
    .from('graphics')
    .select(
      `id, segment, beat_number, initial_text, status, current_image_url,
       font_family, font_size_pt, font_color,
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
            Signed in as {email}.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/toolkit" className={buttonVariants({ variant: 'ghost' })}>
            Prompt toolkit
          </Link>
          <Link href="/approved" className={buttonVariants({ variant: 'outline' })}>
            Approved queue
          </Link>
          <Link href="/import" className={buttonVariants()}>
            Import from script
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
                    fontFamily={g.font_family}
                    fontSizePt={g.font_size_pt}
                    fontColor={g.font_color}
                  />
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No lower-thirds pending review. Use{' '}
            <Link href="/import" className="underline">
              Import from script
            </Link>{' '}
            to ingest text from a Claude-extracted JSON file.
          </p>
        )}
      </section>
    </main>
  )
}
