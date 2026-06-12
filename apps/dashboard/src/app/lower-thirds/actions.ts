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
    .from('lower_thirds_variations')
    .select('text_content')
    .eq('graphic_id', graphicId)
    .order('variation_number', { ascending: false })
    .limit(1)
    .single()

  const { error } = await supabase
    .from('production_lower_thirds')
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
    .from('production_lower_thirds')
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
    .from('production_lower_thirds')
    .update({ initial_text: newText })
    .eq('id', graphicId)
  if (error) throw error

  revalidatePath('/lower-thirds')
}

export interface FontOverrides {
  font_family: string | null
  font_size_pt: number | null
  font_color: string | null
}

export async function setFont(graphicId: string, overrides: FontOverrides) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated.')

  // Light validation. Color is free-form (hex or named), size must be positive
  // if set, family is any non-empty string if set.
  if (overrides.font_size_pt !== null && overrides.font_size_pt <= 0) {
    throw new Error('font_size_pt must be a positive integer or null.')
  }
  if (overrides.font_family !== null && overrides.font_family.trim() === '') {
    throw new Error('font_family must be a non-empty string or null.')
  }
  if (overrides.font_color !== null && overrides.font_color.trim() === '') {
    throw new Error('font_color must be a non-empty string or null.')
  }

  const { error } = await supabase
    .from('production_lower_thirds')
    .update({
      font_family: overrides.font_family,
      font_size_pt: overrides.font_size_pt,
      font_color: overrides.font_color,
    })
    .eq('id', graphicId)
  if (error) throw error

  revalidatePath('/lower-thirds')
  revalidatePath('/approved')
}
