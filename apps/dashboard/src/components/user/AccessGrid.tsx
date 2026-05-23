'use client'

import { MembershipTier } from '@ynklv/types'
import { SAMPLE_MEMBERSHIP } from '@/lib/sample-data'

const ACCESS_FEATURES = [
  { id: 'mboka', label: 'Mboka Communities', minTier: MembershipTier.Builder, icon: '◈', description: 'City-based creator communities' },
  { id: 'indaba', label: 'Indaba Governance', minTier: MembershipTier.Builder, icon: '◉', description: 'Participate in ecosystem proposals' },
  { id: 'studio', label: 'Studio Marketplace', minTier: MembershipTier.Creator, icon: '◎', description: 'Publish and sell creative works' },
  { id: 'soko', label: 'Soko Exchange', minTier: MembershipTier.Creator, icon: '◇', description: 'Ecosystem marketplace access' },
  { id: 'nommo', label: 'Nommo AI', minTier: MembershipTier.Architect, icon: '◌', description: 'AI-native ecosystem intelligence' },
  { id: 'sankofa', label: 'Sankofa Analytics', minTier: MembershipTier.Architect, icon: '◐', description: 'Full contribution analytics' },
  { id: 'baraka', label: 'Baraka Treasury', minTier: MembershipTier.Guardian, icon: '◑', description: 'Treasury governance participation' },
  { id: 'askari', label: 'Askari Council', minTier: MembershipTier.Guardian, icon: '◒', description: 'Emergency security council' },
]

export function AccessGrid() {
  const tier = SAMPLE_MEMBERSHIP.tier

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-ynklv-muted mb-4">Ecosystem access</p>
      <div className="grid grid-cols-2 gap-3">
        {ACCESS_FEATURES.map((feature) => {
          const granted = tier >= feature.minTier
          return (
            <div
              key={feature.id}
              className={`p-4 rounded-xl border transition-all ${
                granted
                  ? 'border-ynklv bg-ynklv-surface hover:border-copper/50'
                  : 'border-ynklv/30 bg-ynklv-surface/30 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-lg ${granted ? 'text-ynklv-copper' : 'text-ynklv-muted'}`}>{feature.icon}</span>
                <span className={`text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 ${
                  granted ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'
                }`}>
                  {granted ? 'Active' : 'Locked'}
                </span>
              </div>
              <p className={`text-sm font-medium ${granted ? 'text-ynklv-cream' : 'text-ynklv-muted'}`}>{feature.label}</p>
              <p className="text-xs text-ynklv-muted mt-0.5">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
