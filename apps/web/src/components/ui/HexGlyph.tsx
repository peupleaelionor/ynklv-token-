'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

interface HexGlyphProps {
  size?:        number
  fill?:        number      // 0–1 how much of the hex is filled
  stroke?:      string
  animated?:    boolean
  className?:   string
  variant?:     'outline' | 'filled' | 'glow' | 'rotating'
}

/**
 * The YNKLV hexagonal glyph — the ecosystem's primary symbol.
 *
 * References African geometric tradition (Kente, Ndebele) expressed
 * through mathematical precision. The fill level maps to Pass tier.
 */
export function HexGlyph({
  size     = 80,
  fill     = 0,
  stroke   = '#C8A45A',
  animated = false,
  className,
  variant  = 'outline',
}: HexGlyphProps) {
  const prefersReduced = useReducedMotion()

  const h = size * 0.866025 // height of regular hexagon

  // Six vertices of a regular hexagon (flat-top orientation)
  const points = useMemo(() => {
    const cx = size / 2
    const cy = h / 2
    const r  = size / 2

    return Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
    }).join(' ')
  }, [size, h])

  // Inner hexagon (75% scale) for layered depth
  const innerPoints = useMemo(() => {
    const cx = size / 2
    const cy = h / 2
    const r  = (size / 2) * 0.72

    return Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
    }).join(' ')
  }, [size, h])

  const fillHeight  = h * fill
  const fillY       = h - fillHeight

  const shouldAnimate = animated && !prefersReduced

  return (
    <div className={className} style={{ width: size, height: h }}>
      <svg
        width={size}
        height={h}
        viewBox={`0 0 ${size} ${h}`}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {/* Clip to hexagon shape for fill */}
          <clipPath id={`hex-clip-${size}-${fill}`}>
            <polygon points={points} />
          </clipPath>

          {/* Gold gradient */}
          <linearGradient id={`or-gradient-${size}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="#9E7E33" />
            <stop offset="50%"  stopColor="#C8A45A" />
            <stop offset="100%" stopColor="#E0C27A" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={`hex-glow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ─ Outer hexagon (structure) */}
        <motion.polygon
          points={points}
          stroke={stroke}
          strokeWidth="1"
          strokeOpacity={variant === 'filled' ? 0.5 : 0.35}
          animate={shouldAnimate ? {
            strokeOpacity: [0.25, 0.5, 0.25],
            transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          } : undefined}
        />

        {/* ─ Fill level (tier progress) */}
        {fill > 0 && (
          <motion.rect
            x={0}
            y={fillY}
            width={size}
            height={fillHeight}
            fill={`url(#or-gradient-${size})`}
            opacity={0.15}
            clipPath={`url(#hex-clip-${size}-${fill})`}
            initial={{ height: 0, y: h }}
            animate={{ height: fillHeight, y: fillY }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        )}

        {/* ─ Inner hexagon (depth) */}
        <polygon
          points={innerPoints}
          stroke={stroke}
          strokeWidth="0.75"
          strokeOpacity={0.15}
        />

        {/* ─ Bright stroke (front layer) */}
        <motion.polygon
          points={points}
          stroke={fill >= 1 ? `url(#or-gradient-${size})` : stroke}
          strokeWidth={fill >= 0.8 ? 1.5 : 1}
          strokeOpacity={Math.max(0.3, fill)}
          filter={variant === 'glow' ? `url(#hex-glow-${size})` : undefined}
          animate={shouldAnimate && variant === 'rotating' ? {
            rotate: 360,
            transition: { duration: 20, repeat: Infinity, ease: 'linear' },
          } : undefined}
          style={{ transformOrigin: `${size/2}px ${h/2}px` }}
        />

        {/* ─ Center dot (Legend tier only) */}
        {fill >= 1 && (
          <motion.circle
            cx={size / 2}
            cy={h / 2}
            r={2}
            fill={stroke}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          />
        )}
      </svg>
    </div>
  )
}

// ─── Composed variants ────────────────────────────────────────────────────────

export function HexLoader({ size = 40 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size * 0.866 }}>
      <HexGlyph size={size} variant="rotating" animated stroke="#C8A45A" />
    </div>
  )
}

export function HexLarge({ className }: { className?: string }) {
  return (
    <HexGlyph
      size={320}
      stroke="#C8A45A"
      variant="glow"
      animated
      className={className}
    />
  )
}
