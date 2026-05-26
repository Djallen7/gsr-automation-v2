'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function approveGraphic(graphicId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated.')

  const { data: latestVariation } = await supabase
    .from('graphics_variations')
    .select('text_content')
    .eq('graphic_id', graphicId)
    .order('variation_number', { ascending: false })
    .limit(1)
    .single()

  const { error } = await supabase
    .from('graphics')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: user.id,
      approved_text: latestVariation?.text_content ?? null,
    })
    .eq('id', graphicId)
  if (error) throw error

  revalidatePath('/lower-thirds')
  revalidatePath('/approved')
}

export async function rejectGraphic(graphicId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated.')

  const { error } = await supabase
    .from('graphics')
    .update({ status: 'rejected' })
    .eq('id', graphicId)
  if (error) throw error

  revalidatePath('/lower-thirds')
}

export async function adoptVariation(graphicId: string, newText: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated.')

  const { error } = await supabase
    .from('graphics')
    .update({ initial_text: newText })
    .eq('id', graphicId)
  if (error) throw error

  revalidatePath('/lower-thirds')
}
