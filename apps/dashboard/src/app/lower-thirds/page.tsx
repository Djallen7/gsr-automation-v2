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

  const pending = rows.filter(r => r.status === 'pending_review').length
  const approved = rows.filter(r => r.status === 'approved').length
  const rejected = rows.filter(r => r.status === 'rejected').length

  return (
    <main className="mx-auto max-w-5xl px-8 py-6">
      <header className="flex items-center justify-between gap-4 pb-5 border-b">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Lower-thirds review</h1>
          <div className="mt-1.5 flex items-center gap-3 text-xs">
            {pending > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                {pending} pending
              </span>
            )}
            {approved > 0 && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-800">
                {approved} approved
              </span>
            )}
            {rejected > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-800">
                {rejected} rejected
              </span>
            )}
            {rows.length === 0 && (
              <span className="text-muted-foreground">No items</span>
            )}
          </div>
        </div>
        <Link href="/import" className={buttonVariants({ size: 'sm' })}>
          Import from script
        </Link>
      </header>

      <section className="mt-5">
        {rows.length > 0 ? (
          <ul className="grid gap-2.5">
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
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No lower-thirds pending review.{' '}
              <Link href="/import" className="font-medium text-foreground underline-offset-4 hover:underline">
                Import from script
              </Link>{' '}
              to get started.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
