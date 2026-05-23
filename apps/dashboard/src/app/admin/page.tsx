import { StatCard } from '@/components/shared/StatCard'
import { SAMPLE_ECOSYSTEM_METRICS, SAMPLE_TREASURY } from '@/lib/sample-data'
import { formatWei } from '@/lib/format'

export default function AdminOverviewPage() {
  const metrics = SAMPLE_ECOSYSTEM_METRICS
  const treasury = SAMPLE_TREASURY

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-light text-ynklv-cream">Ecosystem overview</h2>
          <p className="text-xs text-ynklv-muted mt-1">Live metrics across the Zamani protocol.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-ynklv-muted">All systems operational</span>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total members" value={metrics.totalMembers.toLocaleString()} sub="Across all tiers" />
        <StatCard label="Active creators" value={metrics.activeCreators.toLocaleString()} sub="Studio marketplace" copper />
        <StatCard label="Total transactions" value={metrics.totalTransactions.toLocaleString()} sub="All-time" />
        <StatCard label="Total burned" value={`${formatWei(metrics.totalBurned)} YNKLV`} sub="Deflationary burn" accent copper />
      </div>

      {/* Tier distribution */}
      <div className="bg-ynklv-surface border border-ynklv rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-4">Member tier distribution</p>
        <div className="space-y-3">
          {metrics.membersByTier.map((t) => {
            const pct = (t.count / metrics.totalMembers) * 100
            return (
              <div key={t.tier} className="flex items-center gap-4">
                <span className="text-sm text-ynklv-muted w-20 shrink-0">{t.tier}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ynklv-copper rounded-full"
                    style={{ width: `${pct}%`, opacity: 0.3 + (pct / 100) * 0.7 }}
                  />
                </div>
                <span className="text-sm text-ynklv-cream w-16 text-right tabular-nums">{t.count.toLocaleString()}</span>
                <span className="text-xs text-ynklv-muted w-10 text-right">{pct.toFixed(1)}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Treasury summary */}
      <div className="bg-[#1A1209] border border-copper/30 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-1">Baraka treasury</p>
            <p className="text-2xl font-light text-ynklv-cream">{formatWei(treasury.totalValue, 18, 0)} YNKLV</p>
          </div>
          <span className="text-xs border border-green-700 text-green-400 rounded-full px-2 py-0.5">Healthy</span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-xs">
          {[
            { label: 'Operational', value: treasury.operationalReserve, pct: treasury.allocation.operationalReservePercent },
            { label: 'Ecosystem', value: treasury.ecosystemFund, pct: treasury.allocation.ecosystemFundPercent },
            { label: 'Emergency', value: treasury.emergencyFund, pct: treasury.allocation.emergencyFundPercent },
            { label: 'Unallocated', value: treasury.unallocated, pct: treasury.allocation.unallocatedPercent },
          ].map((t) => (
            <div key={t.label} className="p-3 bg-black/20 rounded-lg">
              <p className="text-ynklv-muted">{t.label}</p>
              <p className="text-ynklv-cream font-medium mt-1">{t.pct}%</p>
              <p className="text-ynklv-muted mt-0.5">{formatWei(t.value, 18, 0)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active cities */}
      <div>
        <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-3">Active Mboka cities</p>
        <div className="flex flex-wrap gap-2">
          {metrics.cities.map((city) => (
            <span key={city} className="text-xs border border-ynklv text-ynklv-muted rounded-full px-3 py-1.5">
              {city}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
