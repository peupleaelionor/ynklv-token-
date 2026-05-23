import { SAMPLE_ACTIVITY } from '@/lib/sample-data'
import { formatRelative, formatWei } from '@/lib/format'

export default function ActivityPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h2 className="text-lg font-light text-ynklv-cream">Activity</h2>
        <p className="text-xs text-ynklv-muted mt-1">Your ecosystem participation history.</p>
      </div>

      <div className="space-y-2">
        {SAMPLE_ACTIVITY.map((a, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-ynklv-surface border border-ynklv rounded-xl">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-ynklv-copper shrink-0" />
              <div>
                <p className="text-sm text-ynklv-cream">{a.label}</p>
                <p className="text-xs text-ynklv-muted capitalize">{a.type.replace('.', ' ')} · {formatRelative(a.timestamp)}</p>
              </div>
            </div>
            {a.amount && (
              <span className="text-sm text-ynklv-copper">+{formatWei(a.amount)} YNKLV</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
