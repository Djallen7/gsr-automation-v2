'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Mode = 'password' | 'magic-link' | 'reset-sent' | 'magic-sent'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<Mode>('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePasswordLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/lower-thirds')
    router.refresh()
  }

  async function handleMagicLink(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setMode('magic-sent')
    setLoading(false)
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email first.')
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?redirect_to=/update-password`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setMode('reset-sent')
    setLoading(false)
  }

  if (mode === 'magic-sent') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              Magic link sent to <span className="font-medium text-foreground">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setMode('password')}>
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mode === 'reset-sent') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Reset email sent</CardTitle>
            <CardDescription>
              Check <span className="font-medium text-foreground">{email}</span> for a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setMode('password')}>
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded bg-primary text-[10px] font-bold tracking-widest text-primary-foreground">
            GSR
          </div>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            {mode === 'password'
              ? 'Enter your email and password.'
              : 'Enter your email to receive a magic link.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="flex flex-col gap-3">
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@davidrives.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <button
                  type="button"
                  className="hover:text-foreground underline-offset-4 hover:underline"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  className="hover:text-foreground underline-offset-4 hover:underline"
                  onClick={() => { setMode('magic-link'); setError(null) }}
                >
                  Use magic link
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@davidrives.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send magic link'}
              </Button>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                onClick={() => { setMode('password'); setError(null) }}
              >
                Sign in with password instead
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
