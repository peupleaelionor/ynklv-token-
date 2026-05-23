/**
 * @ynklv/types — Shared type definitions for the YNKLV ecosystem.
 *
 * These types are the single source of truth shared across the SDK, API,
 * indexer, dashboard, and integration examples. They describe utility,
 * access, membership, and participation — never investment or yield.
 */

// ─── Primitives ────────────────────────────────────────────────────────────

/** A 0x-prefixed Ethereum address. */
export type Address = `0x${string}`

/** A 0x-prefixed transaction or block hash. */
export type Hash = `0x${string}`

/** An amount of YNKLV expressed in wei (18 decimals), as a decimal string. */
export type TokenAmountWei = string

/** Supported chains in the YNKLV ecosystem. */
export const SUPPORTED_CHAIN_IDS = [8453, 84532] as const
export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

// ─── Membership ──────────────────────────────────────────────────────────────

/**
 * Membership tiers describe ACCESS and PARTICIPATION, not financial return.
 * Tiers are earned through holding + contribution, never sold as an investment.
 */
export enum MembershipTier {
  Observer = 0,
  Builder = 1,
  Creator = 2,
  Architect = 3,
  Guardian = 4,
}

export const MEMBERSHIP_TIER_NAMES: Record<MembershipTier, string> = {
  [MembershipTier.Observer]: 'Observer',
  [MembershipTier.Builder]: 'Builder',
  [MembershipTier.Creator]: 'Creator',
  [MembershipTier.Architect]: 'Architect',
  [MembershipTier.Guardian]: 'Guardian',
}

export interface MembershipStatus {
  address: Address
  tier: MembershipTier
  tierName: string
  /** Minimum YNKLV balance (wei) required to hold the current tier. */
  thresholdWei: TokenAmountWei
  /** Contribution score (EPS) at evaluation time. */
  contributionScore: number
  /** Whether the membership credential (Pass) is soulbound. */
  isSoulbound: boolean
  /** Unix seconds of first entry into the ecosystem. */
  genesisTimestamp: number
  /** Number of Cultural Epochs the member has lived through. */
  epochsLived: number
}

// ─── Token-gating ──────────────────────────────────────────────────────────

export interface TokenGateRule {
  /** Minimum YNKLV balance (wei) required. */
  minBalanceWei?: TokenAmountWei
  /** Minimum membership tier required. */
  minTier?: MembershipTier
  /** Minimum contribution score (EPS) required. */
  minContributionScore?: number
  /** Optional: require a specific chartered city. */
  requireCity?: string
}

export interface TokenGateResult {
  granted: boolean
  rule: TokenGateRule
  /** Human-readable reason when access is denied. */
  reason?: string
  /** The evaluated status used to make the decision. */
  evaluated: {
    balanceWei: TokenAmountWei
    tier: MembershipTier
    contributionScore: number
    city?: string
  }
}

// ─── Contribution / Reputation (Sankofa) ─────────────────────────────────────

/**
 * The Ecosystem Participation Score is the reputation primitive of the
 * Sankofa layer. It rewards genuine contribution across three dimensions and
 * is non-transferable by design — it is carried, not bought.
 */
export interface ContributionScore {
  address: Address
  total: number
  holdScore: number
  activityScore: number
  communityScore: number
  tier: MembershipTier
  nextTier: MembershipTier | null
  /** 0..1 progress toward the next tier. */
  progressToNext: number
  lastUpdated: string
}

/** A recorded, contribution-bearing ecosystem action. */
export interface EcosystemAction {
  id: string
  address: Address
  type: EcosystemActionType
  /** Contribution points awarded for this action. */
  points: number
  metadata?: Record<string, string | number | boolean>
  txHash?: Hash
  createdAt: string
}

export type EcosystemActionType =
  | 'creation.publish'
  | 'creation.sale'
  | 'governance.vote'
  | 'governance.propose'
  | 'academy.complete'
  | 'community.referral'
  | 'membership.mint'
  | 'membership.upgrade'
  | 'hold.checkpoint'

// ─── Rewards (utility, not yield) ────────────────────────────────────────────

/**
 * Rewards recognize contribution and participation. They are NOT yield,
 * NOT interest, and NOT a return on investment. Distribution is discretionary,
 * governed, and capped — never an automated APY.
 */
export interface RewardClaim {
  id: string
  address: Address
  amountWei: TokenAmountWei
  reason: string
  /** Reference to the action or epoch that earned this reward. */
  earnedFor: string
  claimableAt: string
  claimedAt?: string
  txHash?: Hash
}

export interface RewardHistory {
  address: Address
  totalEarnedWei: TokenAmountWei
  totalClaimedWei: TokenAmountWei
  claims: RewardClaim[]
}

// ─── Creator (Soko) ───────────────────────────────────────────────────────────

export interface CreatorProfile {
  address: Address
  ynklvName?: string
  displayName?: string
  tier: MembershipTier
  totalEarnedWei: TokenAmountWei
  productsCount: number
  salesCount: number
  /** The hardcoded creator share in basis points (9000 = 90%). */
  creatorShareBps: number
}

// ─── Treasury (Baraka) ────────────────────────────────────────────────────────

export interface TreasuryAsset {
  symbol: string
  amountWei: TokenAmountWei
  valueUsd: number
}

export interface TreasuryOverview {
  totalValueUsd: number
  assets: TreasuryAsset[]
  runwayMonths: number
  monthlyBurnUsd: number
  /** Always public, always governed by the Indaba. */
  lastUpdated: string
}

// ─── Governance (The Indaba) ──────────────────────────────────────────────────

export type ProposalStatus =
  | 'pending'
  | 'active'
  | 'passed'
  | 'failed'
  | 'queued'
  | 'executed'
  | 'cancelled'

export interface GovernanceStatus {
  phase: 'foundation' | 'council' | 'indaba'
  activeProposals: number
  totalProposals: number
  quorumBps: number
  timelockSeconds: number
}

// ─── Token metadata ────────────────────────────────────────────────────────

export interface TokenMetadata {
  address: Address
  chainId: SupportedChainId
  name: string
  symbol: string
  decimals: number
  totalSupplyWei: TokenAmountWei
  totalBurnedWei: TokenAmountWei
  /** Supply is fixed; this is always false. Documented for integrators. */
  mintable: false
}

// ─── Checkout (Soko purchase coordination) ───────────────────────────────────

/**
 * A checkout intent coordinates a Soko purchase. Settlement happens on-chain
 * (the buyer's wallet calls CreatorRewardsDistributor) or via a regulated fiat
 * provider. YNKLV operates no internal custodial exchange.
 */
export interface CheckoutIntent {
  id: string
  buyer: Address
  creator: Address
  productId: number
  amountWei: TokenAmountWei
  /** How the buyer will settle. */
  method: 'onchain' | 'fiat-onramp' | 'stablecoin'
  status: 'created' | 'pending' | 'settled' | 'expired' | 'cancelled'
  /** For on-chain settlement: the distributor address and calldata hint. */
  settlement?: {
    distributor: Address
    chainId: SupportedChainId
  }
  expiresAt: string
  createdAt: string
}

// ─── Compliance / Disclosure ─────────────────────────────────────────────────

/**
 * Disclosure records support MiCA-aware transparency. The ecosystem positions
 * YNKLV as a utility token — not an investment.
 */
export interface DisclosureRecord {
  id: string
  title: string
  category: 'tokenomics' | 'risk' | 'governance' | 'treasury' | 'legal'
  summary: string
  url?: string
  publishedAt: string
}

// ─── API envelope ────────────────────────────────────────────────────────────

export interface ApiError {
  code: string
  message: string
  hint?: string
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError }

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}
