import { Hono } from 'hono'
import { store } from '../store/seed.js'

export const treasuryRoutes = new Hono()

treasuryRoutes.get('/overview', (c) => {
  const snap = store.treasury
  return c.json({
    data: {
      ...snap,
      allocation: {
        operationalReservePercent: 30,
        ecosystemFundPercent: 50,
        emergencyFundPercent: 10,
        unallocatedPercent: 10,
      },
      multisig: {
        required: 3,
        total: 5,
        type: 'gnosis-safe',
      },
      health: 'healthy',
    },
  })
})
