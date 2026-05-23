import { MembershipTier } from '@ynklv/types'

const TIER_CONFIG: Record<MembershipTier, { label: string; color: string; bg: string }> = {
  [MembershipTier.Observer]: { label: 'Observer', color: 'text-gray-400', bg: 'bg-gray-800' },
  [MembershipTier.Builder]: { label: 'Builder', color: 'text-blue-300', bg: 'bg-blue-900/40' },
  [MembershipTier.Creator]: { label: 'Creator', color: 'text-amber-300', bg: 'bg-amber-900/40' },
  [MembershipTier.Architect]: { label: 'Architect', color: 'text-purple-300', bg: 'bg-purple-900/40' },
  [MembershipTier.Guardian]: { label: 'Guardian', color: 'text-ynklv-copper', bg: 'bg-[#1A1209]' },
}

interface TierBadgeProps {
  tier: MembershipTier
  size?: 'sm' | 'md'
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const cfg = TIER_CONFIG[tier]
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${cfg.bg} ${cfg.color} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {cfg.label}
    </span>
  )
}
