import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { MembershipTier } from '@ynklv/types'
import { store } from '../store/seed.js'

export const integrationsRoutes = new Hono()

const verifySchema = z.object({
  address: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  rule: z.object({
    type: z.enum(['member', 'creator', 'architect', 'balance', 'city']),
    minTier: z.number().int().min(0).max(4).optional(),
    minBalanceWei: z.string().optional(),
    city: z.string().optional(),
  }),
})

integrationsRoutes.post(
  '/verify-access',
  zValidator('json', verifySchema),
  (c) => {
    const { address, rule } = c.req.valid('json')
    const member = store.members.get(address.toLowerCase())

    let granted = false
    let reason = ''

    if (!member) {
      granted = false
      reason = 'Address is not an ecosystem member'
    } else {
      switch (rule.type) {
        case 'member':
          granted = member.tier >= MembershipTier.Builder
          reason = granted ? 'Active member' : 'Below Builder tier'
          break
        case 'creator':
          granted = member.tier >= MembershipTier.Creator
          reason = granted ? 'Creator tier or above' : 'Below Creator tier'
          break
        case 'architect':
          granted = member.tier >= MembershipTier.Architect
          reason = granted ? 'Architect tier or above' : 'Below Architect tier'
          break
        case 'balance':
          if (rule.minBalanceWei) {
            granted = BigInt(member.balanceWei) >= BigInt(rule.minBalanceWei)
            reason = granted ? 'Sufficient balance' : 'Insufficient balance'
          }
          break
        default:
          granted = false
          reason = 'Unknown rule type'
      }
    }

    return c.json({
      data: {
        address,
        granted,
        reason,
        checkedAt: new Date().toISOString(),
      },
    })
  },
)
