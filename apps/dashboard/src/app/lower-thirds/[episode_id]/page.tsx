import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { EpisodeWorkspace } from './episode-workspace'

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
}

export default async function EpisodeWorkspacePage({
  params,
}: {
  params: Promise<{ episode_id: string }>
}) {
  const { episode_id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: episode } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title')
    .eq('id', episode_id)
    .single()

  if (!episode) notFound()

  const [{ data: scripts }, { data: graphics }] = await Promise.all([
    supabase
      .from('scripts')
      .select('segment, script_text')
      .eq('episode_id', episode_id),
    supabase
      .from('graphics')
      .select(
        'id, segment, beat_number, initial_text, status, current_image_url, font_family, font_size_pt, font_color',
      )
      .eq('episode_id', episode_id)
      .in('status', ['pending_review', 'approved'])
      .order('beat_number', { ascending: true }),
  ])

  const episodeLabel = `S${String(episode.season).padStart(2, '0')} Ep${String(episode.episode_number).padStart(3, '0')}`

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
          <h1 className="mt-1 text-2xl font-semibold">
            {episodeLabel}
            {episode.title ? ` — ${episode.title}` : ''}
          </h1>
        </div>
        <Link
          href="/lower-thirds/ready"
          className={buttonVariants({ variant: 'outline' })}
        >
          Ready for ProPresenter
        </Link>
      </header>

      <section className="mt-8">
        <EpisodeWorkspace
          episode={episode}
          scripts={scripts ?? []}
          graphics={(graphics ?? []) as GraphicRow[]}
        />
      </section>
    </main>
  )
}
