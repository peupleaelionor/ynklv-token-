'use client'

import { motion } from 'framer-motion'
import { stagger, rise, riseSubtle, scaleIn, ease, viewport } from '@/lib/motion'
import { HexGlyph } from '@/components/ui/HexGlyph'
import { SectionLabel, EditorialHeading, StatNumber } from '@/components/ui/Typography'

const allocations = [
  { label: 'Community Rewards', pct: 30, desc: 'EPS rewards, grants, City Charter treasuries' },
  { label: 'Team',              pct: 18, desc: '48-month vesting (18mo cliff + 30mo linear)' },
  { label: 'Ecosystem Fund',    pct: 17, desc: 'Partnerships, integrations, studio grants' },
  { label: 'Liquidity',         pct: 15, desc: 'DEX pools locked 24 months minimum' },
  { label: 'Public Sale',       pct: 10, desc: 'Fair launch, no presale, no whitelist advantage' },
  { label: 'Strategic Reserve', pct:  6, desc: '4-of-7 multisig, governance-governed release' },
  { label: 'Advisors',          pct:  3, desc: '24-month linear vesting, revocable' },
  { label: 'Founders',          pct:  1, desc: 'Hard-locked 48 months. No exceptions.' },
]

const burnMechanics = [
  { trigger: 'AI Credit Use',      rate: '1 YNKLV per credit burned at execution' },
  { trigger: 'Token Transfers',    rate: '0.1% of each transfer permanently burned' },
  { trigger: 'Pass Minting',       rate: '50 YNKLV burned per new Pass issued' },
  { trigger: 'Governance Vote',    rate: '1 YNKLV per proposal submission (anti-spam)' },
]

const antiSpeculative = [
  'No price tickers anywhere on this website.',
  'No APY promises. No "guaranteed returns." No "early investor" framing.',
  'Team tokens locked 48 months. Longer than every employee will stay.',
  'Liquidity locked 24 months in public, auditable contracts.',
  'Two independent audits before any token is tradable.',
  'Treasury transactions are public, timestamped, and governance-approved.',
]

export function TokenSection() {
  const total = allocations.reduce((sum, a) => sum + a.pct, 0) // 100

  return (
    <section id="token" className="relative py-32 md:py-48 overflow-hidden">

      {/* Background: ultra-faint Or lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 40%, rgba(200,164,90,0.015) 100%)',
        }}
      />

      <div className="container-ynklv">

        {/* Header */}
        <div className="max-w-2xl mb-20">
          <SectionLabel className="mb-6">The Token</SectionLabel>
          <EditorialHeading className="text-fluid-2xl text-[var(--blanc)] mb-6">
            One billion YNKLV. Fixed forever.
          </EditorialHeading>
          <motion.p
            className="t-prose text-[var(--blanc-60)] leading-relaxed"
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            No mint function. No admin key. No upgradeable contract. Supply is fixed at
            genesis — hardcoded, not policy. The only way supply decreases is through
            genuine ecosystem use.
          </motion.p>
        </div>

        {/* Key stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(200,164,90,0.07)] mb-20"
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {[
            { value: '1,000,000,000', label: 'Total Supply' },
            { value: 'ERC-20',        label: 'Standard (Base L2)' },
            { value: '4.2M',          label: 'Already Burned' },
            { value: '24 mo',         label: 'Liquidity Lock' },
          ].map(({ value, label }) => (
            <motion.div
              key={label}
              className="bg-[var(--void)] p-8 md:p-10"
              variants={riseSubtle}
            >
              <p className="t-numeral gradient-or bg-clip-text text-transparent text-2xl md:text-3xl font-bold mb-3 leading-none">
                {value}
              </p>
              <p className="t-label text-[var(--blanc-40)] text-[9px] tracking-[0.2em] uppercase">
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Allocation chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">

          {/* Visual bar chart */}
          <div>
            <motion.h3
              className="font-editorial text-[var(--blanc)] text-lg mb-8"
              variants={rise}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              Token Allocation
            </motion.h3>

            <motion.div
              className="flex flex-col gap-3"
              variants={stagger(0.06)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {allocations.map(({ label, pct, desc }) => (
                <motion.div key={label} className="flex flex-col gap-1.5" variants={riseSubtle}>
                  <div className="flex items-center justify-between">
                    <span className="t-label text-[var(--blanc)] text-xs">{label}</span>
                    <span className="t-numeral text-[var(--or)] text-xs font-semibold">{pct}%</span>
                  </div>
                  {/* Bar */}
                  <div className="h-1 bg-[rgba(200,164,90,0.08)] rounded-none overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#9E7E33] to-[#C8A45A]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.0, delay: 0.1, ease: ease.silk }}
                    />
                  </div>
                  <p className="t-prose text-[var(--blanc-35)] text-xs">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Burn mechanics */}
          <div>
            <motion.h3
              className="font-editorial text-[var(--blanc)] text-lg mb-8"
              variants={rise}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              Burn Mechanics
            </motion.h3>

            <motion.div
              className="flex flex-col gap-4"
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {burnMechanics.map(({ trigger, rate }) => (
                <motion.div
                  key={trigger}
                  className="p-5 border border-[rgba(200,164,90,0.1)] flex flex-col gap-2"
                  variants={riseSubtle}
                >
                  <p className="font-editorial text-[var(--blanc)] text-sm">{trigger}</p>
                  <p className="t-prose text-[var(--blanc-50)] text-xs leading-snug">{rate}</p>
                </motion.div>
              ))}

              <motion.p
                className="t-prose text-[var(--blanc-40)] text-xs leading-relaxed pt-2"
                variants={riseSubtle}
              >
                Every burn is usage-triggered — not scheduled, not manual, not a
                team decision. Supply reduction is a consequence of ecosystem health.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Anti-speculative section */}
        <motion.div
          className="border border-[rgba(200,164,90,0.12)] p-8 md:p-12"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div className="flex items-start gap-6 mb-8">
            <HexGlyph size={40} fill={0.9} stroke="#C8A45A" variant="glow" />
            <div>
              <h3 className="font-editorial text-[var(--blanc)] text-xl mb-2">
                We are not a speculation vehicle.
              </h3>
              <p className="t-prose text-[var(--blanc-50)] text-sm leading-relaxed">
                Every design decision in YNKLV is optimized for legitimacy, longevity, and
                genuine utility — not short-term price movement.
              </p>
            </div>
          </div>

          <motion.ul
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            variants={stagger(0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {antiSpeculative.map((point, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 t-prose text-[var(--blanc-60)] text-sm leading-relaxed"
                variants={riseSubtle}
              >
                <span className="text-[var(--or)] shrink-0 mt-0.5 text-xs">✦</span>
                {point}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}
