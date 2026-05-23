'use client'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
  copper?: boolean
}

export function StatCard({ label, value, sub, accent, copper }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 flex flex-col gap-1 ${
        accent ? 'border-copper bg-[#1A1209]' : 'border-ynklv bg-ynklv-surface'
      }`}
    >
      <span className="text-xs uppercase tracking-widest text-ynklv-muted">{label}</span>
      <span className={`text-2xl font-light tabular-nums ${copper ? 'text-ynklv-copper' : 'text-ynklv-cream'}`}>
        {value}
      </span>
      {sub && <span className="text-xs text-ynklv-muted">{sub}</span>}
    </div>
  )
}
