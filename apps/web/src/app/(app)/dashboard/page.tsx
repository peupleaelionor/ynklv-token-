'use client'

import { motion } from 'framer-motion'
import { stagger, rise, riseSubtle, goldPulse, ease, viewport } from '@/lib/motion'
import { HexGlyph } from '@/components/ui/HexGlyph'

// Mock data — replace with useYNKLV hooks
const mockUser = {
  address:    '0x1a2b3c4d5e6f...',
  name:       'aminata.ynklv',
  display:    'Aminata Diallo',
  tier:       'Builder' as const,
  eps: {
    total:          742,
    holdScore:      310,
    activityScore:  254,
    communityScore: 178,
    nextTier:       'Architect',
    progressToNext: 0.486,
  },
  balance:    '15,200',
  studio: {
    totalEarned: '45,200',
    products:    12,
    sales:       384,
  },
  governance: {
    votes:     18,
    proposals: 2,
  },
  city:       'Lagos',
  epochsLived: 3,
}

const activity = [
  { type: 'sale',      desc: 'Lagos Afrobeats Kit Vol.3',        value: '+240 YNKLV',  time: '2h ago'  },
  { type: 'vote',      desc: 'Voted on DRC Creator Grant PROP-42', value: '+1 EPS',   time: '1d ago'  },
  { type: 'course',    desc: 'Completed "On-chain Music Rights"',  value: '+12 EPS',   time: '3d ago'  },
  { type: 'hold',      desc: 'Monthly hold score updated',         value: '+25 EPS',   time: '5d ago'  },
]

export default function DashboardPage() {
  const { eps, studio, governance } = mockUser
  const fill = eps.progressToNext

  return (
    <div className="min-h-screen bg-[var(--void)] px-6 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">

        {/* ── Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          variants={stagger(0.08)}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={rise}>
            <p className="t-label text-[var(--or)] tracking-[0.25em] text-[9px] mb-3">
              CULTURAL EPOCH 01 — GENESIS
            </p>
            <h1 className="font-display text-[var(--blanc)] text-2xl md:text-3xl tracking-tight">
              {mockUser.display}
            </h1>
            <p className="t-label text-[var(--blanc-40)] text-xs mt-1">{mockUser.name}</p>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 text-[var(--blanc-40)] t-label text-[9px] tracking-[0.15em]"
            variants={riseSubtle}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            BASE MAINNET
          </motion.div>
        </motion.div>

        {/* ── Main grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[rgba(200,164,90,0.07)] mb-6"
          variants={stagger(0.06)}
          initial="hidden"
          animate="visible"
        >
          {/* Pass card */}
          <motion.div
            className="bg-[var(--void)] p-8 lg:p-10 col-span-1 flex flex-col gap-6"
            variants={riseSubtle}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="t-label text-[var(--blanc-35)] text-[9px] tracking-[0.2em] mb-2">
                  YOUR PASS
                </p>
                <p className="font-display text-[var(--or)] text-xl">{mockUser.tier}</p>
                <p className="t-label text-[var(--blanc-35)] text-[9px] mt-1">
                  {mockUser.epochsLived} Epochs Lived
                </p>
              </div>
              <motion.div {...goldPulse}>
                <HexGlyph size={56} fill={fill} stroke="#C8A45A" variant="glow" />
              </motion.div>
            </div>

            {/* Progress to next tier */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="t-label text-[var(--blanc-40)] text-[9px] tracking-[0.15em]">
                  → {eps.nextTier.toUpperCase()}
                </span>
                <span className="t-numeral text-[var(--or)] text-xs">
                  {Math.round(eps.progressToNext * 100)}%
                </span>
              </div>
              <div className="h-0.5 bg-[rgba(200,164,90,0.1)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#9E7E33] to-[#C8A45A]"
                  initial={{ width: 0 }}
                  animate={{ width: `${eps.progressToNext * 100}%` }}
                  transition={{ duration: 1.2, delay: 0.4, ease: ease.silk }}
                />
              </div>
            </div>

            {/* City */}
            <div className="border-t border-[rgba(200,164,90,0.08)] pt-4">
              <p className="t-label text-[var(--blanc-30)] text-[9px] tracking-[0.2em] mb-1">
                CITY CHARTER
              </p>
              <p className="font-editorial text-[var(--blanc)] text-sm">{mockUser.city}</p>
            </div>
          </motion.div>

          {/* EPS breakdown */}
          <motion.div
            className="bg-[var(--void)] p-8 lg:p-10 col-span-1 flex flex-col gap-6"
            variants={riseSubtle}
          >
            <div>
              <p className="t-label text-[var(--blanc-35)] text-[9px] tracking-[0.2em] mb-2">
                ECOSYSTEM PARTICIPATION SCORE
              </p>
              <p className="t-numeral gradient-or bg-clip-text text-transparent text-5xl font-bold">
                {eps.total}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { label: 'Hold Score',       value: eps.holdScore,      pct: eps.holdScore      / eps.total },
                { label: 'Activity Score',   value: eps.activityScore,  pct: eps.activityScore  / eps.total },
                { label: 'Community Score',  value: eps.communityScore, pct: eps.communityScore / eps.total },
              ].map(({ label, value, pct }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="t-label text-[var(--blanc-40)] text-[9px] tracking-[0.1em]">{label}</span>
                    <span className="t-numeral text-[var(--blanc)] text-xs">{value}</span>
                  </div>
                  <div className="h-px bg-[rgba(200,164,90,0.08)]">
                    <motion.div
                      className="h-full bg-[rgba(200,164,90,0.35)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct * 100}%` }}
                      transition={{ duration: 1.0, delay: 0.5, ease: ease.silk }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[rgba(200,164,90,0.08)] pt-4">
              <p className="t-label text-[var(--blanc-30)] text-[9px] tracking-[0.2em] mb-1">
                ESTIMATED MONTHLY REWARD
              </p>
              <p className="font-editorial text-[var(--or)] text-sm">~125 YNKLV</p>
            </div>
          </motion.div>

          {/* Wallet + Studio */}
          <motion.div
            className="bg-[var(--void)] p-8 lg:p-10 col-span-1 flex flex-col gap-6"
            variants={riseSubtle}
          >
            <div>
              <p className="t-label text-[var(--blanc-35)] text-[9px] tracking-[0.2em] mb-2">
                BALANCE
              </p>
              <p className="t-numeral text-[var(--blanc)] text-4xl font-bold">
                {mockUser.balance}
                <span className="text-[var(--or)] text-base ml-2">YNKLV</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Earned',  value: studio.totalEarned + ' YNKLV' },
                { label: 'Products',      value: String(studio.products)        },
                { label: 'Total Sales',   value: String(studio.sales)           },
                { label: 'Gov. Votes',    value: String(governance.votes)       },
              ].map(({ label, value }) => (
                <div key={label} className="border border-[rgba(200,164,90,0.08)] p-4">
                  <p className="t-label text-[var(--blanc-30)] text-[8px] tracking-[0.15em] mb-1">
                    {label.toUpperCase()}
                  </p>
                  <p className="t-numeral text-[var(--blanc)] text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Activity feed */}
        <motion.div
          className="bg-[rgba(200,164,90,0.03)] border border-[rgba(200,164,90,0.07)]"
          variants={rise}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <div className="px-8 py-5 border-b border-[rgba(200,164,90,0.07)]">
            <p className="t-label text-[var(--blanc-40)] text-[9px] tracking-[0.2em]">
              RECENT ACTIVITY
            </p>
          </div>
          <div className="divide-y divide-[rgba(200,164,90,0.05)]">
            {activity.map(({ type, desc, value, time }) => (
              <div
                key={desc}
                className="px-8 py-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[var(--or)] text-xs opacity-60">
                    {type === 'sale' ? '◈' : type === 'vote' ? '◉' : type === 'course' ? '✦' : '⬡'}
                  </span>
                  <span className="t-prose text-[var(--blanc-60)] text-sm">{desc}</span>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <span className="t-numeral text-[var(--or)] text-xs font-semibold">{value}</span>
                  <span className="t-label text-[var(--blanc-25)] text-[9px] tracking-[0.1em]">{time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Cultural anchor */}
        <motion.p
          className="mt-16 t-label text-[var(--blanc-20)] text-[9px] tracking-[0.3em] uppercase text-center"
          variants={rise}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          CULTURAL EPOCH 01 — GENESIS — TOBONGISA MBOKA
        </motion.p>
      </div>
    </div>
  )
}
