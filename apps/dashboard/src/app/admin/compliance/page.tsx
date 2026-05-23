const PROHIBITED = [
  'guaranteed returns', 'guaranteed profit', 'passive income',
  'get rich', 'to the moon', 'risk-free', 'guaranteed yield',
]

const APPROVED = [
  'ecosystem access', 'participation', 'membership',
  'creator rewards', 'coordination', 'contribution recognition',
]

const DISCLOSURES = [
  { id: 'utility', label: 'Utility token positioning', status: 'active', lastChecked: '2024-09-01T00:00:00Z' },
  { id: 'mica', label: 'MiCA compliance alignment', status: 'active', lastChecked: '2024-09-01T00:00:00Z' },
  { id: 'fiat', label: 'Fiat on-ramp disclaimer', status: 'active', lastChecked: '2024-09-01T00:00:00Z' },
  { id: 'ci', label: 'CI compliance scan', status: 'passing', lastChecked: '2024-09-01T00:00:00Z' },
]

export default function CompliancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-light text-ynklv-cream">Compliance</h2>
        <p className="text-xs text-ynklv-muted mt-1">Language guardrails, regulatory alignment, and disclosure status.</p>
      </div>

      {/* Disclosures */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-ynklv-muted">Active disclosures</p>
        {DISCLOSURES.map((d) => (
          <div key={d.id} className="flex items-center justify-between p-4 bg-ynklv-surface border border-ynklv rounded-xl">
            <p className="text-sm text-ynklv-cream">{d.label}</p>
            <span className="text-xs border border-green-700 text-green-400 rounded-full px-2 py-0.5 capitalize">{d.status}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Prohibited */}
        <div className="bg-ynklv-surface border border-red-700/30 rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-red-400 mb-3">Prohibited language</p>
          <div className="space-y-1.5">
            {PROHIBITED.map((p) => (
              <div key={p} className="flex items-center gap-2 text-xs text-ynklv-muted">
                <span className="text-red-500">✗</span>
                <span className="font-mono">&quot;{p}&quot;</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-ynklv-muted mt-3 pt-3 border-t border-ynklv/50">
            Scanned in CI via <code className="font-mono">scripts/compliance-scan.sh</code>. Negation-aware.
          </p>
        </div>

        {/* Approved */}
        <div className="bg-ynklv-surface border border-green-700/30 rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-green-400 mb-3">Approved framings</p>
          <div className="space-y-1.5">
            {APPROVED.map((a) => (
              <div key={a} className="flex items-center gap-2 text-xs text-ynklv-muted">
                <span className="text-green-500">✓</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-ynklv-muted mt-3 pt-3 border-t border-ynklv/50">
            See <code className="font-mono">docs/31-legal-regulatory-resilience.md</code> for full guidance.
          </p>
        </div>
      </div>
    </div>
  )
}
