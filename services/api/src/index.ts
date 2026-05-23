import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { rateLimiter, requestLogger } from './middleware/index.js'
import { tokenRoutes } from './routes/token.js'
import { membershipRoutes } from './routes/membership.js'
import { rewardsRoutes } from './routes/rewards.js'
import { creatorRoutes } from './routes/creator.js'
import { treasuryRoutes } from './routes/treasury.js'
import { governanceRoutes } from './routes/governance.js'
import { contributionRoutes } from './routes/contribution.js'
import { checkoutRoutes } from './routes/checkout.js'
import { integrationsRoutes } from './routes/integrations.js'
import { complianceRoutes } from './routes/compliance.js'

const app = new Hono()

app.use('*', cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*' }))
app.use('*', requestLogger)
app.use('/api/*', rateLimiter)

app.get('/health', (c) => c.json({ status: 'ok', service: 'ynklv-api', ts: new Date().toISOString() }))

app.route('/api/token', tokenRoutes)
app.route('/api/membership', membershipRoutes)
app.route('/api/rewards', rewardsRoutes)
app.route('/api/creator', creatorRoutes)
app.route('/api/treasury', treasuryRoutes)
app.route('/api/governance', governanceRoutes)
app.route('/api/contribution', contributionRoutes)
app.route('/api/checkout', checkoutRoutes)
app.route('/api/integrations', integrationsRoutes)
app.route('/api/compliance', complianceRoutes)

app.notFound((c) => c.json({ error: { code: 'NOT_FOUND', message: 'Route not found' } }, 404))
app.onError((err, c) => {
  console.error(JSON.stringify({ ts: new Date().toISOString(), error: err.message, stack: err.stack }))
  return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, 500)
})

const port = Number(process.env.PORT ?? 3001)
console.log(JSON.stringify({ ts: new Date().toISOString(), msg: `YANKELV API listening on :${port}` }))

export default { port, fetch: app.fetch }
