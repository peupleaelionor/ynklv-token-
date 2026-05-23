/**
 * @ynklv/sdk/react — React bindings for the YNKLV SDK.
 *
 * A lightweight provider plus async hooks. No external data-fetching dependency
 * is required; each hook exposes { data, loading, error, refetch }.
 */
'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  Address,
  ContributionScore,
  CreatorProfile,
  MembershipStatus,
  RewardHistory,
  TokenGateRule,
  TokenGateResult,
  CheckoutIntent,
  ApiResult,
} from '@ynklv/types'
import { YnklvClient } from './client.js'

// ─── Provider ──────────────────────────────────────────────────────────────

const YnklvContext = createContext<YnklvClient | null>(null)

export interface YnklvProviderProps {
  client: YnklvClient
  children: ReactNode
}

export function YnklvProvider({ client, children }: YnklvProviderProps) {
  return <YnklvContext.Provider value={client}>{children}</YnklvContext.Provider>
}

export function useYnklvClient(): YnklvClient {
  const client = useContext(YnklvContext)
  if (!client) {
    throw new Error('useYnklvClient must be used within a <YnklvProvider>.')
  }
  return client
}

// ─── Async state primitive ───────────────────────────────────────────────────

export interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: string | undefined
  refetch: () => void
}

function useAsync<T>(
  fn: () => Promise<T>,
  deps: ReadonlyArray<unknown>,
  enabled = true,
): AsyncState<T> {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string>()
  const [nonce, setNonce] = useState(0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(undefined)
    fn()
      .then((result) => {
        if (!cancelled && mounted.current) setData(result)
      })
      .catch((err: unknown) => {
        if (!cancelled && mounted.current) {
          setError(err instanceof Error ? err.message : 'Request failed')
        }
      })
      .finally(() => {
        if (!cancelled && mounted.current) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce, enabled])

  const refetch = useCallback(() => setNonce((n) => n + 1), [])
  return { data, loading, error, refetch }
}

/** Unwraps an ApiResult, throwing on the error branch so useAsync can catch it. */
async function unwrap<T>(p: Promise<ApiResult<T>>): Promise<T> {
  const res = await p
  if (!res.ok) throw new Error(res.error.message)
  return res.data
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

/** YNKLV balance (wei, as bigint) for an address. */
export function useYnklvBalance(address?: Address): AsyncState<bigint> {
  const client = useYnklvClient()
  return useAsync<bigint>(
    () => client.getBalance(address as Address),
    [address],
    Boolean(address),
  )
}

/** Full membership status (tier, score, epoch, city). */
export function useYnklvMembership(address?: Address): AsyncState<MembershipStatus> {
  const client = useYnklvClient()
  return useAsync<MembershipStatus>(
    () => client.getMembership(address as Address),
    [address],
    Boolean(address),
  )
}

/** Evaluates a token-gate for the address (UX-side; server enforces). */
export function useYnklvGate(
  address: Address | undefined,
  rule: TokenGateRule,
): AsyncState<TokenGateResult> {
  const client = useYnklvClient()
  const ruleKey = JSON.stringify(rule)
  return useAsync<TokenGateResult>(
    () => client.checkGate(address as Address, rule),
    [address, ruleKey],
    Boolean(address),
  )
}

/** Contribution score (Sankofa / EPS). */
export function useYnklvContributionScore(address?: Address): AsyncState<ContributionScore> {
  const client = useYnklvClient()
  return useAsync<ContributionScore>(
    () => unwrap(client.getContributionScore(address as Address)),
    [address],
    Boolean(address),
  )
}

/** Reward history (utility recognition, not yield). */
export function useYnklvRewards(address?: Address): AsyncState<RewardHistory> {
  const client = useYnklvClient()
  return useAsync<RewardHistory>(
    () => unwrap(client.getRewardHistory(address as Address)),
    [address],
    Boolean(address),
  )
}

/** Identity = membership + creator profile, composed for convenience. */
export interface YnklvIdentity {
  membership: MembershipStatus
  creator: CreatorProfile | null
}

export function useYnklvIdentity(address?: Address): AsyncState<YnklvIdentity> {
  const client = useYnklvClient()
  return useAsync<YnklvIdentity>(
    async () => {
      const membership = await client.getMembership(address as Address)
      const creatorRes = await client.getCreatorProfile(address as Address)
      return { membership, creator: creatorRes.ok ? creatorRes.data : null }
    },
    [address],
    Boolean(address),
  )
}

/** Imperative checkout creator for Soko purchases. */
export function useYnklvCheckout() {
  const client = useYnklvClient()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()

  const createCheckout = useCallback(
    async (input: {
      buyer: Address
      creator: Address
      productId: number
      amountWei: string
      method?: CheckoutIntent['method']
    }): Promise<CheckoutIntent | null> => {
      setPending(true)
      setError(undefined)
      const res = await client.createCheckout(input)
      setPending(false)
      if (!res.ok) {
        setError(res.error.message)
        return null
      }
      return res.data
    },
    [client],
  )

  return { createCheckout, pending, error }
}
