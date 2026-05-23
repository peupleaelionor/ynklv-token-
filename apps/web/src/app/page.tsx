'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

// ─── Hero ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="bg-void min-h-screen">
      <HeroSection />
      <StatementSection />
      <ForSection />
      <EcosystemSection />
      <NumbersSection />
      <OriginSection />
      <TokenSection />
      <RoadmapSection />
      <TransparencySection />
      <CTASection />
    </main>
  )
}

// ─── SECTION 1: Hero ───────────────────────────────────────────────────────

function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <section
      ref={ref}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background video/image */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-void/60 to-void" />
        {/* Replace with <video> or <Image> in production */}
        <div className="w-full h-full bg-gradient-void" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-blanc/30 text-xs uppercase tracking-[0.3em] mb-16"
        >
          YNKLV
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="
            font-display text-6xl md:text-8xl lg:text-9xl
            text-blanc tracking-display leading-none
            mb-12
          "
        >
          Build the
          <br />
          <span className="text-gradient-or">Civilization.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/app"
            className="
              h-14 px-10 text-base
              bg-or text-void font-body font-medium tracking-wide
              rounded-xl
              hover:bg-or-light transition-all duration-300
              hover:shadow-or
              active:scale-[0.98]
            "
          >
            Join the Ecosystem
          </Link>
          <Link
            href="/docs/00-manifesto"
            className="
              h-14 px-10 text-base
              text-blanc/70 font-body font-light tracking-wide
              hover:text-blanc transition-colors duration-200
            "
          >
            Read the Manifesto →
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-blanc/20 to-transparent" />
      </motion.div>
    </section>
  )
}

// ─── SECTION 2: Statement ──────────────────────────────────────────────────

function StatementSection() {
  return (
    <section className="py-40 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="
            font-body text-2xl md:text-3xl lg:text-4xl
            text-blanc font-light leading-snug
          "
        >
          YNKLV is the financial and cultural infrastructure
          for Afro-global creators, builders, and communities
          who are done building for others.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-lg text-or font-editorial italic"
        >
          Not a coin. A civilization.
        </motion.p>
      </div>
    </section>
  )
}

// ─── SECTION 3: For ────────────────────────────────────────────────────────

function ForSection() {
  const cols = [
    {
      title: 'CREATORS',
      items: ['Musicians.', 'Designers.', 'Writers.', 'Filmmakers.'],
      desc:  'Monetize your work globally.',
    },
    {
      title: 'BUILDERS',
      items: ['Developers.', 'Architects.', 'Entrepreneurs.', 'Founders.'],
      desc:  'Build on open rails.',
    },
    {
      title: 'COMMUNITIES',
      items: ['Families.', 'Collectives.', 'Institutions.', 'Cities.'],
      desc:  'Create micro-economies.',
    },
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-px bg-white/[0.06]">
        {cols.map((col, i) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-void p-10"
          >
            <p className="text-xs tracking-widest text-blanc/30 uppercase mb-8">
              {col.title}
            </p>
            <ul className="space-y-1 mb-8">
              {col.items.map((item) => (
                <li key={item} className="text-lg font-body font-light text-blanc">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-blanc/40 font-body">{col.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── SECTION 4: Ecosystem ──────────────────────────────────────────────────

function EcosystemSection() {
  const products = [
    { name: 'YNKLV AI',      desc: 'AI creative tools for Afro-global professionals',    href: '/ai'       },
    { name: 'YNKLV Studio',  desc: 'Creator economy for Afro-global creators',            href: '/studio'   },
    { name: 'YNKLV Pass',    desc: 'Digital identity for Afro-global participants',       href: '/pass'     },
    { name: 'YNKLV Academy', desc: 'Skills and credentials for digital economy builders', href: '/academy'  },
    { name: 'YNKLV Wallet',  desc: 'Mobile-first wallet designed for Africa',             href: '/wallet'   },
    { name: 'YNKLV Identity',desc: 'Professional reputation on-chain',                   href: '/identity' },
  ]

  return (
    <section className="py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-blanc/30 mb-16">
          The Ecosystem
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
          {products.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.href}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="
                group bg-void p-8
                hover:bg-surface-1 transition-colors duration-300
              "
            >
              <p className="text-blanc font-body font-medium mb-3 group-hover:text-or transition-colors duration-200">
                {p.name}
              </p>
              <p className="text-sm text-blanc/40 font-body leading-relaxed">
                {p.desc}
              </p>
              <p className="mt-6 text-xs text-blanc/20 group-hover:text-or/60 transition-colors duration-200">
                Learn more →
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 5: Numbers ────────────────────────────────────────────────────

function NumbersSection() {
  const stats = [
    { value: '1,000,000,000', label: 'Fixed token supply. Forever.' },
    { value: '1.4 Billion',   label: 'People in Africa.'            },
    { value: '30 Million',    label: 'African diaspora globally.'   },
    { value: '0',             label: 'Admin keys over your tokens.' },
  ]

  return (
    <section className="py-24 px-6 bg-nuit/30">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <p className="font-display text-3xl md:text-4xl text-or mb-3 leading-none">
              {s.value}
            </p>
            <p className="text-sm text-blanc/40 font-body leading-relaxed">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── SECTION 6: Origin ────────────────────────────────────────────────────

function OriginSection() {
  return (
    <section className="py-40 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-5xl md:text-6xl text-blanc tracking-display leading-tight mb-10">
            Born in Africa.
            <br />
            <span className="text-or">Designed for the world.</span>
          </h2>
          <div className="prose-ynklv space-y-6">
            <p>
              There is a generation of creators, developers, and entrepreneurs spread
              across Lagos, Kinshasa, Dakar, Abidjan, London, and Paris who are building
              things the world consumes — music, code, fashion, stories.
            </p>
            <p>
              The infrastructure that powers their ambitions is almost entirely owned
              by others.
            </p>
            <p className="text-or font-editorial italic text-xl">
              YNKLV changes that. Not through revolution. Through architecture.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="aspect-square bg-surface-2 rounded-3xl flex items-center justify-center"
        >
          {/* World map with ambassador city dots — SVG in production */}
          <HexGlyph size={120} opacity={0.6} />
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 7: Token ─────────────────────────────────────────────────────

function TokenSection() {
  return (
    <section className="py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-widest uppercase text-blanc/30 mb-8">
            YNKLV Token
          </p>
          <h2 className="font-display text-4xl text-blanc tracking-display leading-tight mb-6">
            Not a speculative asset.
            <br />
            A participation credential.
          </h2>
          <p className="text-blanc/60 font-body text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Hold YNKLV to access AI tools, create on Studio, participate in governance,
            and earn your place in a growing global ecosystem.
          </p>
          <p className="text-sm text-blanc/30 font-body font-light">
            1,000,000,000 tokens. Fixed forever.
            No inflation. No admin keys. No surprises.
          </p>
          <div className="mt-8">
            <Link
              href="/tokenomics/02-token-design"
              className="text-or text-sm hover:text-or-light transition-colors duration-200"
            >
              Read the full tokenomics →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 8: Roadmap ───────────────────────────────────────────────────

function RoadmapSection() {
  const phases = [
    { date: '2026 Q2', title: 'Origin Drop',  items: ['Studio beta', 'Pass launch', 'First creators'] },
    { date: '2026 Q3', title: 'Build',        items: ['YNKLV AI', 'Mobile app', '12 cities'] },
    { date: '2026 Q4', title: 'Scale',        items: ['Mobile money', 'Academy', 'Council'] },
    { date: '2027',    title: 'Civilization', items: ['Full DAO', '100K+ members', 'Lagos Summit'] },
  ]

  return (
    <section className="py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-blanc/30 mb-16">Roadmap</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="text-xs text-or tracking-widest mb-4">{phase.date}</p>
              <p className="font-body font-medium text-blanc mb-4">{phase.title}</p>
              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="text-sm text-blanc/40 flex items-start gap-2">
                    <span className="text-or mt-0.5">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 9: Transparency ──────────────────────────────────────────────

function TransparencySection() {
  return (
    <section className="py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-widest uppercase text-blanc/30 mb-8">
            Built in Public
          </p>
          <div className="grid grid-cols-2 gap-6 mb-10">
            {['Treasury', 'Smart contracts', 'Decisions', 'Failures'].map((item, i) => (
              <div key={item} className="flex items-baseline gap-3">
                <span className="text-or text-lg">—</span>
                <div>
                  <p className="font-body font-medium text-blanc">{item}</p>
                  <p className="text-sm text-blanc/40">Always visible.</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-blanc/50 font-body text-sm leading-relaxed mb-8">
            We build in public because trust is not a feature. Trust is the foundation.
          </p>
          <div className="flex gap-6">
            <a href="/transparency" className="text-sm text-or hover:text-or-light transition-colors">
              View Treasury →
            </a>
            <a href="/audits" className="text-sm text-blanc/40 hover:text-blanc transition-colors">
              Read Audits →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 10: Final CTA ────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-40 px-6 border-t border-white/[0.06]">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-5xl md:text-6xl text-blanc tracking-display leading-tight mb-8">
            The civilization
            <br />
            is being built.
          </h2>
          <p className="text-blanc/50 font-body mb-12 text-lg">
            You can watch.
            <br />
            Or you can build it with us.
          </p>
          <Link
            href="/app"
            className="
              inline-flex h-16 px-12 text-lg
              bg-or text-void font-body font-medium tracking-wide
              rounded-2xl items-center
              hover:bg-or-light transition-all duration-300
              hover:shadow-or-lg
              active:scale-[0.98]
            "
          >
            Join the Ecosystem
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Shared: Hex Glyph SVG ────────────────────────────────────────────────

function HexGlyph({ size = 80, opacity = 1 }: { size?: number; opacity?: number }) {
  const h    = size * 0.866
  const pts  = `${size/2},0 ${size},${h/4} ${size},${h*3/4} ${size/2},${h} 0,${h*3/4} 0,${h/4}`

  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} style={{ opacity }}>
      <polygon points={pts} fill="none"    stroke="#C9A84C" strokeWidth="1"  opacity="0.3" />
      <polygon points={pts} fill="#C9A84C" opacity="0.08" />
      <polygon points={pts} fill="none"    stroke="#C9A84C" strokeWidth="1.5" />
    </svg>
  )
}
