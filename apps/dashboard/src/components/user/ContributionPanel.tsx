'use client'

import { SAMPLE_CONTRIBUTION } from '@/lib/sample-data'
import { formatRelative } from '@/lib/format'

export function ContributionPanel() {
  const data = SAMPLE_CONTRIBUTION
  const total = data.breakdown.creation + data.breakdown.governance + data.breakdown.community

  const bars = [
    { label: 'Creation', value: data.breakdown.creation, color: 'bg-ynklv-copper' },
    { label: 'Governance', value: data.breakdown.governance, color: 'bg-purple-500' },
    { label: 'Community', value: data.breakdown.community, color: 'bg-blue-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-ynklv-surface border border-ynklv rounded-xl p-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-ynklv-muted">Contribution score</p>
            <p className="text-4xl font-light text-ynklv-cream mt-1">{data.score.toLocaleString()}</p>
          </div>
          <p className="text-xs text-ynklv-muted">Sankofa EPS</p>
        </div>

        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          {bars.map((b) => (
            <div
              key={b.label}
              className={`${b.color} rounded-full`}
              style={{ width: `${(b.value / total) * 100}%` }}
            />
          ))}
        </div>

        <div className="flex gap-4 mt-3">
          {bars.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-xs text-ynklv-muted">
              <span className={`w-2 h-2 rounded-full ${b.color}`} />
              {b.label}: {b.value}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-3">Recent activity</p>
        <div className="space-y-2">
          {data.recentActivity.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 bg-ynklv-surface border border-ynklv rounded-lg">
              <div>
                <p className="text-sm text-ynklv-cream capitalize">{a.actionType.replace('.', ' ')}</p>
                <p className="text-xs text-ynklv-muted">{formatRelative(a.timestamp)}</p>
              </div>
              <span className="text-sm text-ynklv-copper font-medium">+{a.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
