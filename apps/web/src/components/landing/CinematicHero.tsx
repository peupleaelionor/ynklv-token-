'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { stagger, wordRise, rise, ease, t, viewport } from '@/lib/motion'
import { HexLarge } from '@/components/ui/HexGlyph'
import { YNKLVWordmark } from '@/components/ui/Typography'

const headline = ['Not a coin.', 'A civilization.']

export function CinematicHero() {
  const ref   = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const opacity     = useTransform(scrollYProgress, [0, 0.5],  [1, 0])
  const y           = useTransform(scrollYProgress, [0, 0.6],  [0, 80])
  const hexScale    = useTransform(scrollYProgress, [0, 0.7],  [1, 1.4])
  const hexOpacity  = useTransform(scrollYProgress, [0, 0.6],  [0.35, 0])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background glyph (parallax) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ scale: hexScale, opacity: hexOpacity }}
      >
        <HexLarge className="opacity-100" />
      </motion.div>

      {/* ── Radial hero gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(200,164,90,0.07) 0%, transparent 70%)',
        }}
      />

      {/* ── Noise grain */}
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* ── Vignette */}
      <div className="vignette absolute inset-0 pointer-events-none" />

      {/* ── Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        style={{ opacity, y }}
      >
        {/* Pre-label */}
        <motion.div
          className="mb-10 flex items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: ease.silk }}
        >
          <span className="h-px w-8 bg-[var(--or)] opacity-60" />
          <span className="t-label text-[var(--or)] tracking-[0.3em] text-[10px]">
            AFRO-GLOBAL DIGITAL ECOSYSTEM
          </span>
          <span className="h-px w-8 bg-[var(--or)] opacity-60" />
        </motion.div>

        {/* Wordmark */}
        <div className="mb-6">
          <YNKLVWordmark className="text-fluid-4xl text-[var(--blanc)] gradient-or bg-clip-text text-transparent" />
        </div>

        {/* Headline */}
        <motion.div
          className="mb-8 overflow-hidden"
          variants={stagger(0.12, 0.4)}
          initial="hidden"
          animate="visible"
        >
          {headline.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1
                className={[
                  'font-display leading-[1.05] tracking-tight',
                  'text-fluid-3xl md:text-fluid-4xl',
                  i === 0 ? 'text-[var(--blanc)]' : 'gradient-or bg-clip-text text-transparent',
                ].join(' ')}
                variants={wordRise}
              >
                {line}
              </motion.h1>
            </div>
          ))}
        </motion.div>

        {/* Subheading */}
        <motion.p
          className="t-prose text-[var(--blanc-60)] max-w-md mx-auto text-fluid-sm mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: ease.silk }}
        >
          The financial and cultural infrastructure that Afro-global talent
          has been building toward — finally made ownable.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: ease.silk }}
        >
          <motion.a
            href="#join"
            className="px-8 py-4 bg-[var(--or)] text-[var(--void)] text-xs font-semibold
                       tracking-[0.18em] uppercase hover:brightness-110 transition-all
                       duration-300 rounded-sm min-w-[180px] text-center"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={t.fast}
          >
            Enter the Ecosystem
          </motion.a>
          <motion.a
            href="#manifesto"
            className="px-8 py-4 border border-[rgba(200,164,90,0.3)] text-[var(--blanc-60)]
                       text-xs font-medium tracking-[0.15em] uppercase hover:border-[var(--or)]
                       hover:text-[var(--or)] transition-all duration-300 rounded-sm
                       min-w-[180px] text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={t.fast}
          >
            Read the Manifesto
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <span className="t-label text-[var(--blanc-30)] text-[9px] tracking-[0.3em]">SCROLL</span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-[var(--or)] to-transparent"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

      {/* ── Live stat strip */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 border-t border-[rgba(200,164,90,0.08)]
                   py-4 px-6 flex items-center justify-center gap-8 md:gap-16 overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        {[
          { label: 'Holders',     value: '82,400'  },
          { label: 'Creators',    value: '3,200'   },
          { label: 'Active Cities', value: '18'    },
          { label: 'Total Supply', value: '1B'     },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3 shrink-0">
            <span className="t-numeral text-[var(--blanc)] text-sm font-semibold">{value}</span>
            <span className="t-label text-[var(--blanc-30)] text-[9px] tracking-[0.2em] uppercase">{label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
