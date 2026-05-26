import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { PropresenterToggle } from './propresenter-toggle'

interface EpisodeJoin {
  season: number
  episode_number: number
  title: string | null
}

interface ApprovedRow {
  id: string
  segment: string
  beat_number: number | null
  approved_text: string | null
  initial_text: string
  current_image_url: string
  propresenter_added: boolean
  episode: EpisodeJoin | EpisodeJoin[] | null
}

type Grouped = Record<string, Record<string, ApprovedRow[]>>

export default async function ApprovedPage() {
  const supabase = await createClient()

  const { data: graphics } = await supabase
    .from('graphics')
    .select(
      `id, segment, beat_number, approved_text, initial_text, current_image_url,
       propresenter_added,
       episode:episodes(season, episode_number, title)`,
    )
    .eq('status', 'approved')
    .order('beat_number', { ascending: true })

  const rows = (graphics ?? []) as ApprovedRow[]

  const grouped: Grouped = {}
  for (const row of rows) {
    const ep = Array.isArray(row.episode) ? row.episode[0] : row.episode
    const epKey = ep
      ? `S${ep.season}E${ep.episode_number}${ep.title ? ` — ${ep.title}` : ''}`
      : 'No episode'
    if (!grouped[epKey]) grouped[epKey] = {}
    if (!grouped[epKey][row.segment]) grouped[epKey][row.segment] = []
    grouped[epKey][row.segment].push(row)
  }

  const episodeKeys = Object.keys(grouped).sort()

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Approved queue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Walk these into ProPresenter. Tick the box once they&apos;re in.
          </p>
        </div>
        <Link href="/lower-thirds" className={buttonVariants({ variant: 'outline' })}>
          Back to review
        </Link>
      </header>

      <section className="mt-8 flex flex-col gap-8">
        {episodeKeys.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing approved yet. Approve some lower-thirds on the review page first.
          </p>
        ) : (
          episodeKeys.map((epKey) => {
            const segments = grouped[epKey]
            const segmentKeys = Object.keys(segments).sort()
            return (
              <section key={epKey} className="flex flex-col gap-3">
                <h2 className="text-lg font-medium">{epKey}</h2>
                <div className="flex flex-col gap-4 pl-2">
                  {segmentKeys.map((seg) => (
                    <div key={seg} className="flex flex-col gap-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {seg}
                      </h3>
                      <ul className="grid gap-2">
                        {segments[seg].map((g) => (
                          <li
                            key={g.id}
                            className="flex items-center gap-3 rounded border p-2 text-sm"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={g.current_image_url}
                              alt={`LT ${g.segment} beat ${g.beat_number}`}
                              className="h-12 w-24 shrink-0 rounded bg-muted object-cover"
                            />
                            <span className="text-xs text-muted-foreground">
                              beat {g.beat_number ?? '—'}
                            </span>
                            <span className="flex-1 font-medium">
                              {g.approved_text ?? g.initial_text}
                            </span>
                            <PropresenterToggle
                              graphicId={g.id}
                              added={g.propresenter_added}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )
          })
        )}
      </section>
    </main>
  )
}
