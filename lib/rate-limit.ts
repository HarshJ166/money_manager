const WINDOW_MS = 60_000
const MAX_REQUESTS = 120

type Bucket = { count: number; expires: number }
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, max = MAX_REQUESTS, windowMs = WINDOW_MS) {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.expires < now) {
    buckets.set(key, { count: 1, expires: now + windowMs })
    return { ok: true, remaining: max - 1 }
  }
  if (bucket.count >= max) return { ok: false, remaining: 0 }
  bucket.count++
  return { ok: true, remaining: max - bucket.count }
}
