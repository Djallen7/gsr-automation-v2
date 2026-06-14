import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { EpisodeWorkspace, type GraphicRow } from './episode-workspace'

export default async function EpisodeWorkspacePage({
  params,
}: {
  params: Promise<{ episode_id: string }>
}) {
  const { episode_id } = await params
  const supabase = await createClient()

  const { data: episode, error } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title')
    .eq('id', episode_id)
    .single()

  if (error || !episode) notFound()

  const [scriptsResult, graphicsResult] = await Promise.all([
    supabase.from('scripts').select('segment, script_text').eq('episode_id', episode_id),
    supabase
      .from('production_lower_thirds')
      .select(
        'id, segment, beat_number, initial_text, status, font_family, font_size_pt, font_color, lower_thirds_variations(variation_number, text_content)',
      )
      .eq('episode_id', episode_id)
      .order('segment', { ascending: true })
      .order('beat_number', { ascending: true }),
  ])

  const label = `S${String(episode.season).padStart(2, '0')} Ep${String(episode.episode_number).padStart(3, '0')}`

  const graphicsRaw = (graphicsResult.data ?? []) as unknown as Array<{
    id: string
    segment: string
    beat_number: number | null
    initial_text: string
    status: string
    font_family: string | null
    font_size_pt: number | null
    font_color: string | null
    lower_thirds_variations: { variation_number: number; text_content: string }[] | null
  }>

  const graphics: GraphicRow[] = graphicsRaw.map((g) => ({
    id: g.id,
    segment: g.segment,
    beat_number: g.beat_number,
    initial_text: g.initial_text,
    status: g.status,
    font_family: g.font_family,
    font_size_pt: g.font_size_pt,
    font_color: g.font_color,
    variations: (g.lower_thirds_variations ?? [])
      .map((v) => ({ variationNumber: v.variation_number, text: v.text_content }))
      .sort((a, b) => a.variationNumber - b.variationNumber),
  }))

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/lower-thirds"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← All episodes
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">
            {label}
            {episode.title ? (
              <span className="font-normal text-muted-foreground"> · {episode.title}</span>
            ) : null}
          </h1>
        </div>
        <Link href="/lower-thirds/ready" className={buttonVariants({ variant: 'outline' })}>
          Ready for ProPresenter
        </Link>
      </header>

      <EpisodeWorkspace
        episode={{
          id: episode.id,
          season: episode.season,
          episode_number: episode.episode_number,
          title: episode.title,
        }}
        scripts={(scriptsResult.data ?? []) as { segment: string; script_text: string }[]}
        graphics={graphics}
      />
    </main>
  )
}
