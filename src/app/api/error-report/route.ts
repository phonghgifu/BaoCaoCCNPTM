import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    // Minimal server-side handling: log and return 204
    // In production you might forward to an external service or DB.
    console.log('[telemetry] error-report', body)
    return NextResponse.json({ received: true }, { status: 201 })
  } catch (err) {
    console.error('[telemetry] error-report failed', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
