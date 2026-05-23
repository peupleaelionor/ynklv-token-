'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { navReveal, mobileMenu, t, ease } from '@/lib/motion'
import { HexGlyph } from '@/components/ui/HexGlyph'

const links = [
  { label: 'Ecosystem',  href: '#ecosystem'  },
  { label: 'Studio',     href: '#studio'     },
  { label: 'Pass',       href: '#pass'       },
  { label: 'Governance', href: '#governance' },
  { label: 'Manifesto',  href: '#manifesto'  },
]

export function Navigation() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', v => {
      setScrolled(v > 40)
    })
  }, [scrollY])

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Section observer
  useEffect(() => {
    const sections = links.map(l => l.href.replace('#', ''))
    const observers = sections.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  return (
    <>
      <motion.nav
        variants={navReveal}
        initial="hidden"
        animate="visible"
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all',
          scrolled
            ? 'bg-[rgba(7,7,7,0.88)] backdrop-blur-xl border-b border-[rgba(200,164,90,0.08)]'
            : 'bg-transparent',
        ].join(' ')}
        style={{ WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none' }}
      >
        <div className="container-ynklv flex items-center justify-between h-16">

          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="YANKELV — Home"
          >
            <HexGlyph size={28} stroke="#C8A45A" variant="outline" />
            <span
              className="font-display text-[15px] tracking-[0.22em] text-[var(--or)] uppercase"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              YANKELV
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {links.map(({ label, href }) => {
              const id = href.replace('#', '')
              const isActive = activeSection === id
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      't-label transition-colors duration-200',
                      isActive
                        ? 'text-[var(--or)]'
                        : 'text-[var(--blanc-60)] hover:text-[var(--blanc)]',
                    ].join(' ')}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/app"
              className="t-label text-[var(--blanc-60)] hover:text-[var(--blanc)] transition-colors"
            >
              Sign In
            </Link>
            <motion.a
              href="#join"
              className="px-5 py-2 text-xs tracking-[0.15em] uppercase font-semibold
                         border border-[var(--or)] text-[var(--or)]
                         hover:bg-[var(--or)] hover:text-[var(--void)]
                         transition-colors duration-300 rounded-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={t.fast}
            >
              Get Access
            </motion.a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <motion.span
              className="block w-5 h-px bg-[var(--blanc)]"
              animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={t.fast}
            />
            <motion.span
              className="block w-5 h-px bg-[var(--blanc)]"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={t.fast}
            />
            <motion.span
              className="block w-5 h-px bg-[var(--blanc)]"
              animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              transition={t.fast}
            />
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              variants={mobileMenu}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden overflow-hidden border-t border-[rgba(200,164,90,0.08)]
                         bg-[rgba(7,7,7,0.95)] backdrop-blur-xl"
            >
              <ul className="flex flex-col py-4" role="list">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="block px-6 py-3 t-label text-[var(--blanc-60)]
                                 hover:text-[var(--or)] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li className="px-6 pt-4 pb-2">
                  <a
                    href="#join"
                    className="block text-center py-3 text-xs tracking-[0.15em] uppercase
                               font-semibold border border-[var(--or)] text-[var(--or)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Access
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
