'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { stagger, rise, riseSubtle, ease, viewport } from '@/lib/motion'
import { HexGlyph } from '@/components/ui/HexGlyph'
import { SectionLabel, EditorialHeading } from '@/components/ui/Typography'

const tiers = [
  {
    name:  'Newcomer',
    fill:  0.1,
    eps:   '0 – 99',
    color: 'var(--blanc-40)',
    perks: ['Ecosystem read access', 'Studio browse', 'Governance view', 'Basic AI credits'],
  },
  {
    name:  'Member',
    fill:  0.3,
    eps:   '100 – 499',
    color: 'var(--blanc)',
    perks: ['Studio publish', 'City Charter voting', 'Academy access', 'EPS rewards begin'],
  },
  {
    name:  'Builder',
    fill:  0.55,
    eps:   '500 – 999',
    color: 'var(--or)',
    perks: ['Full AI suite (Eké + Oro + Bassa)', 'Governance proposals', 'Premium Academy', 'Referral bonus'],
    featured: true,
  },
  {
    name:  'Architect',
    fill:  0.78,
    eps:   '1,000 – 2,499',
    color: '#E0C27A',
    perks: ['Council voting rights', 'City Charter creation', 'Beta products', 'Maximum EPS multiplier'],
  },
  {
    name:  'Legend',
    fill:  1,
    eps:   '2,500+',
    color: '#E8D48A',
    perks: ['Black Pass (1,000 limit)', 'Protocol design input', 'Living Ledger authorship', 'Founding cohort credential'],
  },
]

const studioFeatures = [
  { stat: '90%',   desc: 'Revenue to creator — hardcoded in smart contract' },
  { stat: '8.5%',  desc: 'Ecosystem treasury for grants and development' },
  { stat: '1.5%',  desc: 'Burned permanently, reducing supply' },
  { stat: '5',     desc: 'Maximum collaborators with defined revenue shares' },
]

export function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%'])

  return (
    <section ref={sectionRef} id="studio" className="relative py-32 md:py-48">

      {/* Animated vertical Or line */}
      <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-px bg-[rgba(200,164,90,0.06)] hidden lg:block">
        <motion.div
          className="w-full bg-gradient-to-b from-[var(--or)] to-transparent origin-top"
          style={{ height: lineHeight, opacity: 0.3 }}
        />
      </div>

      <div className="container-ynklv">

        {/* ── Pass tier system */}
        <div className="mb-32 md:mb-48">
          <div className="max-w-2xl mb-16">
            <SectionLabel className="mb-6">The Pass</SectionLabel>
            <EditorialHeading className="text-fluid-2xl text-[var(--blanc)] mb-6">
              Your reputation, made permanent.
            </EditorialHeading>
            <motion.p
              className="t-prose text-[var(--blanc-60)] leading-relaxed"
              variants={rise}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              The YNKLV Pass is a dynamic ERC-721 — a living credential that evolves as you
              do. Five tiers. Infinite depths. One permanent record on-chain.
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col md:flex-row items-stretch gap-px bg-[rgba(200,164,90,0.07)]"
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px 0px' }}
          >
            {tiers.map(({ name, fill, eps, color, perks, featured }) => (
              <motion.div
                key={name}
                className={[
                  'flex-1 bg-[var(--void)] p-7 flex flex-col gap-5 relative',
                  featured ? 'ring-1 ring-[rgba(200,164,90,0.25)]' : '',
                ].join(' ')}
                variants={riseSubtle}
              >
                {featured && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-[var(--or)] opacity-60" />
                )}

                <HexGlyph size={52} fill={fill} stroke="#C8A45A" />

                <div>
                  <p
                    className="font-display text-sm tracking-tight mb-0.5"
                    style={{ color }}
                  >
                    {name}
                  </p>
                  <p className="t-label text-[var(--blanc-30)] text-[9px] tracking-[0.2em]">
                    {eps} EPS
                  </p>
                </div>

                <ul className="flex flex-col gap-2 mt-auto">
                  {perks.map(p => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="text-[var(--or)] text-[10px] mt-[3px] shrink-0">✦</span>
                      <span className="t-prose text-[var(--blanc-50)] text-xs leading-snug">{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Studio economics */}
        <div>
          <div className="max-w-2xl mb-16">
            <SectionLabel className="mb-6">YNKLV Studio</SectionLabel>
            <EditorialHeading className="text-fluid-2xl text-[var(--blanc)] mb-6">
              The creative economy, redesigned from first principles.
            </EditorialHeading>
            <motion.p
              className="t-prose text-[var(--blanc-60)] leading-relaxed"
              variants={rise}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              Audio. Visuals. Writing. Video. Access. Publish once. Earn in YNKLV.
              The 90/8.5/1.5 split is not a policy — it is a mathematical invariant
              in the contract itself.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(200,164,90,0.07)]"
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {studioFeatures.map(({ stat, desc }) => (
              <motion.div
                key={stat}
                className="bg-[var(--void)] p-8 md:p-10"
                variants={riseSubtle}
              >
                <p className="t-numeral gradient-or bg-clip-text text-transparent text-4xl md:text-5xl font-bold mb-4">
                  {stat}
                </p>
                <p className="t-prose text-[var(--blanc-50)] text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Geographic pricing note */}
          <motion.div
            className="mt-8 p-6 md:p-8 border border-[rgba(200,164,90,0.12)]
                       flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="w-8 h-px bg-[var(--or)] opacity-60 shrink-0 mt-3 sm:mt-0" />
            <div>
              <p className="t-prose text-[var(--blanc-70)] text-sm leading-relaxed">
                <strong className="text-[var(--blanc)]">Geographic pricing:</strong> Creators
                can set regional discounts — reducing prices by up to 70% for Region B (West
                Africa, East Africa) and 50% for Region A (Global South). The same creator
                revenue percentage applies at every price tier. Dignity, not charity.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
