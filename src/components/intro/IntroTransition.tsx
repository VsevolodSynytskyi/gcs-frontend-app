import { type ReactNode, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { AppPhase } from '@/hooks/useAppPhase'
import { useTelemetry } from '@/context/TelemetryContext'
import { IntroCard } from './IntroCard'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'

const EXPAND_TRANSITION = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] as const,
}
const CLIP_EXPANDED = 'inset(0px round 8px)'
const CLIP_DEFAULT = 'inset(30% 30% 30% 30% round 12px)'

interface IntroTransitionProps {
  phase: AppPhase
  onBegin: () => void
  onTransitionComplete: () => void
  map: ReactNode
  children?: ReactNode
}

export function IntroTransition({
  phase,
  onBegin,
  onTransitionComplete,
  map,
  children,
}: IntroTransitionProps) {
  const { telemetry } = useTelemetry()
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardClip, setCardClip] = useState(CLIP_DEFAULT)
  const [showOverlay, setShowOverlay] = useState(true)

  const isCard = phase === 'idle' || phase === 'ready'
  const isExpanded = phase === 'transitioning' || phase === 'active'
  const showRipple = phase !== 'active'

  useEffect(() => {
    if (isCard) setShowOverlay(true)
  }, [isCard])

  useEffect(() => {
    if (isCard && containerRef.current && cardRef.current) {
      const c = containerRef.current.getBoundingClientRect()
      const card = cardRef.current.getBoundingClientRect()
      const top = card.top - c.top
      const right = c.right - card.right
      const bottom = c.bottom - card.bottom
      const left = card.left - c.left
      setCardClip(`inset(${top}px ${right}px ${bottom}px ${left}px round 12px)`)
    }
  })

  return (
    <div ref={containerRef} className="relative size-full">
      {telemetry && (
        <motion.div
          className={`absolute inset-0 z-4 overflow-hidden rounded-lg border border-white/10 ${isCard ? 'invisible' : 'visible'}`}
          initial={false}
          animate={{
            clipPath: isExpanded ? CLIP_EXPANDED : cardClip,
          }}
          transition={EXPAND_TRANSITION}
          onAnimationComplete={() => {
            if (phase === 'transitioning') onTransitionComplete()
          }}
        >
          {map}
          <AnimatePresence>
            {showOverlay && (
              <motion.div
                className="absolute inset-0 z-[1001] rounded-lg bg-(--color-background)"
                initial={{ opacity: 1 }}
                animate={{ opacity: isExpanded ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={EXPAND_TRANSITION}
                onAnimationComplete={() => {
                  if (isExpanded) setShowOverlay(false)
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {showRipple && (
        <div className="absolute inset-0 overflow-hidden">
          <BackgroundRippleEffect rows={20} />
        </div>
      )}

      {isCard && (
        <div className="pointer-events-none absolute inset-0 z-5 flex items-center justify-center">
          <div ref={cardRef} className="pointer-events-auto w-72">
            <IntroCard phase={phase} onBegin={onBegin} />
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
