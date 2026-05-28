import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { PROMPTS, CATEGORIES, type Category } from './prompts'
import { PromptCard } from './prompt-card'

async function buildGuestRoster(): Promise<string> {
  const supabase = await createClient()

  const { data: guests } = await supabase
    .from('guests')
    .select(
      `first_name, last_name, title, job_title, organization, expertise, is_yec,
       episode_guests(filming_datetime, booking_status, episode:episodes(season, episode_number, air_date))`,
    )
    .order('last_name')

  if (!guests || guests.length === 0) {
    return '(No guests in Supabase yet — add guests via the database to populate this list.)'
  }

  const lines = guests.map((g) => {
    const name = [g.title, g.first_name, g.last_name].filter(Boolean).join(' ')
    const org = [g.job_title, g.organization].filter(Boolean).join(' | ')
    const expertise = g.expertise ? ` | ${g.expertise}` : ''
    const stance = g.is_yec === true ? ' | YEC' : g.is_yec === false ? ' | non-YEC' : ''

    type EpGuest = {
      filming_datetime: string | null
      booking_status: string
      episode: { season: number; episode_number: number; air_date: string | null }[] | null
    }
    const appearances = ((g.episode_guests as unknown as EpGuest[]) ?? [])

    const aired = appearances
      .filter((eg) => eg.booking_status === 'aired' && eg.episode)
      .sort((a, b) => {
        const epA = Array.isArray(a.episode) ? a.episode[0] : null
        const epB = Array.isArray(b.episode) ? b.episode[0] : null
        const da = epA?.air_date ?? a.filming_datetime ?? ''
        const db = epB?.air_date ?? b.filming_datetime ?? ''
        return db.localeCompare(da)
      })

    const firstEp = Array.isArray(aired[0]?.episode) ? aired[0].episode[0] : null
    const lastAir = firstEp
      ? ` | last aired S${firstEp.season}E${firstEp.episode_number}${firstEp.air_date ? ` (${firstEp.air_date})` : ''}`
      : ''

    return `- ${name}${org ? ` | ${org}` : ''}${expertise}${stance}${lastAir}`
  })

  return lines.join('\n')
}

export default async function ToolkitPage() {
  const roster = await buildGuestRoster()
  const today = new Date().toISOString().split('T')[0]

  const promptsWithData = PROMPTS.map((p) => {
    if (!p.liveData) return p
    const text = p.text
      .replace('{DATE}', today)
      .replace('{GUEST_ROSTER_INJECTED_BY_TOOLKIT}', roster)
    return { ...p, text }
  })

  const byCategory = CATEGORIES.reduce<Record<Category, typeof PROMPTS>>(
    (acc, cat) => {
      acc[cat] = promptsWithData.filter((p) => p.category === cat)
      return acc
    },
    {} as Record<Category, typeof PROMPTS>,
  )

  return (
    <main className="mx-auto max-w-3xl p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Prompt Toolkit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            20 production-grounded AI prompts for GSR workflows. Copy and paste into Claude or ChatGPT.
          </p>
        </div>
        <Link href="/lower-thirds" className={buttonVariants({ variant: 'outline' })}>
          Lower Thirds
        </Link>
      </header>

      <nav className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
            className="rounded-full border px-3 py-1 text-xs font-medium hover:bg-accent transition-colors"
          >
            {cat} ({byCategory[cat].length})
          </a>
        ))}
      </nav>

      <div className="mt-8 flex flex-col gap-10">
        {CATEGORIES.map((cat) => {
          const catPrompts = byCategory[cat]
          if (catPrompts.length === 0) return null
          return (
            <section key={cat} id={cat.toLowerCase().replace(/\s+/g, '-')}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {cat}
              </h2>
              <div className="flex flex-col gap-3">
                {catPrompts.map((p) => (
                  <PromptCard key={p.id} prompt={p} />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <footer className="mt-12 text-xs text-muted-foreground">
        Source: <code>docs/PROMPT_LIBRARY.md</code> — update prompts there, then redeploy.
      </footer>
    </main>
  )
}
