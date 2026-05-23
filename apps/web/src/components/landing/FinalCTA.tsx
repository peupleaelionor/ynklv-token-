'use client'

import { motion } from 'framer-motion'
import { stagger, rise, riseSubtle, goldPulse, ease, t, viewport } from '@/lib/motion'
import { HexGlyph } from '@/components/ui/HexGlyph'
import { YNKLVWordmark } from '@/components/ui/Typography'

const joinPaths = [
  {
    icon:  '✦',
    label: 'Hold 100 YANKELV',
    desc:  'Qualify to mint your Pass and enter the ecosystem.',
  },
  {
    icon:  '◈',
    label: 'Mint your Pass',
    desc:  'Free with qualifying balance. Your identity on-chain.',
  },
  {
    icon:  '⬡',
    label: 'Earn your tier',
    desc:  'Build EPS through creation, governance, and community.',
  },
  {
    icon:  '◉',
    label: 'Shape the future',
    desc:  'Vote on proposals. Charter a city. Leave a mark.',
  },
]

export function FinalCTA() {
  return (
    <section id="join" className="relative py-32 md:py-56 overflow-hidden">

      {/* Hero radial glow — Or */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewport}
        transition={{ duration: 2, ease: ease.silk }}
      >
        <div
          style={{
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(200,164,90,0.09) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </motion.div>

      {/* Noise */}
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="container-ynklv relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Glyph */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 1.2, ease: ease.spring }}
          >
            <motion.div {...goldPulse}>
              <HexGlyph size={96} fill={0.75} stroke="#C8A45A" variant="glow" animated />
            </motion.div>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="mb-6 overflow-hidden"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {['The civilization', 'begins with you.'].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.h2
                  className={[
                    'font-display leading-[1.04] tracking-tight',
                    'text-fluid-2xl md:text-fluid-3xl',
                    i === 1 ? 'gradient-or bg-clip-text text-transparent' : 'text-[var(--blanc)]',
                  ].join(' ')}
                  variants={{
                    hidden:  { y: '110%' },
                    visible: { y: '0%', transition: { duration: 1.0, ease: ease.reveal } },
                  }}
                >
                  {line}
                </motion.h2>
              </div>
            ))}
          </motion.div>

          {/* Subtext */}
          <motion.p
            className="t-prose text-[var(--blanc-60)] max-w-lg mx-auto leading-relaxed mb-16"
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            Every great institution was once a first step. This is yours.
            The ecosystem is live. The Pass is mintable. The epoch has begun.
          </motion.p>

          {/* Steps */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(200,164,90,0.07)] mb-16"
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {joinPaths.map(({ icon, label, desc }, i) => (
              <motion.div
                key={label}
                className="bg-[var(--void)] p-6 md:p-8 text-left"
                variants={riseSubtle}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[var(--or)] text-lg">{icon}</span>
                  <span className="t-label text-[var(--blanc-30)] text-[9px] tracking-[0.2em]">
                    STEP {i + 1}
                  </span>
                </div>
                <p className="font-editorial text-[var(--blanc)] text-sm mb-2">{label}</p>
                <p className="t-prose text-[var(--blanc-50)] text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.a
              href="/app"
              className="px-10 py-5 bg-[var(--or)] text-[var(--void)] text-xs font-bold
                         tracking-[0.2em] uppercase hover:brightness-110 transition-all
                         duration-300 rounded-sm min-w-[220px] text-center"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={t.fast}
            >
              Enter the Ecosystem
            </motion.a>
            <motion.a
              href="#ecosystem"
              className="px-10 py-5 border border-[rgba(200,164,90,0.3)] text-[var(--blanc-60)]
                         text-xs font-medium tracking-[0.15em] uppercase hover:border-[var(--or)]
                         hover:text-[var(--or)] transition-all duration-300 rounded-sm
                         min-w-[220px] text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={t.fast}
            >
              Explore the System
            </motion.a>
          </motion.div>

          {/* Epoch label */}
          <motion.p
            className="mt-12 t-label text-[var(--blanc-25)] text-[9px] tracking-[0.3em] uppercase"
            variants={riseSubtle}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            Cultural Epoch 01 — GENESIS — Now Active
          </motion.p>
        </div>
      </div>

      {/* Footer divider */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[rgba(200,164,90,0.07)]" />
    </section>
  )
}

// ─── Full footer ──────────────────────────────────────────────────────────────

export function SiteFooter() {
  const footerLinks = {
    Ecosystem:  ['Pass',     'Studio', 'AI',      'Governance'],
    Learn:      ['Academy',  'Docs',   'Manifesto', 'Whitepaper'],
    Community:  ['Telegram', 'X',      'Discord',  'GitHub'],
    Legal:      ['Privacy',  'Terms',  'Audit Reports', 'Treasury'],
  }

  return (
    <footer className="border-t border-[rgba(200,164,90,0.08)] py-16 md:py-20">
      <div className="container-ynklv">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <HexGlyph size={24} stroke="#C8A45A" />
              <span className="font-display text-[var(--or)] tracking-[0.22em] text-[13px] uppercase">
                YANKELV
              </span>
            </div>
            <p className="t-prose text-[var(--blanc-35)] text-xs leading-relaxed">
              The Afro-global digital asset ecosystem. Built for permanence.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="t-label text-[var(--blanc-40)] text-[9px] tracking-[0.25em] uppercase mb-4">
                {category}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="t-prose text-[var(--blanc-50)] text-sm hover:text-[var(--blanc)]
                                 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(200,164,90,0.07)] pt-8 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <p className="t-label text-[var(--blanc-25)] text-[9px] tracking-[0.2em]">
            © 2026 YANKELV FOUNDATION — ALL RIGHTS RESERVED
          </p>
          <p className="t-label text-[var(--blanc-25)] text-[9px] tracking-[0.15em]">
            TOBONGISA MBOKA — BUILD THE CIVILIZATION
          </p>
        </div>
      </div>
    </footer>
  )
}
