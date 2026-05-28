import { NextResponse } from 'next/server'

const RC_BASE = 'https://www.rundowncreator.com/davidrives/API.php'

function rcUrl(action: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({
    Action: action,
    APIKey: process.env.RUNDOWN_CREATOR_API_KEY ?? '',
    APIToken: process.env.RUNDOWN_CREATOR_API_TOKEN ?? '',
    ...extra,
  })
  return `${RC_BASE}?${params.toString()}`
}

export async function GET(request: Request) {
  if (!process.env.RUNDOWN_CREATOR_API_KEY || !process.env.RUNDOWN_CREATOR_API_TOKEN) {
    return NextResponse.json({ error: 'RC credentials not set in env.' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const rundownId = searchParams.get('rundown_id')

  if (rundownId) {
    // Try multiple parameter name variants to find the right one
    const variants = ['RundownID', 'Rundown', 'rundown_id', 'ID', 'id']
    const results: Record<string, unknown> = {}

    for (const param of variants) {
      const url = rcUrl('getObjects', { [param]: rundownId })
      const res = await fetch(url)
      const text = await res.text()
      try {
        results[param] = JSON.parse(text)
      } catch {
        results[param] = text
      }
    }

    return NextResponse.json(results)
  }

  // Return all rundowns
  const res = await fetch(rcUrl('getRundowns'))
  const data = await res.json()
  return NextResponse.json(data)
}

