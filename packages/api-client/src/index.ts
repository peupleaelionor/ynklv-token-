/**
 * @ynklv/api-client — A small, typed client for the YNKLV backend API.
 *
 * Isomorphic (works in browser and on the server). Returns discriminated
 * {@link ApiResult} values so callers handle failure explicitly.
 */

import type {
  Address,
  ApiResult,
  ApiError,
  CheckoutIntent,
  ContributionScore,
  CreatorProfile,
  DisclosureRecord,
  EcosystemAction,
  EcosystemActionType,
  GovernanceStatus,
  MembershipStatus,
  Paginated,
  RewardHistory,
  TokenAmountWei,
  TokenMetadata,
  TreasuryOverview,
} from '@ynklv/types'

export interface ApiClientOptions {
  baseUrl: string
  /** Optional bearer token for authenticated actions (SIWE session). */
  token?: string
  /** Custom fetch (for SSR / testing). Defaults to global fetch. */
  fetch?: typeof fetch
  /** Default request timeout in ms. */
  timeoutMs?: number
}

export class YnklvApiClient {
  private readonly baseUrl: string
  private readonly token?: string
  private readonly fetchImpl: typeof fetch
  private readonly timeoutMs: number

  constructor(opts: ApiClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '')
    this.token = opts.token
    this.fetchImpl = opts.fetch ?? globalThis.fetch
    this.timeoutMs = opts.timeoutMs ?? 10_000
  }

  withToken(token: string): YnklvApiClient {
    return new YnklvApiClient({
      baseUrl: this.baseUrl,
      token,
      fetch: this.fetchImpl,
      timeoutMs: this.timeoutMs,
    })
  }

  // ─── Token ──────────────────────────────────────────────────────────────

  tokenMetadata() {
    return this.get<TokenMetadata>('/api/token/metadata')
  }

  tokenBalance(address: Address) {
    return this.get<{ address: Address; balanceWei: string }>(
      `/api/token/balance?address=${address}`,
    )
  }

  // ─── Membership ─────────────────────────────────────────────────────────

  membershipStatus(address: Address) {
    return this.get<MembershipStatus>(`/api/membership/status?address=${address}`)
  }

  // ─── Rewards ──────────────────────────────────────────────────────────────

  rewardHistory(address: Address) {
    return this.get<RewardHistory>(`/api/rewards/history?address=${address}`)
  }

  // ─── Creator (Soko) ───────────────────────────────────────────────────────

  creatorProfile(address: Address) {
    return this.get<CreatorProfile>(`/api/creator/profile?address=${address}`)
  }

  // ─── Treasury (Baraka) ────────────────────────────────────────────────────

  treasuryOverview() {
    return this.get<TreasuryOverview>('/api/treasury/overview')
  }

  // ─── Governance (the Indaba) ────────────────────────────────────────────

  governanceStatus() {
    return this.get<GovernanceStatus>('/api/governance/status')
  }

  // ─── Contribution (Sankofa) ─────────────────────────────────────────────

  contributionScore(address: Address) {
    return this.get<ContributionScore>(`/api/contribution/score?address=${address}`)
  }

  /** Records a contribution-bearing action. Server validates and de-dupes. */
  recordAction(input: {
    address: Address
    type: EcosystemActionType
    metadata?: Record<string, string | number | boolean>
  }) {
    return this.post<EcosystemAction>('/api/contribution/record', input)
  }

  // ─── Compliance ──────────────────────────────────────────────────────────

  disclosures() {
    return this.get<Paginated<DisclosureRecord>>('/api/compliance/disclosures')
  }

  // ─── Checkout (Soko) ──────────────────────────────────────────────────────

  createCheckout(input: {
    buyer: Address
    creator: Address
    productId: number
    amountWei: TokenAmountWei
    method?: CheckoutIntent['method']
  }) {
    return this.post<CheckoutIntent>('/api/checkout/intent', input)
  }

  // ─── Integration verification ────────────────────────────────────────────

  /** Server-authoritative gate check used by integrating apps. */
  verifyAccess(input: { address: Address; gateId: string }) {
    return this.post<{ granted: boolean; reason?: string }>(
      '/api/integrations/verify-access',
      input,
    )
  }

  // ─── Transport ─────────────────────────────────────────────────────────────

  private async get<T>(path: string): Promise<ApiResult<T>> {
    return this.request<T>('GET', path)
  }

  private async post<T>(path: string, body: unknown): Promise<ApiResult<T>> {
    return this.request<T>('POST', path, body)
  }

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    body?: unknown,
  ): Promise<ApiResult<T>> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method,
        headers: {
          'content-type': 'application/json',
          ...(this.token ? { authorization: `Bearer ${this.token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      const json = (await res.json().catch(() => null)) as
        | { data?: T; error?: ApiError }
        | null

      if (!res.ok || !json) {
        return {
          ok: false,
          error: json?.error ?? {
            code: `HTTP_${res.status}`,
            message: res.statusText || 'Request failed',
          },
        }
      }
      if (json.error) return { ok: false, error: json.error }
      return { ok: true, data: json.data as T }
    } catch (err) {
      const aborted = err instanceof Error && err.name === 'AbortError'
      return {
        ok: false,
        error: {
          code: aborted ? 'TIMEOUT' : 'NETWORK_ERROR',
          message: aborted ? 'Request timed out' : 'Network request failed',
        },
      }
    } finally {
      clearTimeout(timer)
    }
  }
}

export function createApiClient(opts: ApiClientOptions): YnklvApiClient {
  return new YnklvApiClient(opts)
}
