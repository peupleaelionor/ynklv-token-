import { Hono } from 'hono'
import { store } from '../store/seed.js'
import { apiError } from '../middleware/index.js'

export const tokenRoutes = new Hono()

tokenRoutes.get('/metadata', (c) => {
  return c.json({
    data: {
      name: 'YLVcoin',
      symbol: 'YNKLV',
      decimals: 18,
      totalSupply: '1000000000000000000000000000',
      contractAddress: '0x0000000000000000000000000000000000000000',
      chainId: 8453,
      description: 'YNKLV is a utility token for the Zamani ecosystem — access, participation, and coordination.',
      utility: ['ecosystem access', 'governance participation', 'creator reward settlement', 'tier-gated features'],
      compliance: {
        positioning: 'utility token',
        disclaimer:
          'YNKLV is not an investment product. It does not represent equity, debt, or any promise of financial return.',
      },
    },
  })
})

tokenRoutes.get('/balance', (c) => {
  const address = c.req.query('address')
  if (!address) return apiError(c, 400, 'MISSING_PARAM', 'address query param required')

  const member = store.members.get(address.toLowerCase())
  return c.json({
    data: {
      address,
      balanceWei: member?.balanceWei ?? '0',
      balanceFormatted: member ? (BigInt(member.balanceWei) / BigInt(1e18)).toString() : '0',
    },
  })
})
