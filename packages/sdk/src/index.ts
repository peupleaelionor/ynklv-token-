/**
 * @ynklv/sdk — Connect any application to the YNKLV ecosystem.
 *
 * Core (framework-agnostic) entry point. React hooks live at `@ynklv/sdk/react`;
 * server helpers at `@ynklv/sdk/server`.
 *
 * YNKLV is a utility ecosystem. Everything here concerns access, membership,
 * contribution, and participation — never investment, yield, or returns.
 */

export { YnklvClient, createYnklvClient } from './client.js'
export type { YnklvClientConfig, ReadClient } from './client.js'

export { generateReferralLink, parseReferral } from './referral.js'
export type { ReferralParams } from './referral.js'

export { ynklvTokenAbi, membershipRegistryAbi, rewardsVaultAbi } from './abi.js'

// Re-export the access primitives so integrators need one dependency.
export { evaluateGate, describeShortfall, Gates, tierDefinition } from '@ynklv/token-gates'
export type { GateSubject } from '@ynklv/token-gates'

// Re-export the config primitives most integrations need.
export {
  CHAINS,
  DEFAULT_CHAIN_ID,
  getChain,
  resolveAddresses,
  TIER_LADDER,
  tierFor,
  TOKEN_CONSTANTS,
  COMPLIANCE,
} from '@ynklv/config'

// Re-export the formatting helpers.
export { formatYnklv, parseYnklv, truncateAddress, isAddress } from '@ynklv/utils'

// Re-export the shared types.
export type {
  Address,
  MembershipStatus,
  MembershipTier,
  ContributionScore,
  TokenGateRule,
  TokenGateResult,
  RewardHistory,
  CreatorProfile,
  TreasuryOverview,
  GovernanceStatus,
  TokenMetadata,
  CheckoutIntent,
} from '@ynklv/types'

export { MembershipTier as Tier, MEMBERSHIP_TIER_NAMES } from '@ynklv/types'
