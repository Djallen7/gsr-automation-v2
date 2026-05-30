import { createClient } from '@/lib/supabase/server'
import { EpisodeForm, type EpisodeRow } from './episode-form'

const STATUS_BADGE: Record<string, string> = {
  planned: 'bg-muted text-muted-foreground',
  in_prep: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  shot: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  in_post: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  scheduled: 'bg-green-500/10 text-green-600 dark:text-green-400',
  aired: 'bg-muted/60 text-muted-foreground',
}

const STATUS_LABEL: Record<string, string> = {
  planned: 'Planned',
  in_prep: 'In Prep',
  shot: 'Shot',
  in_post: 'In Post',
  scheduled: 'Scheduled',
  aired: 'Aired',
}

export default async function EpisodesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('episodes')
    .select(
      `id, title, season, episode_number, production_status,
       shoot_date, air_date, rc_rundown_id, youtube_url, rumble_url, notes`,
    )
    .order('season', { ascending: false })
    .order('episode_number', { ascending: false })

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-8 py-8">
        <p className="text-sm text-destructive">Failed to load episodes: {error.message}</p>
      </main>
    )
  }

  const episodes = (data ?? []) as EpisodeRow[]

  return (
    <main className="mx-auto max-w-5xl px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Episodes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {episodes.length} episode{episodes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <EpisodeForm />
      </div>

      {episodes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No episodes yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Episode</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Shoot</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Air</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">RC&nbsp;ID</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {episodes.map((ep) => (
                <tr key={ep.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="font-medium">
                      {ep.season != null && ep.episode_number != null
                        ? `S${ep.season}E${String(ep.episode_number).padStart(2, '0')}`
                        : '—'}
                    </div>
                    {ep.title && (
                      <div className="text-xs text-muted-foreground">{ep.title}</div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        STATUS_BADGE[ep.production_status] ?? 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {STATUS_LABEL[ep.production_status] ?? ep.production_status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {ep.shoot_date ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {ep.air_date ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {ep.rc_rundown_id ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <EpisodeForm episode={ep} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
