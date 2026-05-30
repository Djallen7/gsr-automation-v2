'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage(null)

    const supabase = createClient()

    if (mode === 'password') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setStatus('error')
        setErrorMessage(error.message)
        return
      }
      router.push('/lower-thirds')
      return
    }

    const origin = window.location.origin
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
      return
    }

    setStatus('sent')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>GSR Dashboard</CardTitle>
          <CardDescription>
            {mode === 'password' ? 'Sign in with your password.' : 'Sign in with a magic link.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'sent' ? (
            <p className="text-sm">
              Check <span className="font-medium">{email}</span> for your sign-in link.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@davidrives.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {mode === 'password' && (
                <Input
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
              <Button type="submit" disabled={status === 'sending'}>
                {status === 'sending'
                  ? 'Signing in…'
                  : mode === 'password'
                    ? 'Sign in'
                    : 'Send magic link'}
              </Button>
              {status === 'error' && errorMessage ? (
                <p className="text-sm text-destructive">{errorMessage}</p>
              ) : null}
              <button
                type="button"
                onClick={() => { setMode(mode === 'password' ? 'magic' : 'password'); setStatus('idle'); setErrorMessage(null) }}
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                {mode === 'password' ? 'Use magic link instead' : 'Use password instead'}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

