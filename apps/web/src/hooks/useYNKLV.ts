import { useAccount, useReadContract, useWriteContract, useChainId } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { CONTRACT_ADDRESSES, YNKLV_TOKEN_ABI, YNKLV_PASS_ABI } from '../lib/contracts'

// ─── Token hooks ─────────────────────────────────────────────────────────────

export function useYNKLVBalance(address?: `0x${string}`) {
  const chainId = useChainId()
  const contracts = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const { data: rawBalance, isLoading } = useReadContract({
    address:      contracts?.ynklvToken,
    abi:          YNKLV_TOKEN_ABI,
    functionName: 'balanceOf',
    args:         [address ?? '0x0'],
    query:        { enabled: !!address && !!contracts },
  })

  return {
    raw:       rawBalance ?? 0n,
    formatted: rawBalance ? Number(formatUnits(rawBalance, 18)) : 0,
    display:   rawBalance
      ? Number(formatUnits(rawBalance, 18)).toLocaleString('en', {
          maximumFractionDigits: 2,
        })
      : '—',
    isLoading,
  }
}

export function useTotalSupply() {
  const chainId = useChainId()
  const contracts = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const { data } = useReadContract({
    address:      contracts?.ynklvToken,
    abi:          YNKLV_TOKEN_ABI,
    functionName: 'totalSupply',
    query:        { enabled: !!contracts },
  })

  return data ?? 0n
}

// ─── Pass hooks ───────────────────────────────────────────────────────────────

export function useYNKLVPass(address?: `0x${string}`) {
  const chainId = useChainId()
  const contracts = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  // Get token ID for this wallet
  const { data: tokenId, isLoading: isLoadingId } = useReadContract({
    address:      contracts?.ynklvPass,
    abi:          YNKLV_PASS_ABI,
    functionName: 'holderToken',
    args:         [address ?? '0x0'],
    query:        { enabled: !!address && !!contracts },
  })

  const hasPass = tokenId != null && tokenId > 0n

  // Get pass data (only if they have a pass)
  const { data: passData, isLoading: isLoadingData } = useReadContract({
    address:      contracts?.ynklvPass,
    abi:          YNKLV_PASS_ABI,
    functionName: 'passData',
    args:         [tokenId ?? 0n],
    query:        { enabled: hasPass },
  })

  return {
    tokenId,
    hasPass,
    passData,
    isLoading: isLoadingId || isLoadingData,
  }
}

export function useMintPass() {
  const chainId = useChainId()
  const contracts = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  const { writeContractAsync, isPending } = useWriteContract()

  const mint = async () => {
    if (!contracts) throw new Error('Chain not supported')
    return writeContractAsync({
      address:      contracts.ynklvPass,
      abi:          YNKLV_PASS_ABI,
      functionName: 'mint',
    })
  }

  return { mint, isPending }
}

// ─── EPS tier utilities ───────────────────────────────────────────────────────

export type PassTier = 'newcomer' | 'member' | 'builder' | 'architect' | 'legend'

export function tierFromNumber(n: number): PassTier {
  const tiers: PassTier[] = ['newcomer', 'member', 'builder', 'architect', 'legend']
  return tiers[n] ?? 'newcomer'
}

export function tierFromEPS(eps: number): PassTier {
  if (eps >= 2500) return 'legend'
  if (eps >= 1000) return 'architect'
  if (eps >= 500)  return 'builder'
  if (eps >= 100)  return 'member'
  return 'newcomer'
}

export function nextTierThreshold(eps: number): number {
  if (eps < 100)  return 100
  if (eps < 500)  return 500
  if (eps < 1000) return 1000
  if (eps < 2500) return 2500
  return 2500
}

export function tierProgress(eps: number): number {
  const thresholds = [0, 100, 500, 1000, 2500]
  for (let i = 0; i < thresholds.length - 1; i++) {
    if (eps < thresholds[i + 1]) {
      const rangeStart = thresholds[i]
      const rangeEnd   = thresholds[i + 1]
      return (eps - rangeStart) / (rangeEnd - rangeStart)
    }
  }
  return 1
}

// ─── Ecosystem stats hook ─────────────────────────────────────────────────────

export function useEcosystemStats() {
  const totalSupply = useTotalSupply()

  return {
    totalSupplyFormatted: Number(formatUnits(totalSupply, 18)).toLocaleString('en', {
      maximumFractionDigits: 0,
    }),
    // These would come from Supabase/The Graph in production
    activeCreators:     null as number | null,
    monthlyVolume:      null as number | null,
    activeCities:       null as number | null,
    totalBurned:        null as number | null,
  }
}
