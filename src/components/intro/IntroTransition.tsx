import { type ReactNode, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { AppPhase } from '@/hooks/useAppPhase'
import { useTelemetry } from '@/context/TelemetryContext'
import { IntroCard } from './IntroCard'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'

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
  const [cardClip, setCardClip] = useState('inset(30% 30% 30% 30% round 12px)')

  const isCard = phase === 'idle' || phase === 'ready'
  const isExpanded = phase === 'transitioning' || phase === 'active'
  const showRipple = phase !== 'active'

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
          animate={
            isExpanded
              ? { clipPath: 'inset(0px round 8px)' }
              : { clipPath: cardClip }
          }
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={() => {
            if (phase === 'transitioning') onTransitionComplete()
          }}
        >
          {map}
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
