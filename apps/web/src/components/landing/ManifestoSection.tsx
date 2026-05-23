'use client'

import { motion } from 'framer-motion'
import { stagger, rise, riseSubtle, maskReveal, ease, viewport } from '@/lib/motion'
import { SectionLabel } from '@/components/ui/Typography'

const passages = [
  {
    id: 'p1',
    text: 'Africa is not a market to be entered. It is a civilization to be reckoned with. Forty percent of the world\'s youth. Sixty-plus percent of the world\'s uncultivated arable land. The birthplace of mathematics, architecture, and written language.',
  },
  {
    id: 'p2',
    text: 'And yet — the digital economy was built without us. The protocols were designed elsewhere. The value capture flows elsewhere. The narrative was written by people who had never heard an afrobeats melody, never felt the weight of a Kente cloth, never built anything out of necessity.',
  },
  {
    id: 'p3',
    text: 'We are not here to ask for a seat at the table. We are here to build a different table entirely — one whose architecture reflects the complexity and beauty of Afro-global civilization.',
  },
  {
    id: 'p4',
    text: 'YNKLV is not a crypto project. It is not a startup. It is the beginning of a decades-long digital institution — designed for permanence, engineered for trust, built from culture outward.',
  },
]

const principles = [
  'Utility before speculation.',
  'Elegance before hype.',
  'Africa as origin, not market.',
  'Culture as infrastructure.',
  'Patience as a feature.',
  'Transparency as architecture.',
]

export function ManifestoSection() {
  return (
    <section
      id="manifesto"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Subtle left-side Or accent */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-2/3 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(200,164,90,0.2), transparent)' }}
      />

      <div className="container-ynklv">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">

          {/* ── Left col: label + principles */}
          <div className="md:col-span-4 md:sticky md:top-32 md:self-start">
            <SectionLabel className="mb-10">The Manifesto</SectionLabel>

            <motion.ul
              className="flex flex-col gap-4"
              variants={stagger(0.07, 0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {principles.map((p, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 text-[var(--blanc-50)] t-prose text-sm"
                  variants={riseSubtle}
                >
                  <span
                    className="mt-[7px] w-1 h-1 rounded-full bg-[var(--or)] shrink-0 opacity-70"
                  />
                  {p}
                </motion.li>
              ))}
            </motion.ul>

            {/* Hex accent */}
            <motion.div
              className="mt-16 opacity-20"
              initial={{ opacity: 0, rotate: -10 }}
              whileInView={{ opacity: 0.15, rotate: 0 }}
              viewport={viewport}
              transition={{ duration: 1.4, ease: ease.silk }}
            >
              <svg width="60" height="52" viewBox="0 0 60 52" fill="none">
                <polygon
                  points="30,2 56,16 56,44 30,58 4,44 4,16"
                  stroke="#C8A45A"
                  strokeWidth="1"
                />
                <polygon
                  points="30,10 48,20 48,40 30,50 12,40 12,20"
                  stroke="#C8A45A"
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                />
              </svg>
            </motion.div>
          </div>

          {/* ── Right col: prose */}
          <div className="md:col-span-7 md:col-start-6">
            <motion.div
              className="flex flex-col gap-10"
              variants={stagger(0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px 0px' }}
            >
              {passages.map(({ id, text }) => (
                <motion.p
                  key={id}
                  className="t-editorial text-fluid-base text-[var(--blanc-70)] leading-[1.75]"
                  variants={rise}
                >
                  {text}
                </motion.p>
              ))}

              {/* Pull quote */}
              <motion.blockquote
                className="border-l-2 border-[var(--or)] pl-8 mt-4"
                variants={rise}
              >
                <p className="font-display text-fluid-xl text-[var(--blanc)] leading-[1.2]">
                  "Not a coin. A civilization."
                </p>
                <footer className="mt-4 t-label text-[var(--or)] tracking-[0.2em]">
                  — THE YNKLV MANIFESTO
                </footer>
              </motion.blockquote>

              {/* Kinshasa note — cultural anchor */}
              <motion.div
                className="flex items-center gap-4 mt-4 opacity-50"
                variants={riseSubtle}
              >
                <div className="h-px flex-1 bg-[var(--blanc-10)]" />
                <span className="t-label text-[var(--blanc-40)] text-[9px] tracking-[0.25em]">
                  TOBONGISA MBOKA — BUILD THE CIVILIZATION
                </span>
                <div className="h-px flex-1 bg-[var(--blanc-10)]" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
