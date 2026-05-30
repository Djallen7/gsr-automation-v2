'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type EmailColumn =
  | 'interview_confirmation_sent_at'
  | 'day_before_reminder_sent_at'
  | 'zoom_link_sent_at'
  | 'post_shoot_followup_sent_at'
  | 'pre_air_notification_sent_at'
  | 'post_air_youtube_sent_at'

const ALLOWED_COLUMNS = new Set<EmailColumn>([
  'interview_confirmation_sent_at',
  'day_before_reminder_sent_at',
  'zoom_link_sent_at',
  'post_shoot_followup_sent_at',
  'pre_air_notification_sent_at',
  'post_air_youtube_sent_at',
])

export async function markEmailSent(episodeGuestId: string, column: EmailColumn) {
  if (!ALLOWED_COLUMNS.has(column)) throw new Error('Invalid column')

  const supabase = await createClient()
  const { error } = await supabase
    .from('episode_guests')
    .update({ [column]: new Date().toISOString() })
    .eq('id', episodeGuestId)

  if (error) throw new Error(error.message)
  revalidatePath('/workflow')
}

export async function clearEmailSent(episodeGuestId: string, column: EmailColumn) {
  if (!ALLOWED_COLUMNS.has(column)) throw new Error('Invalid column')

  const supabase = await createClient()
  const { error } = await supabase
    .from('episode_guests')
    .update({ [column]: null })
    .eq('id', episodeGuestId)

  if (error) throw new Error(error.message)
  revalidatePath('/workflow')
}
