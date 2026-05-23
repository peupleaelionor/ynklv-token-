import { SAMPLE_ROLES } from '@/lib/sample-data'
import { formatDate, shortenAddress } from '@/lib/format'

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-light text-ynklv-cream">Role audit</h2>
        <p className="text-xs text-ynklv-muted mt-1">
          Active role assignments. Principle: least privilege. Revoke roles after use.
        </p>
      </div>

      <div className="bg-ynklv-surface border border-ynklv rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ynklv">
              <th className="text-left p-4 text-xs uppercase tracking-widest text-ynklv-muted font-normal">Address</th>
              <th className="text-left p-4 text-xs uppercase tracking-widest text-ynklv-muted font-normal">Role</th>
              <th className="text-left p-4 text-xs uppercase tracking-widest text-ynklv-muted font-normal">Assigned</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ROLES.map((r, i) => (
              <tr key={i} className="border-b border-ynklv/50 last:border-0">
                <td className="p-4 font-mono text-ynklv-cream">{shortenAddress(r.address)}</td>
                <td className="p-4">
                  <span className="text-xs font-mono bg-black/30 text-ynklv-copper border border-copper/30 rounded px-2 py-0.5">
                    {r.role}
                  </span>
                </td>
                <td className="p-4 text-ynklv-muted">{formatDate(r.assignedAt)}</td>
                <td className="p-4 text-right">
                  <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-ynklv-surface border border-orange-700/40 rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-orange-400 mb-2">Askari emergency council</p>
        <p className="text-sm text-ynklv-cream">
          Pause authority is held by Askari. Emergency pause can be activated by any 2-of-5 Askari council members.
          Pause does NOT freeze member assets — only new state transitions.
        </p>
        <button className="mt-3 text-xs border border-orange-700/60 text-orange-400 rounded-lg px-3 py-1.5 hover:bg-orange-900/20 transition-colors">
          View Askari status →
        </button>
      </div>
    </div>
  )
}
