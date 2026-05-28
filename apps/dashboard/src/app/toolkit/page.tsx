import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { PromptCard } from './prompt-card'

interface EpisodeRef {
  air_date: string | null
}

interface EpisodeGuestRef {
  episode: EpisodeRef | EpisodeRef[] | null
}

interface GuestRow {
  id: string
  first_name: string
  last_name: string
  title: string | null
  expertise_tags: string[] | null
  episode_guests: EpisodeGuestRef[]
}

function getLastAired(g: GuestRow): string | null {
  const dates = g.episode_guests.flatMap(eg => {
    const ep = Array.isArray(eg.episode) ? eg.episode[0] : eg.episode
    return ep?.air_date ? [ep.air_date] : []
  })
  return dates.length ? dates.sort().at(-1)! : null
}

export default async function ToolkitPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('guests')
    .select(
      'id, first_name, last_name, title, expertise_tags, episode_guests(episode:episodes(air_date))',
    )
    .order('last_name', { ascending: true })

  const guests = ((data ?? []) as GuestRow[])
    .map(g => ({ ...g, last_aired: getLastAired(g) }))
    .sort((a, b) => {
      if (!a.last_aired && !b.last_aired) return 0
      if (!a.last_aired) return 1
      if (!b.last_aired) return -1
      return b.last_aired.localeCompare(a.last_aired)
    })

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const guestLines =
    guests.length > 0
      ? guests
          .map(g => {
            const name = [g.title, g.first_name, g.last_name].filter(Boolean).join(' ')
            const tags = g.expertise_tags?.join(', ') || '—'
            const aired = g.last_aired
              ? new Date(g.last_aired).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })
              : 'never aired'
            return `• ${name} — ${tags} — Last aired: ${aired}`
          })
          .join('\n')
      : '(no guests in database yet)'

  const guestResearchPrompt = `You are helping me research guests for Genesis Science Report (GSR), a weekly Christian creation-science TV show hosted by David Rives. Season 3, ~58 min, weekly.

EXISTING GUEST ROSTER (as of ${today}):
Do not suggest anyone who last aired less than 6 months ago unless I explicitly ask.

${guestLines}

GUEST CRITERIA:
- PhD scientists, professors, or published authors in creation science or intelligent design
- Fields: genetics, geology, astronomy, biology, paleontology, archaeology, physics, cosmology
- Must hold a young-earth creationist or intelligent design position
- David Rives is the host — do not suggest him as a guest`

  const youtubeTitlesPrompt = `You are writing YouTube titles for Genesis Science Report (GSR).

RULES — apply every time, no exceptions:
1. Title must be ~30% shorter than the full episode title or description
2. Lead with the most compelling finding or credential — not the guest name alone
3. Keep under 70 characters total
4. No clickbait — audience is Christian / creation-science viewers
5. Plain language: avoid jargon unless it IS the hook (DNA, fossil, Big Bang are fine)
6. Format: [Key claim or hook] | [Guest credential or context]

EXAMPLE: "Ancient DNA Rewrites Human Origins | Dr. Jeanson, Harvard"
AVOID (too long, name-first): "Dr. Nathaniel Jeanson Discusses Mitochondrial DNA Evidence for Recent Human Creation"`

  const lowerThirdsPrompt = `You are writing lower-third graphics text for Genesis Science Report (GSR) ProPresenter templates.

CHARACTER LIMIT — hard rules, check every line before finalizing:
- Minimum: 55 characters per line (shorter looks sparse on screen)
- Maximum: 65 characters per line (longer gets cut off)
- Sweet spot: 58–62 characters
- Spaces count toward the limit

STRUCTURE PER GRAPHIC (2 lines max):
Line 1: Person's name + credential prefix (Dr., etc.) if needed to reach 55 chars
Line 2: Title, role, or key credential

PROCESS: Write the text, count each line, adjust until both lines are 55–65 chars.`

  return (
    <main className="mx-auto max-w-2xl p-8">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Prompt Toolkit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            One-click prompts for recurring Claude tasks.
          </p>
        </div>
        <Link href="/lower-thirds" className={buttonVariants({ variant: 'outline' })}>
          ← Lower thirds
        </Link>
      </header>

      <div className="flex flex-col gap-4">
        <PromptCard
          title="Guest Research"
          description={`${guests.length} guest${guests.length !== 1 ? 's' : ''} in roster — air dates injected live. Paste at the start of any guest research session.`}
          prompt={guestResearchPrompt}
        />
        <PromptCard
          title="YouTube Titles"
          description="30%-shorter rule + format guide. Paste when writing episode titles."
          prompt={youtubeTitlesPrompt}
        />
        <PromptCard
          title="Lower Thirds"
          description="55–65 char limit rules. Paste when generating ProPresenter graphic text."
          prompt={lowerThirdsPrompt}
        />
      </div>
    </main>
  )
}
