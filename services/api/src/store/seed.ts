import { MembershipTier } from '@ynklv/types'

// ─── Token metadata (mirrors on-chain constants) ──────────────────────────────

export interface TokenMetadata {
  /** On-chain ERC-20 name */
  name: string
  /** On-chain ERC-20 symbol / brand name */
  symbol: string
  decimals: number
  /** Fixed total supply in wei (18 decimal places) */
  totalSupplyWei: string
  network: string
  chainId: number
  mintable: false
  /** Utility positioning — never investment language */
  positioning: 'utility'
}

export interface MemberRecord {
  address: string
  tier: MembershipTier
  balanceWei: string
  contributionScore: number
  joinedAt: string
}

export interface RewardRecord {
  id: string
  address: string
  amount: string
  type: 'allocation' | 'claim'
  epochId: string
  reason: string
  timestamp: string
  txHash: string | null
}

export interface CreatorRecord {
  address: string
  name: string
  city: string
  totalEarned: string
  products: number
  verified: boolean
  joinedAt: string
}

export interface SaleRecord {
  id: string
  creator: string
  buyer: string
  productId: string
  amount: string
  creatorShare: string
  treasuryShare: string
  burnedAmount: string
  timestamp: string
  txHash: string
}

export interface ContributionRecord {
  id: string
  address: string
  actionType: string
  points: number
  metadata: Record<string, string>
  timestamp: string
}

export interface TreasurySnapshot {
  timestamp: string
  totalValue: string
  operationalReserve: string
  ecosystemFund: string
  emergencyFund: string
  unallocated: string
  recentBurnTotal: string
}

// In-memory store — replace with Postgres in production.
class MemoryStore {
  members: Map<string, MemberRecord> = new Map()
  rewards: RewardRecord[] = []
  creators: Map<string, CreatorRecord> = new Map()
  sales: SaleRecord[] = []
  contributions: ContributionRecord[] = []

  /** Canonical token identity exposed via the /token/info endpoint. */
  tokenMetadata: TokenMetadata = {
    name: 'KLVCOIN',
    symbol: 'YNKLV',
    decimals: 18,
    totalSupplyWei: '1000000000000000000000000000',
    network: 'Base',
    chainId: 8453,
    mintable: false,
    positioning: 'utility',
  }

  treasury: TreasurySnapshot = {
    timestamp: new Date().toISOString(),
    totalValue: '4200000000000000000000000',
    operationalReserve: '1260000000000000000000000',
    ecosystemFund: '2100000000000000000000000',
    emergencyFund: '420000000000000000000000',
    unallocated: '420000000000000000000000',
    recentBurnTotal: '150000000000000000000',
  }

  constructor() {
    this._seed()
  }

  private _seed() {
    const members: MemberRecord[] = [
      {
        address: '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0',
        tier: MembershipTier.Guardian,
        balanceWei: '12000000000000000000000',
        contributionScore: 3200,
        joinedAt: '2024-01-15T00:00:00Z',
      },
      {
        address: '0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1',
        tier: MembershipTier.Architect,
        balanceWei: '3000000000000000000000',
        contributionScore: 1450,
        joinedAt: '2024-02-20T00:00:00Z',
      },
      {
        address: '0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2',
        tier: MembershipTier.Creator,
        balanceWei: '600000000000000000000',
        contributionScore: 720,
        joinedAt: '2024-03-10T00:00:00Z',
      },
      {
        address: '0xD4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3',
        tier: MembershipTier.Builder,
        balanceWei: '120000000000000000000',
        contributionScore: 210,
        joinedAt: '2024-04-05T00:00:00Z',
      },
      {
        address: '0xE5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2E3f4',
        tier: MembershipTier.Observer,
        balanceWei: '5000000000000000000',
        contributionScore: 0,
        joinedAt: '2024-05-01T00:00:00Z',
      },
    ]

    for (const m of members) {
      this.members.set(m.address.toLowerCase(), m)
    }

    const creators: CreatorRecord[] = [
      {
        address: '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0'.toLowerCase(),
        name: 'Amara Diallo',
        city: 'Dakar',
        totalEarned: '9450000000000000000000',
        products: 12,
        verified: true,
        joinedAt: '2024-01-15T00:00:00Z',
      },
      {
        address: '0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2'.toLowerCase(),
        name: 'Kofi Asante',
        city: 'Accra',
        totalEarned: '2340000000000000000000',
        products: 7,
        verified: true,
        joinedAt: '2024-03-10T00:00:00Z',
      },
    ]

    for (const c of creators) {
      this.creators.set(c.address, c)
    }

    this.rewards = [
      {
        id: 'rwd-001',
        address: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
        amount: '500000000000000000000',
        type: 'allocation',
        epochId: 'epoch-2024-q2',
        reason: 'creation.publish',
        timestamp: '2024-06-01T12:00:00Z',
        txHash: '0xabc123',
      },
      {
        id: 'rwd-002',
        address: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
        amount: '500000000000000000000',
        type: 'claim',
        epochId: 'epoch-2024-q2',
        reason: 'creation.publish',
        timestamp: '2024-06-15T09:30:00Z',
        txHash: '0xdef456',
      },
    ]

    this.contributions = [
      {
        id: 'con-001',
        address: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
        actionType: 'creation.publish',
        points: 100,
        metadata: { productId: 'prod-1' },
        timestamp: '2024-06-01T10:00:00Z',
      },
      {
        id: 'con-002',
        address: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
        actionType: 'governance.vote',
        points: 50,
        metadata: { proposalId: 'prop-1' },
        timestamp: '2024-06-10T14:00:00Z',
      },
    ]

    this.sales = [
      {
        id: 'sale-001',
        creator: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
        buyer: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
        productId: 'prod-1',
        amount: '100000000000000000000',
        creatorShare: '90000000000000000000',
        treasuryShare: '8500000000000000000',
        burnedAmount: '1500000000000000000',
        timestamp: '2024-06-05T16:20:00Z',
        txHash: '0xghi789',
      },
    ]
  }
}

export const store = new MemoryStore()
