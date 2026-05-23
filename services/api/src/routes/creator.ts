import { Hono } from 'hono'
import { store } from '../store/seed.js'
import { apiError } from '../middleware/index.js'

export const creatorRoutes = new Hono()

creatorRoutes.get('/profile', (c) => {
  const address = c.req.query('address')
  if (!address) return apiError(c, 400, 'MISSING_PARAM', 'address query param required')

  const creator = store.creators.get(address.toLowerCase())
  if (!creator) return apiError(c, 404, 'NOT_FOUND', 'Creator profile not found')

  const sales = store.sales.filter((s) => s.creator === address.toLowerCase())
  const recentSales = sales.slice(-5).reverse()

  return c.json({
    data: {
      ...creator,
      recentSales,
      economics: {
        creatorShareBps: 9000,
        description: '90% of each transaction goes directly to the creator.',
      },
    },
  })
})
