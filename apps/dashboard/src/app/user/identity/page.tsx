import { TierBadge } from '@/components/shared/TierBadge'
import { ContributionPanel } from '@/components/user/ContributionPanel'
import { SAMPLE_MEMBERSHIP, SAMPLE_ADDRESS } from '@/lib/sample-data'
import { formatDate, shortenAddress } from '@/lib/format'

export default function IdentityPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-ynklv-surface border border-ynklv rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-1">Zamani Identity</p>
            <p className="font-mono text-sm text-ynklv-cream">{shortenAddress(SAMPLE_ADDRESS)}</p>
          </div>
          <TierBadge tier={SAMPLE_MEMBERSHIP.tier} />
        </div>
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div>
            <p className="text-xs text-ynklv-muted">Member since</p>
            <p className="text-sm text-ynklv-cream">{formatDate(SAMPLE_MEMBERSHIP.joinedAt!)}</p>
          </div>
          <div>
            <p className="text-xs text-ynklv-muted">Contribution</p>
            <p className="text-sm text-ynklv-cream">{SAMPLE_MEMBERSHIP.contributionScore.toLocaleString()} EPS</p>
          </div>
          <div>
            <p className="text-xs text-ynklv-muted">Next tier</p>
            <p className="text-sm text-ynklv-cream">{SAMPLE_MEMBERSHIP.nextTier?.name ?? 'Guardian (max)'}</p>
          </div>
        </div>
      </div>

      <ContributionPanel />
    </div>
  )
}
