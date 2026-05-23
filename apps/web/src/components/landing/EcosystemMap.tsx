'use client'

import { motion } from 'framer-motion'
import { stagger, rise, riseSubtle, scaleIn, ease, viewport } from '@/lib/motion'
import { HexGlyph } from '@/components/ui/HexGlyph'
import { SectionLabel, EditorialHeading } from '@/components/ui/Typography'

const nodes = [
  {
    id:        'pass',
    label:     'The Pass',
    sublabel:  'Dynamic NFT Identity',
    fill:      0.6,
    desc:      'Your proof of belonging. A living credential that evolves with your contribution. Not a ticket — a record of who you are in this civilization.',
    tier:      'Builder Tier',
    hex:       60,
  },
  {
    id:        'studio',
    label:     'YNKLV Studio',
    sublabel:  'Creator Monetization',
    fill:      0.45,
    desc:      '90% of every sale goes directly to creators. Zero negotiation. Hardcoded in the smart contract. Enforced by mathematics, not promises.',
    tier:      '90% Creator Split',
    hex:       60,
  },
  {
    id:        'ai',
    label:     'YNKLV AI',
    sublabel:  'Afro-native Intelligence',
    fill:      0.3,
    desc:      'Eké Writer. Oro Visuals. Bassa Audio. AI tools trained on Afro-global creative tradition — not generic, not borrowed. Built from within.',
    tier:      'Pass Required',
    hex:       60,
  },
  {
    id:        'governance',
    label:     'Governance',
    sublabel:  'On-chain Democracy',
    fill:      0.75,
    desc:      'Every Pass holder votes. Every proposal goes through TimelockController. Treasury disbursements are public. No boardroom decisions.',
    tier:      'EPS-Weighted',
    hex:       60,
  },
  {
    id:        'city',
    label:     'City Charters',
    sublabel:  'Local Infrastructure',
    fill:      0.5,
    desc:      'Lagos. Kinshasa. Abidjan. Paris. Each city governs its local treasury, funds its local creators, and leaves a permanent record in the Living Ledger.',
    tier:      '18 Active Cities',
    hex:       60,
  },
  {
    id:        'academy',
    label:     'Academy',
    sublabel:  'Knowledge Architecture',
    fill:      0.35,
    desc:      'Courses that earn credentials. Credentials that unlock tier upgrades. Learning as participation — not consumption.',
    tier:      '24,700 Completed',
    hex:       60,
  },
]

const networkEffects = [
  {
    label:   'Creator Network Effect',
    desc:    'More creators → richer content → higher Pass value → more participation',
  },
  {
    label:   'Identity Network Effect',
    desc:    'More holders → stronger reputation signals → better Sybil resistance → real governance',
  },
  {
    label:   'Liquidity Network Effect',
    desc:    'More utility demand → natural token demand → sustainable treasury → more utility',
  },
]

export function EcosystemMap() {
  return (
    <section id="ecosystem" className="relative py-32 md:py-48 overflow-hidden">

      {/* Background hex grid — ultra subtle */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='30,2 56,16 56,44 30,50 4,44 4,16' stroke='%23C8A45A' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 52px',
        }}
      />

      <div className="container-ynklv">

        {/* Header */}
        <div className="max-w-2xl mb-20 md:mb-28">
          <SectionLabel className="mb-6">The Ecosystem</SectionLabel>
          <EditorialHeading className="text-fluid-2xl text-[var(--blanc)] mb-6">
            Six interconnected systems. One civilization.
          </EditorialHeading>
          <motion.p
            className="t-prose text-[var(--blanc-60)] leading-relaxed"
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            Every utility compounds the others. The Pass makes Studio meaningful.
            Studio funds the treasury. The treasury governs the ecosystem. Governance shapes
            the next Epoch. This is not a product roadmap — it is a living organism.
          </motion.p>
        </div>

        {/* Node grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(200,164,90,0.07)]"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px 0px' }}
        >
          {nodes.map(({ id, label, sublabel, fill, desc, tier, hex }) => (
            <motion.div
              key={id}
              className="group relative bg-[var(--void)] p-8 md:p-10 flex flex-col gap-6
                         hover:bg-[rgba(200,164,90,0.03)] transition-colors duration-500
                         cursor-default"
              variants={riseSubtle}
            >
              {/* Hex glyph */}
              <div className="flex items-start justify-between">
                <HexGlyph
                  size={hex}
                  fill={fill}
                  stroke="#C8A45A"
                  variant={fill > 0.6 ? 'glow' : 'outline'}
                />
                <span className="t-label text-[var(--or)] text-[9px] tracking-[0.2em] opacity-70 mt-1">
                  {tier}
                </span>
              </div>

              {/* Label */}
              <div>
                <h3 className="font-display text-[var(--blanc)] text-lg tracking-tight mb-1">
                  {label}
                </h3>
                <p className="t-label text-[var(--blanc-40)] tracking-[0.15em] uppercase text-[9px]">
                  {sublabel}
                </p>
              </div>

              {/* Description */}
              <p className="t-prose text-[var(--blanc-50)] text-sm leading-relaxed flex-1">
                {desc}
              </p>

              {/* Hover line */}
              <motion.div
                className="absolute bottom-0 left-0 h-px bg-[var(--or)] opacity-0
                           group-hover:opacity-60 transition-opacity duration-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 0 }}
                style={{ transformOrigin: 'left' }}
              />
              <div
                className="absolute bottom-0 left-0 h-px bg-[var(--or)] opacity-0
                           group-hover:opacity-40 w-full scale-x-0 group-hover:scale-x-100
                           transition-transform duration-500 origin-left"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Network effects */}
        <div className="mt-24 md:mt-32">
          <motion.p
            className="t-label text-[var(--blanc-30)] tracking-[0.2em] uppercase mb-10 text-center"
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            Three Compounding Network Effects
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(200,164,90,0.07)]"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {networkEffects.map(({ label, desc }) => (
              <motion.div
                key={label}
                className="bg-[var(--void)] p-8 flex flex-col gap-4"
                variants={riseSubtle}
              >
                <div className="w-6 h-px bg-[var(--or)] opacity-60" />
                <h4 className="font-editorial text-[var(--blanc)] text-base leading-tight">
                  {label}
                </h4>
                <p className="t-prose text-[var(--blanc-40)] text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
