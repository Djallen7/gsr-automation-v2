'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function togglePropresenter(graphicId: string): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated.')

  // Atomic flip via SQL RPC — avoids the lost-update race when two
  // operators toggle the same graphic concurrently.
  const { data, error } = await supabase.rpc('toggle_propresenter_added', {
    p_graphic_id: graphicId,
  })
  if (error) throw error
  if (data === null) throw new Error('Graphic not found.')

  revalidatePath('/approved')
  return data as boolean
}
