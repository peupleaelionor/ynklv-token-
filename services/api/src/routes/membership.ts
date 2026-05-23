import { Hono } from 'hono'
import { MembershipTier } from '@ynklv/types'
import { store } from '../store/seed.js'
import { apiError } from '../middleware/index.js'

export const membershipRoutes = new Hono()

const TIER_NAMES: Record<MembershipTier, string> = {
  [MembershipTier.Observer]: 'Observer',
  [MembershipTier.Builder]: 'Builder',
  [MembershipTier.Creator]: 'Creator',
  [MembershipTier.Architect]: 'Architect',
  [MembershipTier.Guardian]: 'Guardian',
}

membershipRoutes.get('/status', (c) => {
  const address = c.req.query('address')
  if (!address) return apiError(c, 400, 'MISSING_PARAM', 'address query param required')

  const member = store.members.get(address.toLowerCase())
  if (!member) {
    return c.json({
      data: {
        address,
        tier: MembershipTier.Observer,
        tierName: 'Observer',
        contributionScore: 0,
        isMember: false,
        eligibleForUpgrade: false,
      },
    })
  }

  const nextTier = member.tier < MembershipTier.Guardian ? member.tier + 1 : null

  return c.json({
    data: {
      address,
      tier: member.tier,
      tierName: TIER_NAMES[member.tier],
      contributionScore: member.contributionScore,
      isMember: member.tier > MembershipTier.Observer,
      joinedAt: member.joinedAt,
      nextTier: nextTier !== null ? { tier: nextTier, name: TIER_NAMES[nextTier as MembershipTier] } : null,
      eligibleForUpgrade: member.tier < MembershipTier.Guardian,
    },
  })
})
