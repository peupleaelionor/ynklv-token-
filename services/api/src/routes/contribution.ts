import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { store } from '../store/seed.js'
import { apiError } from '../middleware/index.js'

export const contributionRoutes = new Hono()

contributionRoutes.get('/score', (c) => {
  const address = c.req.query('address')
  if (!address) return apiError(c, 400, 'MISSING_PARAM', 'address query param required')

  const member = store.members.get(address.toLowerCase())
  const recentActivity = store.contributions
    .filter((con) => con.address === address.toLowerCase())
    .slice(-10)
    .reverse()

  return c.json({
    data: {
      address,
      score: member?.contributionScore ?? 0,
      recentActivity,
      breakdown: {
        creation: recentActivity.filter((a) => a.actionType.startsWith('creation')).reduce((s, a) => s + a.points, 0),
        governance: recentActivity
          .filter((a) => a.actionType.startsWith('governance'))
          .reduce((s, a) => s + a.points, 0),
        community: recentActivity
          .filter((a) => a.actionType.startsWith('community'))
          .reduce((s, a) => s + a.points, 0),
      },
    },
  })
})

const recordSchema = z.object({
  address: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  actionType: z.enum([
    'creation.publish',
    'creation.sale',
    'governance.vote',
    'governance.propose',
    'academy.complete',
    'community.referral',
    'membership.mint',
    'membership.upgrade',
    'hold.checkpoint',
  ]),
  points: z.number().int().positive().max(10000),
  metadata: z.record(z.string()).optional(),
})

contributionRoutes.post(
  '/record',
  zValidator('json', recordSchema),
  (c) => {
    const body = c.req.valid('json')
    const id = `con-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const record = {
      id,
      address: body.address.toLowerCase(),
      actionType: body.actionType,
      points: body.points,
      metadata: body.metadata ?? {},
      timestamp: new Date().toISOString(),
    }

    store.contributions.push(record)

    const member = store.members.get(body.address.toLowerCase())
    if (member) {
      member.contributionScore += body.points
    }

    return c.json({ data: record }, 201)
  },
)
