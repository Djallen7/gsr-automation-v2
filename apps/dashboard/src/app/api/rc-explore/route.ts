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
    // Return objects (rows) for a specific rundown
    const res = await fetch(rcUrl('getObjects', { RundownID: rundownId }))
    const data = await res.json()
    return NextResponse.json(data)
  }

  // Return all rundowns
  const res = await fetch(rcUrl('getRundowns'))
  const data = await res.json()
  return NextResponse.json(data)
}
