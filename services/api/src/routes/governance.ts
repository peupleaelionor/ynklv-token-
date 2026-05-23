import { Hono } from 'hono'

export const governanceRoutes = new Hono()

governanceRoutes.get('/status', (c) => {
  return c.json({
    data: {
      phase: 'foundation',
      description: 'Governance is in the Foundation Phase. Core parameters are set by the Zamani Foundation multisig.',
      activeProposals: 2,
      totalProposals: 14,
      participationRate: 0.68,
      quorumThreshold: 0.1,
      nextEpochAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      phases: [
        { id: 'foundation', label: 'Foundation', status: 'active', description: 'Multisig governance' },
        { id: 'council', label: 'Council', status: 'upcoming', description: 'Elected Guardian council' },
        { id: 'community', label: 'Community', status: 'future', description: 'Full token-holder governance' },
      ],
    },
  })
})
