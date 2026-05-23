import { Context, MiddlewareHandler, Next } from 'hono'

// ── Rate limiter (in-memory, per-IP sliding window) ──────────────────────────
const rateMap = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 100

export const rateLimiter: MiddlewareHandler = async (c: Context, next: Next) => {
  const ip = c.req.header('x-forwarded-for') ?? c.req.raw.headers.get('cf-connecting-ip') ?? 'unknown'
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    c.header('X-RateLimit-Limit', String(MAX_REQUESTS))
    c.header('X-RateLimit-Remaining', String(MAX_REQUESTS - 1))
  } else {
    entry.count++
    if (entry.count > MAX_REQUESTS) {
      return c.json({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } }, 429)
    }
    c.header('X-RateLimit-Limit', String(MAX_REQUESTS))
    c.header('X-RateLimit-Remaining', String(MAX_REQUESTS - entry.count))
  }

  await next()
}

// ── Structured logger ─────────────────────────────────────────────────────────
export const requestLogger: MiddlewareHandler = async (c: Context, next: Next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  const level = c.res.status >= 500 ? 'error' : c.res.status >= 400 ? 'warn' : 'info'
  console[level](
    JSON.stringify({
      ts: new Date().toISOString(),
      method: c.req.method,
      path: new URL(c.req.url).pathname,
      status: c.res.status,
      ms,
    }),
  )
}

// ── Error handler ─────────────────────────────────────────────────────────────
export function apiError(c: Context, status: 400 | 404 | 422 | 500, code: string, message: string) {
  return c.json({ error: { code, message } }, status)
}
