import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  // Supabase appends type=recovery on password-reset callbacks.
  // Fall back to redirect_to param, then to the dashboard default.
  const redirectTo = type === 'recovery'
    ? '/update-password'
    : (searchParams.get('redirect_to') ?? '/lower-thirds')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=callback_failed`)
}
