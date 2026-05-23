import { MembershipTier } from '@ynklv/types'

export const SAMPLE_ADDRESS = '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0' as const

export const SAMPLE_MEMBERSHIP = {
  address: SAMPLE_ADDRESS,
  tier: MembershipTier.Creator,
  tierName: 'Creator',
  contributionScore: 720,
  isMember: true,
  joinedAt: '2024-03-10T00:00:00Z',
  nextTier: { tier: MembershipTier.Architect, name: 'Architect' },
  eligibleForUpgrade: true,
}

export const SAMPLE_BALANCE = {
  address: SAMPLE_ADDRESS,
  balanceWei: '600000000000000000000',
  balanceFormatted: '600',
}

export const SAMPLE_REWARDS = {
  address: SAMPLE_ADDRESS,
  claimedTotal: '500000000000000000000',
  pendingTotal: '125000000000000000000',
  history: [
    {
      id: 'rwd-001',
      type: 'allocation' as const,
      amount: '250000000000000000000',
      reason: 'creation.publish',
      epochId: 'epoch-2024-q2',
      timestamp: '2024-06-01T12:00:00Z',
      txHash: '0xabc123',
    },
    {
      id: 'rwd-002',
      type: 'claim' as const,
      amount: '250000000000000000000',
      reason: 'creation.publish',
      epochId: 'epoch-2024-q2',
      timestamp: '2024-06-15T09:30:00Z',
      txHash: '0xdef456',
    },
    {
      id: 'rwd-003',
      type: 'allocation' as const,
      amount: '375000000000000000000',
      reason: 'governance.vote',
      epochId: 'epoch-2024-q3',
      timestamp: '2024-09-01T14:00:00Z',
      txHash: null,
    },
  ],
}

export const SAMPLE_CONTRIBUTION = {
  address: SAMPLE_ADDRESS,
  score: 720,
  breakdown: { creation: 380, governance: 220, community: 120 },
  recentActivity: [
    { id: 'c1', actionType: 'creation.publish', points: 100, timestamp: '2024-09-01T10:00:00Z', metadata: {} },
    { id: 'c2', actionType: 'governance.vote', points: 50, timestamp: '2024-08-28T14:00:00Z', metadata: {} },
    { id: 'c3', actionType: 'community.referral', points: 75, timestamp: '2024-08-15T09:00:00Z', metadata: {} },
  ],
}

export const SAMPLE_ACTIVITY = [
  { type: 'creation.publish', label: 'Published "Afrobeat Stems Vol.3"', timestamp: '2024-09-01T10:00:00Z', amount: null },
  { type: 'governance.vote', label: 'Voted on Proposal #14', timestamp: '2024-08-28T14:00:00Z', amount: null },
  { type: 'membership.upgrade', label: 'Upgraded from Builder → Creator', timestamp: '2024-08-01T00:00:00Z', amount: null },
  { type: 'creation.sale', label: 'Sale — "Mboka Sounds EP"', timestamp: '2024-07-22T16:30:00Z', amount: '90000000000000000000' },
]

export const SAMPLE_TREASURY = {
  totalValue: '4200000000000000000000000',
  operationalReserve: '1260000000000000000000000',
  ecosystemFund: '2100000000000000000000000',
  emergencyFund: '420000000000000000000000',
  unallocated: '420000000000000000000000',
  recentBurnTotal: '150000000000000000000',
  allocation: { operationalReservePercent: 30, ecosystemFundPercent: 50, emergencyFundPercent: 10, unallocatedPercent: 10 },
  multisig: { required: 3, total: 5, type: 'gnosis-safe' },
  health: 'healthy',
}

export const SAMPLE_ECOSYSTEM_METRICS = {
  totalMembers: 4821,
  activeCreators: 312,
  totalTransactions: 18_402,
  totalBurned: '1840000000000000000000',
  cities: ['Dakar', 'Accra', 'Lagos', 'Nairobi', 'Abidjan', 'Kinshasa', 'Paris', 'London'],
  membersByTier: [
    { tier: 'Observer', count: 2100 },
    { tier: 'Builder', count: 1800 },
    { tier: 'Creator', count: 680 },
    { tier: 'Architect', count: 210 },
    { tier: 'Guardian', count: 31 },
  ],
}

export const SAMPLE_ROLES = [
  { address: '0xGov1...', role: 'GOVERNOR_ROLE', assignedAt: '2024-01-01T00:00:00Z' },
  { address: '0xScor1...', role: 'SCORER_ROLE', assignedAt: '2024-01-01T00:00:00Z' },
  { address: '0xPause1...', role: 'PAUSER_ROLE', assignedAt: '2024-01-15T00:00:00Z' },
]
