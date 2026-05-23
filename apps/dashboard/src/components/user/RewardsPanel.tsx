'use client'

import { formatWei, formatRelative } from '@/lib/format'
import { SAMPLE_REWARDS } from '@/lib/sample-data'

export function RewardsPanel() {
  const rewards = SAMPLE_REWARDS

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-ynklv-surface border border-ynklv rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-1">Claimed</p>
          <p className="text-2xl font-light text-ynklv-cream">{formatWei(rewards.claimedTotal)} YNKLV</p>
        </div>
        <div className="bg-[#1A1209] border border-copper rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-1">Pending</p>
          <p className="text-2xl font-light text-ynklv-copper">{formatWei(rewards.pendingTotal)} YNKLV</p>
          <button className="mt-3 text-xs border border-copper text-ynklv-copper rounded-lg px-3 py-1.5 hover:bg-copper/10 transition-colors">
            Claim rewards
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-3">Reward history</p>
        <div className="space-y-2">
          {rewards.history.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 bg-ynklv-surface rounded-lg border border-ynklv">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${r.type === 'claim' ? 'bg-green-500' : 'bg-ynklv-copper'}`} />
                <div>
                  <p className="text-sm text-ynklv-cream capitalize">{r.reason.replace('.', ' ')}</p>
                  <p className="text-xs text-ynklv-muted">{r.epochId} · {formatRelative(r.timestamp)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${r.type === 'claim' ? 'text-green-400' : 'text-ynklv-copper'}`}>
                  {r.type === 'claim' ? '−' : '+'}{formatWei(r.amount)}
                </p>
                <p className="text-xs text-ynklv-muted capitalize">{r.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-ynklv-muted border border-ynklv rounded-lg p-3">
        Rewards represent ecosystem participation credits, not investment returns. Past activity does not predict future allocation.
      </p>
    </div>
  )
}
