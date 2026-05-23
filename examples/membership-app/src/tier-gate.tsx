/**
 * Membership App — progressive tier gate UI component.
 *
 * Shows content locked by tier with a clear upgrade path.
 * No investment language — framed entirely as access and participation.
 */

'use client'

import { useYnklvMembership } from '@ynklv/sdk/react'
import { MembershipTier } from '@ynklv/types'

interface TierGateProps {
  address?: string
  requiredTier: MembershipTier
  children: React.ReactNode
  lockedMessage?: string
}

const TIER_LABELS: Record<MembershipTier, string> = {
  [MembershipTier.Observer]: 'Observer',
  [MembershipTier.Builder]: 'Builder',
  [MembershipTier.Creator]: 'Creator',
  [MembershipTier.Architect]: 'Architect',
  [MembershipTier.Guardian]: 'Guardian',
}

export function TierGate({ address, requiredTier, children, lockedMessage }: TierGateProps) {
  const { data: membership, loading } = useYnklvMembership(address)

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-800 rounded-xl h-32" />
    )
  }

  const currentTier = membership?.tier ?? MembershipTier.Observer

  if (currentTier < requiredTier) {
    return (
      <div className="p-6 border border-gray-700 rounded-xl bg-gray-900/50 text-center">
        <p className="text-sm text-gray-400">
          {lockedMessage ?? `${TIER_LABELS[requiredTier]} membership required for this feature.`}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Current tier: {TIER_LABELS[currentTier]}
        </p>
        <button className="mt-4 text-xs border border-amber-700 text-amber-400 rounded-lg px-4 py-2 hover:bg-amber-900/20 transition-colors">
          Explore membership →
        </button>
      </div>
    )
  }

  return <>{children}</>
}
