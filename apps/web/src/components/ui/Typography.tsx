import { motion } from 'framer-motion'
import { wordRise, letterReveal, maskReveal, rise, stagger, viewport } from '@/lib/motion'
import type { ReactNode } from 'react'

interface Props { children: ReactNode; className?: string }

// ─── Display heading — each word rises from beneath its container ─────────────

export function DisplayTitle({ children, className = '' }: Props) {
  const words = String(children).split(' ')

  return (
    <motion.h1
      className={['font-display leading-[1.02] tracking-tight', className].join(' ')}
      variants={stagger(0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
          <motion.span className="inline-block" variants={wordRise}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  )
}

// ─── Editorial heading — mask wipe reveal ────────────────────────────────────

export function EditorialHeading({ children, className = '' }: Props) {
  return (
    <motion.h2
      className={['font-editorial leading-[1.1] tracking-tight', className].join(' ')}
      variants={maskReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </motion.h2>
  )
}

// ─── Section label — spaced uppercase category tag ───────────────────────────

export function SectionLabel({ children, className = '' }: Props) {
  return (
    <motion.p
      className={[
        't-label text-[var(--or)] tracking-[0.25em] uppercase',
        className,
      ].join(' ')}
      variants={rise}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </motion.p>
  )
}

// ─── Body prose — fade + slight rise ─────────────────────────────────────────

export function Prose({ children, className = '' }: Props) {
  return (
    <motion.p
      className={['t-prose text-[var(--blanc-60)] leading-relaxed', className].join(' ')}
      variants={rise}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </motion.p>
  )
}

// ─── YNKLV wordmark — letter-by-letter reveal ────────────────────────────────

export function YNKLVWordmark({ className = '' }: { className?: string }) {
  const letters = 'YNKLV'.split('')

  return (
    <motion.span
      className={['font-display tracking-[0.3em]', className].join(' ')}
      variants={stagger(0.06)}
      initial="hidden"
      animate="visible"
    >
      {letters.map((l, i) => (
        <motion.span key={i} className="inline-block" variants={letterReveal} custom={i}>
          {l}
        </motion.span>
      ))}
    </motion.span>
  )
}

// ─── Stat number — oversized numeral ─────────────────────────────────────────

export function StatNumber({ value, label, className = '' }: {
  value: string; label: string; className?: string
}) {
  return (
    <motion.div
      className={['flex flex-col gap-2', className].join(' ')}
      variants={rise}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <span className="t-numeral text-[var(--blanc)] text-fluid-3xl">{value}</span>
      <span className="t-label text-[var(--blanc-40)] tracking-[0.15em] uppercase">{label}</span>
    </motion.div>
  )
}
