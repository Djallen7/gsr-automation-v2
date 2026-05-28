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

  const action = searchParams.get('action')

  if (rundownId) {
    if (action) {
      // Single action probe
      const url = rcUrl(action, { RundownID: rundownId })
      const res = await fetch(url)
      const text = await res.text()
      let parsed: unknown
      try { parsed = JSON.parse(text) } catch { parsed = text }
      return NextResponse.json({ action, rundown_id: rundownId, result: parsed })
    }

    // Probe all likely row/script actions in parallel
    const candidates = ['getRows', 'getRundown', 'getScript', 'getRundownRows', 'getRow', 'getSegments', 'getScripts', 'exportRundown']
    const results: Record<string, unknown> = {}
    await Promise.all(candidates.map(async (a) => {
      const url = rcUrl(a, { RundownID: rundownId })
      const res = await fetch(url)
      const text = await res.text()
      try { results[a] = JSON.parse(text) } catch { results[a] = text }
    }))
    return NextResponse.json(results)
  }

  // Return all rundowns
  const res = await fetch(rcUrl('getRundowns'))
  const data = await res.json()
  return NextResponse.json(data)
}

