/**
 * @ynklv/config — Shared, environment-agnostic configuration.
 *
 * Chain definitions, contract address registries, and the membership
 * threshold table. Thresholds describe ACCESS requirements, never investment.
 */

import { MembershipTier, type Address, type SupportedChainId } from '@ynklv/types'

// ─── Chains ────────────────────────────────────────────────────────────────

export interface ChainConfig {
  id: SupportedChainId
  name: string
  shortName: string
  rpcUrl: string
  explorerUrl: string
  isTestnet: boolean
}

export const CHAINS: Record<SupportedChainId, ChainConfig> = {
  8453: {
    id: 8453,
    name: 'Base',
    shortName: 'base',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    isTestnet: false,
  },
  84532: {
    id: 84532,
    name: 'Base Sepolia',
    shortName: 'base-sepolia',
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    isTestnet: true,
  },
}

export const DEFAULT_CHAIN_ID: SupportedChainId = 84532

export function getChain(chainId: SupportedChainId): ChainConfig {
  return CHAINS[chainId]
}

// ─── Contract address registry ───────────────────────────────────────────────

export interface ContractAddresses {
  ynklvToken: Address
  membershipRegistry: Address
  rewardsVault: Address
  creatorDistributor: Address
  timelock: Address
}

const ZERO: Address = '0x0000000000000000000000000000000000000000'

/**
 * Addresses are populated per network at deploy time. Defaults are the zero
 * address; integrators should override via {@link resolveAddresses}.
 */
export const CONTRACT_ADDRESSES: Record<SupportedChainId, ContractAddresses> = {
  8453: {
    ynklvToken: ZERO,
    membershipRegistry: ZERO,
    rewardsVault: ZERO,
    creatorDistributor: ZERO,
    timelock: ZERO,
  },
  84532: {
    ynklvToken: ZERO,
    membershipRegistry: ZERO,
    rewardsVault: ZERO,
    creatorDistributor: ZERO,
    timelock: ZERO,
  },
}

/** Merge env-provided addresses over the static registry. */
export function resolveAddresses(
  chainId: SupportedChainId,
  overrides: Partial<ContractAddresses> = {},
): ContractAddresses {
  return { ...CONTRACT_ADDRESSES[chainId], ...overrides }
}

// ─── Membership thresholds ────────────────────────────────────────────────────

const e18 = (n: bigint) => (n * 10n ** 18n).toString()

export interface TierDefinition {
  tier: MembershipTier
  name: string
  /** Minimum YNKLV balance (wei) to qualify for this tier. */
  minBalanceWei: string
  /** Minimum contribution score (EPS) to qualify. */
  minContributionScore: number
  /** Short description of what this tier grants — access, not return. */
  grants: string
}

/**
 * The membership ladder. Each tier is reached through a combination of holding
 * and contribution. Higher tiers unlock more ACCESS and PARTICIPATION rights,
 * never financial yield.
 */
export const TIER_LADDER: TierDefinition[] = [
  {
    tier: MembershipTier.Observer,
    name: 'Observer',
    minBalanceWei: e18(0n),
    minContributionScore: 0,
    grants: 'Read access to the ecosystem, Soko browsing, Indaba viewing.',
  },
  {
    tier: MembershipTier.Builder,
    name: 'Builder',
    minBalanceWei: e18(100n),
    minContributionScore: 100,
    grants: 'Publish in Soko, vote in City Charters, Academy access, basic Nommo credits.',
  },
  {
    tier: MembershipTier.Creator,
    name: 'Creator',
    minBalanceWei: e18(500n),
    minContributionScore: 500,
    grants: 'Full Nommo faculties (Eké/Oro/Bassa), Indaba proposals, premium Academy.',
  },
  {
    tier: MembershipTier.Architect,
    name: 'Architect',
    minBalanceWei: e18(2_500n),
    minContributionScore: 1_000,
    grants: 'Council voting rights, City Charter creation, beta access.',
  },
  {
    tier: MembershipTier.Guardian,
    name: 'Guardian',
    minBalanceWei: e18(10_000n),
    minContributionScore: 2_500,
    grants: 'Zamani Ledger authorship, protocol design input, founding-cohort credential.',
  },
]

/** Resolve the highest tier satisfied by a balance + contribution score. */
export function tierFor(balanceWei: bigint, contributionScore: number): MembershipTier {
  let resolved = MembershipTier.Observer
  for (const def of TIER_LADDER) {
    if (balanceWei >= BigInt(def.minBalanceWei) && contributionScore >= def.minContributionScore) {
      resolved = def.tier
    }
  }
  return resolved
}

export function tierDefinition(tier: MembershipTier): TierDefinition {
  return TIER_LADDER[tier]
}

// ─── Token economics constants (informational; enforced on-chain) ─────────────

export const TOKEN_CONSTANTS = {
  symbol: 'YNKLV',
  decimals: 18,
  totalSupplyWei: e18(1_000_000_000n),
  mintable: false as const,
  /** Soko revenue split — enforced as immutable constants in the contract. */
  creatorShareBps: 9_000,
  treasuryShareBps: 850,
  burnShareBps: 150,
}

// ─── Compliance posture (single source of truth) ─────────────────────────────

export const COMPLIANCE = {
  /** YNKLV is positioned as a utility token, not a financial instrument. */
  positioning: 'utility' as const,
  /** Language that must never appear in product or marketing surfaces. */
  prohibitedLanguage: [
    'guaranteed returns',
    'passive income',
    'investment opportunity',
    'APY',
    'yield',
    'profit',
    'get rich',
    'to the moon',
  ],
  /** Required disclaimer for any fiat/EUR surface. */
  fiatDisclaimer:
    'EUR on/off-ramp is provided exclusively by licensed third-party providers. ' +
    'KYC/AML may apply. YNKLV operates no internal custodial exchange.',
}
