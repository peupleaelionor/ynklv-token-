'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { stagger, rise, riseSubtle, scaleIn, passAchieve, goldPulse, ease, t } from '@/lib/motion'
import { HexGlyph } from '@/components/ui/HexGlyph'

type Step = 'welcome' | 'connect' | 'qualify' | 'mint' | 'complete'

const steps: { id: Step; label: string }[] = [
  { id: 'welcome',  label: 'Welcome'  },
  { id: 'connect',  label: 'Connect'  },
  { id: 'qualify',  label: 'Qualify'  },
  { id: 'mint',     label: 'Mint'     },
  { id: 'complete', label: 'Complete' },
]

const stepContent: Record<Step, { title: string; body: string }> = {
  welcome: {
    title: 'You are about to join a civilization.',
    body:  'YNKLV is not a platform you sign up for. It is an ecosystem you enter — with intent, with contribution, with permanence. Take a moment. This is your genesis.',
  },
  connect: {
    title: 'Connect your wallet.',
    body:  'Your wallet is your identity here. No email. No username. No password to forget. Cryptographic proof is your credential.',
  },
  qualify: {
    title: 'Hold 100 YNKLV.',
    body:  'The Pass is free to mint — but it requires skin in the game. 100 YNKLV. That is the only gate. No whitelist. No invitation list. No VIP access.',
  },
  mint: {
    title: 'Your Pass is being created.',
    body:  'On-chain SVG, generated from your genesis timestamp. Every Pass is unique. Yours will never look exactly like another.',
  },
  complete: {
    title: 'Welcome to the civilization.',
    body:  'Your genesis is recorded. Your EPS clock has started. Build something.',
  },
}

interface Props {
  onComplete?: () => void
}

export function OnboardingFlow({ onComplete }: Props) {
  const [current, setCurrent] = useState<Step>('welcome')
  const currentIdx = steps.findIndex(s => s.id === current)

  const advance = () => {
    const next = steps[currentIdx + 1]
    if (next) setCurrent(next.id)
    else onComplete?.()
  }

  const fillProgress = currentIdx / (steps.length - 1)

  return (
    <div className="min-h-screen bg-[var(--void)] flex flex-col items-center justify-center px-6 py-20">

      {/* Progress strip */}
      <div className="w-full max-w-md mb-16">
        <div className="flex items-center gap-1">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-1 flex-1 last:flex-none">
              <div
                className={[
                  'h-px flex-1 transition-all duration-700',
                  i < currentIdx
                    ? 'bg-[var(--or)]'
                    : 'bg-[rgba(200,164,90,0.12)]',
                ].join(' ')}
              />
              <div
                className={[
                  'w-1.5 h-1.5 rounded-full transition-all duration-500 shrink-0',
                  i === currentIdx
                    ? 'bg-[var(--or)] shadow-[0_0_8px_rgba(200,164,90,0.6)]'
                    : i < currentIdx
                    ? 'bg-[var(--or)] opacity-60'
                    : 'bg-[rgba(200,164,90,0.15)]',
                ].join(' ')}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, i) => (
            <span
              key={step.id}
              className={[
                't-label text-[9px] tracking-[0.15em] uppercase transition-colors duration-300',
                i === currentIdx ? 'text-[var(--or)]' : 'text-[var(--blanc-25)]',
              ].join(' ')}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: ease.silk }}
        >
          {/* Hex glyph — grows with progress */}
          <div className="flex justify-center mb-10">
            {current === 'complete' ? (
              <motion.div {...goldPulse}>
                <motion.div variants={passAchieve} initial="initial" animate="animate">
                  <HexGlyph
                    size={88}
                    fill={1}
                    stroke="#C8A45A"
                    variant="glow"
                    animated
                  />
                </motion.div>
              </motion.div>
            ) : (
              <HexGlyph
                size={72}
                fill={fillProgress}
                stroke="#C8A45A"
                variant={current === 'mint' ? 'rotating' : 'outline'}
                animated={current === 'mint'}
              />
            )}
          </div>

          {/* Text */}
          <h2 className="font-display text-[var(--blanc)] text-2xl md:text-3xl leading-[1.1] tracking-tight text-center mb-5">
            {stepContent[current].title}
          </h2>
          <p className="t-prose text-[var(--blanc-55)] text-center leading-relaxed max-w-sm mx-auto mb-12">
            {stepContent[current].body}
          </p>

          {/* Action */}
          {current === 'connect' ? (
            <button
              onClick={advance}
              className="w-full py-4 bg-transparent border border-[rgba(200,164,90,0.3)]
                         text-[var(--blanc-60)] text-xs font-medium tracking-[0.15em] uppercase
                         hover:border-[var(--or)] hover:text-[var(--or)]
                         transition-all duration-300 rounded-sm"
            >
              Connect Wallet
            </button>
          ) : current === 'complete' ? (
            <motion.button
              onClick={onComplete}
              className="w-full py-4 bg-[var(--or)] text-[var(--void)] text-xs font-bold
                         tracking-[0.2em] uppercase hover:brightness-110
                         transition-all duration-300 rounded-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={t.fast}
            >
              Enter Your Dashboard
            </motion.button>
          ) : (
            <motion.button
              onClick={advance}
              className="w-full py-4 bg-[var(--or)] text-[var(--void)] text-xs font-bold
                         tracking-[0.2em] uppercase hover:brightness-110
                         transition-all duration-300 rounded-sm"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={t.fast}
            >
              {current === 'welcome'  ? 'Begin'
               : current === 'qualify' ? 'I Hold 100 YNKLV'
               : current === 'mint'    ? 'Mint My Pass'
               : 'Continue'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cultural anchor */}
      <motion.p
        className="mt-16 t-label text-[var(--blanc-20)] text-[9px] tracking-[0.3em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        TOBONGISA MBOKA — BUILD THE CIVILIZATION
      </motion.p>
    </div>
  )
}
