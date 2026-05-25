// Lightweight telemetry helper
export async function reportError(err: unknown, meta?: Record<string, unknown>) {
  try {
    let errStr: string
    try {
      if (!err) errStr = 'unknown error'
      else if (err instanceof Error) errStr = err.message
      else if (typeof err === 'object') {
        const seen = new WeakSet()
        errStr = JSON.stringify(err, function (_k, v) {
          if (typeof v === 'object' && v !== null) {
            if (seen.has(v)) return '[Circular]'
            seen.add(v)
          }
          return v
        })
      } else errStr = String(err)
    } catch {
      try {
        errStr = String(err)
      } catch {
        errStr = 'unserializable error'
      }
    }

    const payload = {
      error: errStr,
      meta: meta ?? {},
      url: typeof window !== 'undefined' ? window.location.href : null,
      ts: new Date().toISOString(),
    }

    // Fire-and-forget; don't block UI. Use keepalive when available.
    try {
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        const b = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        navigator.sendBeacon('/api/error-report', b)
      } else {
        fetch('/api/error-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {})
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.warn('Telemetry report failed', error)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.warn('Telemetry internal error', error)
  }
}

export default reportError
