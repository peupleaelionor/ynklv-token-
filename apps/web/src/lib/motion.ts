/**
 * YNKLV Motion System
 * All animation variants, transitions, and timing in one place.
 * Every motion decision is intentional — premium, never restless.
 */

import type { Transition, Variants } from 'framer-motion'

// ─── Core Easings ─────────────────────────────────────────────────────────────

export const ease = {
  silk:     [0.16, 1, 0.3, 1]     as [number, number, number, number],
  dramatic: [0.12, 0, 0.39, 0]    as [number, number, number, number],
  spring:   [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  reveal:   [0.22, 1, 0.36, 1]    as [number, number, number, number],
  heavy:    [0.76, 0, 0.24, 1]    as [number, number, number, number],
}

// ─── Base Transitions ─────────────────────────────────────────────────────────

export const t = {
  fast:     { duration: 0.2,  ease: ease.silk    } satisfies Transition,
  medium:   { duration: 0.5,  ease: ease.silk    } satisfies Transition,
  slow:     { duration: 0.8,  ease: ease.silk    } satisfies Transition,
  cinematic:{ duration: 1.4,  ease: ease.reveal  } satisfies Transition,
  epic:     { duration: 2.0,  ease: ease.reveal  } satisfies Transition,
}

// ─── Page Variants ────────────────────────────────────────────────────────────

export const pageEnter: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: ease.silk } },
  exit:    { opacity: 0, transition: { duration: 0.3, ease: ease.dramatic } },
}

// ─── Stagger Containers ───────────────────────────────────────────────────────

export const stagger = (delay = 0.08, childrenDelay = 0): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: delay, delayChildren: childrenDelay } },
})

// ─── Rise Variants (most common reveal) ──────────────────────────────────────

export const rise: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { ...t.slow } },
}

export const riseSubtle: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { ...t.medium } },
}

// ─── Cinematic Variants ───────────────────────────────────────────────────────

/** Hero title — each word rises from below its container (overflow hidden) */
export const wordRise: Variants = {
  hidden:  { y: '115%' },
  visible: {
    y: '0%',
    transition: { duration: 1.1, ease: ease.reveal },
  },
}

/** Letter-by-letter reveal for the YNKLV wordmark */
export const letterReveal: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.06, ease: ease.silk },
  }),
}

/** Mask wipe — horizontal reveal, left to right */
export const maskReveal: Variants = {
  hidden:  { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 1.0, ease: ease.reveal },
  },
}

/** Scale reveal — comes in from slightly smaller */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { ...t.slow } },
}

/** Slide from left */
export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { ...t.slow } },
}

/** Slide from right */
export const slideRight: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { ...t.slow } },
}

// ─── Pass Achievement Ceremony ────────────────────────────────────────────────

export const passAchieve: Variants = {
  initial: { scale: 0.7, opacity: 0, rotateY: -15 },
  animate: {
    scale: 1, opacity: 1, rotateY: 0,
    transition: { duration: 1.0, ease: ease.spring },
  },
}

export const goldPulse = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(200,164,90,0)',
      '0 0 40px rgba(200,164,90,0.35)',
      '0 0 0px rgba(200,164,90,0)',
    ],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
}

// ─── Hover Effects ────────────────────────────────────────────────────────────

export const hoverLift = {
  whileHover: { y: -3, transition: { ...t.fast } },
  whileTap:   { y: 0, scale: 0.98, transition: { duration: 0.1 } },
}

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 30px rgba(200,164,90,0.2)',
    borderColor: 'rgba(200,164,90,0.3)',
    transition: { ...t.fast },
  },
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export const navReveal: Variants = {
  hidden:  { y: -24, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { duration: 0.6, delay: 0.2, ease: ease.silk },
  },
}

export const mobileMenu: Variants = {
  closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: ease.dramatic } },
  open:   { opacity: 1, height: 'auto', transition: { duration: 0.5, ease: ease.silk } },
}

// ─── Number Counter (for ecosystem stats) ────────────────────────────────────

export const countTransition: Transition = {
  duration: 2.0,
  ease: ease.reveal,
}

// ─── Viewport Settings ────────────────────────────────────────────────────────

export const viewport = {
  once:   true,
  margin: '-80px 0px',
} as const
