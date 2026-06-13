import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

interface EpisodeRow {
  id: string
  season: number
  episode_number: number
  title: string | null
  scripts: { segment: string }[] | null
  production_lower_thirds: { status: string }[] | null
}

export default async function LowerThirdsPage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const email = session?.user.email ?? 'unknown'

  const { data: episodes } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title, scripts(segment), production_lower_thirds(status)')
    .order('episode_number', { ascending: true })

  const rows = (episodes ?? []) as EpisodeRow[]

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Season 3 — Lower-thirds</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/lower-thirds/ready" className={buttonVariants({ variant: 'outline' })}>
            Ready for ProPresenter
          </Link>
          <Link href="/approved" className={buttonVariants({ variant: 'outline' })}>
            Approved queue
          </Link>
          <Link href="/import" className={buttonVariants({ variant: 'outline' })}>
            Import JSON
          </Link>
        </div>
      </header>

      <section className="mt-8">
        <ul className="divide-y rounded-md border">
          {rows.map((ep) => {
            const label = `S${String(ep.season).padStart(2, '0')} Ep${String(ep.episode_number).padStart(3, '0')}`
            const scriptCount = ep.scripts?.length ?? 0
            const pendingCount = ep.production_lower_thirds?.filter((g) => g.status === 'pending_review').length ?? 0
            const approvedCount = ep.production_lower_thirds?.filter((g) => g.status === 'approved').length ?? 0
            const isEmpty = scriptCount === 0 && pendingCount === 0 && approvedCount === 0

            return (
              <li key={ep.id}>
                <Link
                  href={`/lower-thirds/${ep.id}`}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <span className="w-24 shrink-0 font-mono text-sm font-medium">{label}</span>
                  <span className="flex-1 truncate text-sm text-muted-foreground">
                    {ep.title ?? <em>No title</em>}
                  </span>
                  <div className="flex shrink-0 gap-1.5">
                    {scriptCount > 0 && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        {scriptCount}/12 scripts
                      </span>
                    )}
                    {pendingCount > 0 && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        {pendingCount} pending
                      </span>
                    )}
                    {approvedCount > 0 && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        {approvedCount} approved
                      </span>
                    )}
                    {isEmpty && (
                      <span className="text-xs text-muted-foreground">empty</span>
                    )}
                  </div>
                  <span className="shrink-0 text-muted-foreground">›</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
