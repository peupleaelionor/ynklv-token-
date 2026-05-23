import { Hono } from 'hono'
import { store } from '../store/seed.js'
import { apiError } from '../middleware/index.js'

export const rewardsRoutes = new Hono()

rewardsRoutes.get('/history', (c) => {
  const address = c.req.query('address')
  if (!address) return apiError(c, 400, 'MISSING_PARAM', 'address query param required')

  const addr = address.toLowerCase()
  const history = store.rewards.filter((r) => r.address === addr)

  const claimedTotal = history
    .filter((r) => r.type === 'claim')
    .reduce((sum, r) => sum + BigInt(r.amount), 0n)

  const pendingTotal = history
    .filter((r) => r.type === 'allocation')
    .reduce((sum, r) => sum + BigInt(r.amount), 0n) - claimedTotal

  return c.json({
    data: {
      address,
      claimedTotal: claimedTotal.toString(),
      pendingTotal: pendingTotal < 0n ? '0' : pendingTotal.toString(),
      history: history.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1)),
      compliance: {
        notice:
          'Rewards represent ecosystem participation credits, not investment returns. Past participation activity does not predict future allocation.',
      },
    },
  })
})
