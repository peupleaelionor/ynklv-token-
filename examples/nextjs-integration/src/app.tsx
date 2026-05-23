/**
 * YNKLV Next.js Integration — minimal example.
 *
 * Shows how to gate a page behind a Builder-tier check using
 * @ynklv/sdk hooks and @ynklv/token-gates.
 *
 * Copy this into any Next.js 14 App Router project.
 */

'use client'

import { useYnklvMembership } from '@ynklv/sdk/react'
import { MembershipTier } from '@ynklv/types'

interface GatedPageProps {
  address?: string
}

export function GatedPage({ address }: GatedPageProps) {
  const { data: membership, loading, error } = useYnklvMembership(address)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-sm text-gray-400">Checking membership…</span>
      </div>
    )
  }

  if (error || !membership) {
    return (
      <div className="p-6 border border-red-800 rounded-xl text-red-400 text-sm">
        Could not verify membership. Please connect your wallet.
      </div>
    )
  }

  if (membership.tier < MembershipTier.Builder) {
    return (
      <div className="p-6 border border-gray-700 rounded-xl">
        <h2 className="text-lg font-medium">Builder access required</h2>
        <p className="text-sm text-gray-400 mt-2">
          This section is available to Builder-tier members and above.
          Upgrade your membership to gain access.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 border border-green-800 rounded-xl">
      <h2 className="text-lg font-medium text-green-400">Welcome, {membership.tierName}</h2>
      <p className="text-sm text-gray-400 mt-2">
        You have access to this Builder-gated section.
        Contribution score: {membership.contributionScore}
      </p>
    </div>
  )
}
