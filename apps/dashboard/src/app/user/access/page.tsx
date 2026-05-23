import { AccessGrid } from '@/components/user/AccessGrid'

export default function AccessPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-lg font-light text-ynklv-cream">Ecosystem access</h2>
        <p className="text-xs text-ynklv-muted mt-1">Features unlock as your membership tier increases.</p>
      </div>
      <AccessGrid />
    </div>
  )
}
