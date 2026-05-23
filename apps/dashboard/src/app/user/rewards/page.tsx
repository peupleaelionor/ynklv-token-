import { RewardsPanel } from '@/components/user/RewardsPanel'

export default function RewardsPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h2 className="text-lg font-light text-ynklv-cream">Rewards</h2>
        <p className="text-xs text-ynklv-muted mt-1">Ecosystem participation credits — not financial returns.</p>
      </div>
      <RewardsPanel />
    </div>
  )
}
