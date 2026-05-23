import { StatCard } from '@/components/shared/StatCard'
import { SAMPLE_TREASURY } from '@/lib/sample-data'
import { formatWei } from '@/lib/format'

export default function TreasuryPage() {
  const t = SAMPLE_TREASURY

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-light text-ynklv-cream">Baraka Treasury</h2>
        <p className="text-xs text-ynklv-muted mt-1">3-of-5 multisig · Gnosis Safe · Base mainnet</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total value" value={`${formatWei(t.totalValue, 18, 0)} YNKLV`} copper accent />
        <StatCard label="Operational reserve" value={`${t.allocation.operationalReservePercent}%`} sub={formatWei(t.operationalReserve, 18, 0) + ' YNKLV'} />
        <StatCard label="Ecosystem fund" value={`${t.allocation.ecosystemFundPercent}%`} sub={formatWei(t.ecosystemFund, 18, 0) + ' YNKLV'} />
        <StatCard label="Emergency fund" value={`${t.allocation.emergencyFundPercent}%`} sub={formatWei(t.emergencyFund, 18, 0) + ' YNKLV'} />
      </div>

      <div className="bg-ynklv-surface border border-ynklv rounded-xl p-5 space-y-4">
        <p className="text-xs uppercase tracking-widest text-ynklv-muted">Multisig configuration</p>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-ynklv-muted text-xs">Threshold</p>
            <p className="text-ynklv-cream font-medium">{t.multisig.required} of {t.multisig.total} signers</p>
          </div>
          <div>
            <p className="text-ynklv-muted text-xs">Type</p>
            <p className="text-ynklv-cream font-medium capitalize">{t.multisig.type}</p>
          </div>
          <div>
            <p className="text-ynklv-muted text-xs">Status</p>
            <span className="inline-flex items-center gap-1.5 text-green-400 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {t.health}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-ynklv-surface border border-ynklv rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-3">Recent burn activity</p>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-900/30 border border-orange-700/40 flex items-center justify-center text-orange-400 text-lg">
            ◎
          </div>
          <div>
            <p className="text-sm text-ynklv-cream">Deflationary burn</p>
            <p className="text-2xl font-light text-ynklv-copper">{formatWei(t.recentBurnTotal)} YNKLV</p>
            <p className="text-xs text-ynklv-muted">1.5% of all creator transaction volume</p>
          </div>
        </div>
      </div>
    </div>
  )
}
