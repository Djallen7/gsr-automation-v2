import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

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
    .limit(50)

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Lower-thirds review</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as {user?.email ?? 'unknown'}. The full review grid arrives in Stage 4.
          </p>
        </div>
        <Link href="/upload" className={buttonVariants()}>
          Upload
        </Link>
      </header>

      <section className="mt-8">
        {graphics && graphics.length > 0 ? (
          <ul className="grid gap-3">
            {graphics.map((g) => {
              const ep = Array.isArray(g.episode) ? g.episode[0] : g.episode
              const label = ep
                ? `S${ep.season}E${ep.episode_number}${ep.title ? ` — ${ep.title}` : ''}`
                : 'No episode'
              return (
                <li
                  key={g.id}
                  className="flex items-center gap-4 rounded-md border p-3 text-sm"
                >
                  <span className="rounded bg-muted px-2 py-1 text-xs uppercase tracking-wide">
                    {g.status}
                  </span>
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-muted-foreground">
                    {g.segment} · beat {g.beat_number ?? '—'}
                  </span>
                  <span className="font-medium">{g.initial_text}</span>
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
