import { StatCard } from '@/components/shared/StatCard'
import { TierBadge } from '@/components/shared/TierBadge'
import { AccessGrid } from '@/components/user/AccessGrid'
import { ContributionPanel } from '@/components/user/ContributionPanel'
import { formatWei, formatDate, formatRelative } from '@/lib/format'
import {
  SAMPLE_MEMBERSHIP,
  SAMPLE_BALANCE,
  SAMPLE_REWARDS,
  SAMPLE_ACTIVITY,
} from '@/lib/sample-data'

export default function UserOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Hero strip */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-1">Member since</p>
          <p className="text-2xl font-light text-ynklv-cream">{formatDate(SAMPLE_MEMBERSHIP.joinedAt!)}</p>
        </div>
        <TierBadge tier={SAMPLE_MEMBERSHIP.tier} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Balance"
          value={`${formatWei(SAMPLE_BALANCE.balanceWei)} YNKLV`}
          sub="Ecosystem utility token"
          copper
        />
        <StatCard
          label="Contribution score"
          value={SAMPLE_MEMBERSHIP.contributionScore.toLocaleString()}
          sub="Sankofa EPS"
        />
        <StatCard
          label="Pending rewards"
          value={`${formatWei(SAMPLE_REWARDS.pendingTotal)} YNKLV`}
          sub="Participation credits"
          accent
          copper
        />
        <StatCard
          label="Claimed total"
          value={`${formatWei(SAMPLE_REWARDS.claimedTotal)} YNKLV`}
          sub="All epochs"
        />
      </div>

      {/* Tier progress */}
      {SAMPLE_MEMBERSHIP.nextTier && (
        <div className="bg-ynklv-surface border border-ynklv rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest text-ynklv-muted">Tier progression</p>
            <div className="flex items-center gap-2 text-xs text-ynklv-muted">
              <TierBadge tier={SAMPLE_MEMBERSHIP.tier} size="sm" />
              <span>→</span>
              <TierBadge tier={SAMPLE_MEMBERSHIP.nextTier.tier} size="sm" />
            </div>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-ynklv-copper rounded-full transition-all"
              style={{ width: `${Math.min(100, (SAMPLE_MEMBERSHIP.contributionScore / 1000) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-ynklv-muted mt-2">
            {SAMPLE_MEMBERSHIP.contributionScore} / 1,000 contribution score for {SAMPLE_MEMBERSHIP.nextTier.name}
          </p>
        </div>
      )}

      {/* Two-col layout */}
      <div className="grid grid-cols-2 gap-8">
        <AccessGrid />

        <div>
          <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-4">Recent activity</p>
          <div className="space-y-2">
            {SAMPLE_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-ynklv-surface border border-ynklv rounded-lg">
                <div>
                  <p className="text-sm text-ynklv-cream">{a.label}</p>
                  <p className="text-xs text-ynklv-muted">{formatRelative(a.timestamp)}</p>
                </div>
                {a.amount && (
                  <span className="text-sm text-ynklv-copper">+{formatWei(a.amount)} YNKLV</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
