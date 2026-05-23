import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

export const checkoutRoutes = new Hono()

const intentSchema = z.object({
  buyer: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  creator: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  productId: z.string().min(1),
  amountWei: z.string().regex(/^\d+$/),
  method: z.enum(['onchain', 'fiat-onramp', 'stablecoin']).optional().default('onchain'),
})

checkoutRoutes.post(
  '/intent',
  zValidator('json', intentSchema),
  (c) => {
    const body = c.req.valid('json')
    const intent = {
      id: `chk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      buyer: body.buyer.toLowerCase(),
      creator: body.creator.toLowerCase(),
      productId: body.productId,
      amountWei: body.amountWei,
      method: body.method,
      status: 'pending' as const,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      compliance: {
        notice: 'Fiat on-ramp integration requires KYC/AML through licensed providers. See fiatDisclaimer.',
        fiatDisclaimer:
          'Any fiat conversion is processed by licensed, regulated third-party providers. YNKLV Foundation does not operate an exchange.',
      },
    }

    return c.json({ data: intent }, 201)
  },
)
