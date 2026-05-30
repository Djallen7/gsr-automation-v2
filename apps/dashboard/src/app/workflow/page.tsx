import { createClient } from '@/lib/supabase/server'
import { EmailRow } from './email-row'

interface WorkflowRow {
  episode_id: string
  season: number
  episode_number: number
  episode_title: string | null
  air_date: string | null
  shoot_date: string | null
  production_status: string
  zoom_link_due: string | null
  post_shoot_followup_due: string | null
  pre_air_notification_due: string | null
  post_air_youtube_due: string | null
  guest1_first_name: string | null
  guest1_last_name: string | null
  guest1_email: string | null
  guest1_confirmation_sent: string | null
  guest1_day_before_sent: string | null
  guest1_zoom_link_sent: string | null
  guest1_post_shoot_sent: string | null
  guest1_pre_air_sent: string | null
  guest1_youtube_sent: string | null
  guest2_first_name: string | null
  guest2_last_name: string | null
  guest2_email: string | null
  guest2_confirmation_sent: string | null
  guest2_day_before_sent: string | null
  guest2_zoom_link_sent: string | null
  guest2_post_shoot_sent: string | null
  guest2_pre_air_sent: string | null
  guest2_youtube_sent: string | null
}

interface EpGuestId {
  id: string
  episode_id: string
  segment: string
}

const STATUS_BADGE: Record<string, string> = {
  planned: 'bg-muted text-muted-foreground',
  in_prep: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  shot: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  in_post: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  scheduled: 'bg-green-500/10 text-green-600 dark:text-green-400',
  aired: 'bg-muted text-muted-foreground',
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    planned: 'Planned',
    in_prep: 'In Prep',
    shot: 'Shot',
    in_post: 'In Post',
    scheduled: 'Scheduled',
    aired: 'Aired',
  }
  return map[s] ?? s
}

export default async function WorkflowPage() {
  const supabase = await createClient()

  const [{ data: viewData, error: viewError }, { data: egData }] = await Promise.all([
    supabase
      .from('v_episode_workflow')
      .select('*')
      .order('season', { ascending: false })
      .order('episode_number', { ascending: false }),
    supabase
      .from('episode_guests')
      .select('id, episode_id, segment'),
  ])

  if (viewError) {
    return (
      <main className="mx-auto max-w-5xl px-8 py-8">
        <p className="text-sm text-destructive">Failed to load workflow: {viewError.message}</p>
      </main>
    )
  }

  const rows = (viewData ?? []) as WorkflowRow[]
  const egIds = (egData ?? []) as EpGuestId[]

  // Build lookup: episode_id + segment → episode_guests.id
  const egMap = new Map<string, string>()
  for (const eg of egIds) {
    egMap.set(`${eg.episode_id}:${eg.segment}`, eg.id)
  }

  return (
    <main className="mx-auto max-w-5xl px-8 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Email Workflow</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track guest communications across all episodes
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No episodes yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => {
            const eg1Id = egMap.get(`${row.episode_id}:interview_1`)
            const eg2Id = egMap.get(`${row.episode_id}:interview_2`)
            const hasGuest1 = row.guest1_first_name !== null
            const hasGuest2 = row.guest2_first_name !== null

            return (
              <div
                key={row.episode_id}
                className="rounded-lg border border-border bg-card p-4"
              >
                {/* Episode header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-semibold text-sm">
                      S{row.season}E{String(row.episode_number).padStart(2, '0')}
                    </span>
                    {row.episode_title && (
                      <span className="text-sm text-muted-foreground ml-2">
                        {row.episode_title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        STATUS_BADGE[row.production_status] ?? 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {statusLabel(row.production_status)}
                    </span>
                    {row.shoot_date && <span>Shoot: {row.shoot_date}</span>}
                    {row.air_date && <span>Air: {row.air_date}</span>}
                  </div>
                </div>

                {/* Guests */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Guest 1 */}
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      Interview 1
                    </p>
                    {hasGuest1 && eg1Id ? (
                      <>
                        <p className="text-sm font-medium mb-2">
                          {row.guest1_first_name} {row.guest1_last_name}
                          {row.guest1_email && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({row.guest1_email})
                            </span>
                          )}
                        </p>
                        <div className="divide-y divide-border/40">
                          <EmailRow
                            episodeGuestId={eg1Id}
                            column="interview_confirmation_sent_at"
                            label="Confirmation"
                            dueDate={null}
                            sentAt={row.guest1_confirmation_sent}
                          />
                          <EmailRow
                            episodeGuestId={eg1Id}
                            column="zoom_link_sent_at"
                            label="Zoom Link"
                            dueDate={row.zoom_link_due}
                            sentAt={row.guest1_zoom_link_sent}
                          />
                          <EmailRow
                            episodeGuestId={eg1Id}
                            column="day_before_reminder_sent_at"
                            label="Day-Before Reminder"
                            dueDate={row.pre_air_notification_due}
                            sentAt={row.guest1_day_before_sent}
                          />
                          <EmailRow
                            episodeGuestId={eg1Id}
                            column="post_shoot_followup_sent_at"
                            label="Post-Shoot Follow-Up"
                            dueDate={row.post_shoot_followup_due}
                            sentAt={row.guest1_post_shoot_sent}
                          />
                          <EmailRow
                            episodeGuestId={eg1Id}
                            column="pre_air_notification_sent_at"
                            label="Pre-Air Notice"
                            dueDate={row.pre_air_notification_due}
                            sentAt={row.guest1_pre_air_sent}
                          />
                          <EmailRow
                            episodeGuestId={eg1Id}
                            column="post_air_youtube_sent_at"
                            label="Post-Air YouTube"
                            dueDate={row.post_air_youtube_due}
                            sentAt={row.guest1_youtube_sent}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No guest booked</p>
                    )}
                  </div>

                  {/* Guest 2 */}
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      Interview 2
                    </p>
                    {hasGuest2 && eg2Id ? (
                      <>
                        <p className="text-sm font-medium mb-2">
                          {row.guest2_first_name} {row.guest2_last_name}
                          {row.guest2_email && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({row.guest2_email})
                            </span>
                          )}
                        </p>
                        <div className="divide-y divide-border/40">
                          <EmailRow
                            episodeGuestId={eg2Id}
                            column="interview_confirmation_sent_at"
                            label="Confirmation"
                            dueDate={null}
                            sentAt={row.guest2_confirmation_sent}
                          />
                          <EmailRow
                            episodeGuestId={eg2Id}
                            column="zoom_link_sent_at"
                            label="Zoom Link"
                            dueDate={row.zoom_link_due}
                            sentAt={row.guest2_zoom_link_sent}
                          />
                          <EmailRow
                            episodeGuestId={eg2Id}
                            column="day_before_reminder_sent_at"
                            label="Day-Before Reminder"
                            dueDate={row.pre_air_notification_due}
                            sentAt={row.guest2_day_before_sent}
                          />
                          <EmailRow
                            episodeGuestId={eg2Id}
                            column="post_shoot_followup_sent_at"
                            label="Post-Shoot Follow-Up"
                            dueDate={row.post_shoot_followup_due}
                            sentAt={row.guest2_post_shoot_sent}
                          />
                          <EmailRow
                            episodeGuestId={eg2Id}
                            column="pre_air_notification_sent_at"
                            label="Pre-Air Notice"
                            dueDate={row.pre_air_notification_due}
                            sentAt={row.guest2_pre_air_sent}
                          />
                          <EmailRow
                            episodeGuestId={eg2Id}
                            column="post_air_youtube_sent_at"
                            label="Post-Air YouTube"
                            dueDate={row.post_air_youtube_due}
                            sentAt={row.guest2_youtube_sent}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No guest booked</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
