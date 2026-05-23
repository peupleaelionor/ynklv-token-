/**
 * YnklvClient — the core entry point of the SDK.
 *
 * Combines canonical on-chain reads (via viem, optional) with off-chain
 * ecosystem data (via @ynklv/api-client). Everything it exposes is about
 * utility, access, and participation — never investment.
 */

import {
  type Address,
  type ApiResult,
  type CheckoutIntent,
  type ContributionScore,
  type CreatorProfile,
  type EcosystemActionType,
  type GovernanceStatus,
  type MembershipStatus,
  type RewardHistory,
  type TokenGateRule,
  type TokenGateResult,
  type TokenMetadata,
  type TreasuryOverview,
  type SupportedChainId,
  MEMBERSHIP_TIER_NAMES,
  MembershipTier,
} from '@ynklv/types'
import { resolveAddresses, getChain, type ContractAddresses } from '@ynklv/config'
import { evaluateGate, type GateSubject } from '@ynklv/token-gates'
import { createApiClient, YnklvApiClient } from '@ynklv/api-client'
import { generateReferralLink, type ReferralParams } from './referral.js'
import { ynklvTokenAbi, membershipRegistryAbi } from './abi.js'

/** A minimal structural type for a viem-like public client (keeps viem optional). */
export interface ReadClient {
  readContract(args: {
    address: Address
    abi: readonly unknown[]
    functionName: string
    args?: readonly unknown[]
  }): Promise<unknown>
}

export interface YnklvClientConfig {
  chainId: SupportedChainId
  /** Backend API base URL. */
  apiBaseUrl: string
  /** Optional viem public client for canonical on-chain reads. */
  publicClient?: ReadClient
  /** Address overrides (defaults resolved from @ynklv/config per chain). */
  addresses?: Partial<ContractAddresses>
  /** Optional SIWE session token for authenticated writes. */
  authToken?: string
}

export class YnklvClient {
  readonly chainId: SupportedChainId
  readonly addresses: ContractAddresses
  readonly api: YnklvApiClient
  private readonly publicClient?: ReadClient

  constructor(config: YnklvClientConfig) {
    this.chainId = config.chainId
    this.addresses = resolveAddresses(config.chainId, config.addresses)
    this.publicClient = config.publicClient
    this.api = createApiClient({ baseUrl: config.apiBaseUrl, token: config.authToken })
  }

  // ─── Token ──────────────────────────────────────────────────────────────

  /** Canonical on-chain balance when a publicClient is present; else via API. */
  async getBalance(address: Address): Promise<bigint> {
    if (this.publicClient) {
      const raw = await this.publicClient.readContract({
        address: this.addresses.ynklvToken,
        abi: ynklvTokenAbi,
        functionName: 'balanceOf',
        args: [address],
      })
      return raw as bigint
    }
    const res = await this.api.tokenBalance(address)
    return res.ok ? BigInt(res.data.balanceWei) : 0n
  }

  getTokenMetadata(): Promise<ApiResult<TokenMetadata>> {
    return this.api.tokenMetadata()
  }

  // ─── Membership / tier ────────────────────────────────────────────────────

  /** On-chain tier when possible; the API enriches with epoch/city/soulbound. */
  async getMembership(address: Address): Promise<MembershipStatus> {
    const apiRes = await this.api.membershipStatus(address)
    if (apiRes.ok) return apiRes.data

    // Fallback: derive from chain alone.
    const [tier, score] = await Promise.all([
      this.readTier(address),
      this.readScore(address),
    ])
    return {
      address,
      tier,
      tierName: MEMBERSHIP_TIER_NAMES[tier],
      thresholdWei: '0',
      contributionScore: score,
      isSoulbound: false,
      genesisTimestamp: 0,
      epochsLived: 0,
    }
  }

  private async readTier(address: Address): Promise<MembershipTier> {
    if (!this.publicClient) return MembershipTier.Observer
    const raw = await this.publicClient.readContract({
      address: this.addresses.membershipRegistry,
      abi: membershipRegistryAbi,
      functionName: 'tierOf',
      args: [address],
    })
    return Number(raw) as MembershipTier
  }

  private async readScore(address: Address): Promise<number> {
    if (!this.publicClient) return 0
    const raw = await this.publicClient.readContract({
      address: this.addresses.membershipRegistry,
      abi: membershipRegistryAbi,
      functionName: 'contributionScore',
      args: [address],
    })
    return Number(raw)
  }

  // ─── Token-gating ────────────────────────────────────────────────────────

  /**
   * Evaluates a gate for `address`. For UX use only — the server's
   * verifyAccess is authoritative for enforcement.
   */
  async checkGate(address: Address, rule: TokenGateRule): Promise<TokenGateResult> {
    const [balance, membership] = await Promise.all([
      this.getBalance(address),
      this.getMembership(address),
    ])
    const subject: GateSubject = {
      address,
      balanceWei: balance.toString(),
      contributionScore: membership.contributionScore,
    }
    return evaluateGate(subject, rule)
  }

  /** Server-authoritative gate check by gate id (delegates to the API). */
  verifyAccess(address: Address, gateId: string) {
    return this.api.verifyAccess({ address, gateId })
  }

  // ─── Contribution (Sankofa) ─────────────────────────────────────────────

  getContributionScore(address: Address): Promise<ApiResult<ContributionScore>> {
    return this.api.contributionScore(address)
  }

  /** Records a contribution-bearing action (requires auth token). */
  recordAction(
    address: Address,
    type: EcosystemActionType,
    metadata?: Record<string, string | number | boolean>,
  ) {
    return this.api.recordAction({ address, type, metadata })
  }

  // ─── Rewards (utility, not yield) ────────────────────────────────────────

  getRewardHistory(address: Address): Promise<ApiResult<RewardHistory>> {
    return this.api.rewardHistory(address)
  }

  // ─── Creator (Soko) ───────────────────────────────────────────────────────

  getCreatorProfile(address: Address): Promise<ApiResult<CreatorProfile>> {
    return this.api.creatorProfile(address)
  }

  // ─── Treasury (Baraka) ────────────────────────────────────────────────────

  getTreasuryOverview(): Promise<ApiResult<TreasuryOverview>> {
    return this.api.treasuryOverview()
  }

  // ─── Governance (the Indaba) ────────────────────────────────────────────

  getGovernanceStatus(): Promise<ApiResult<GovernanceStatus>> {
    return this.api.governanceStatus()
  }

  // ─── Checkout intent (off-chain payment coordination) ────────────────────

  /**
   * Creates a checkout intent for a Soko purchase. The intent is settled
   * on-chain by the buyer's wallet (see CreatorRewardsDistributor) or by a
   * regulated fiat provider — never by an internal custodial exchange.
   */
  createCheckout(input: {
    buyer: Address
    creator: Address
    productId: number
    amountWei: string
    method?: CheckoutIntent['method']
  }): Promise<ApiResult<CheckoutIntent>> {
    return this.api.createCheckout(input)
  }

  // ─── Referrals ───────────────────────────────────────────────────────────

  referralLink(baseUrl: string, params: ReferralParams): string {
    return generateReferralLink(baseUrl, params)
  }

  // ─── Chain helpers ─────────────────────────────────────────────────────────

  get explorerUrl(): string {
    return getChain(this.chainId).explorerUrl
  }
}

export function createYnklvClient(config: YnklvClientConfig): YnklvClient {
  return new YnklvClient(config)
}
