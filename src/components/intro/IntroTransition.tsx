import { useRef, useEffect, type ReactNode } from 'react'
import { motion } from 'motion/react'
import type { AppPhase } from '../../hooks/useAppPhase'
import type { Telemetry } from '../../hooks/useTelemetry'
import { IntroCard } from './IntroCard'

interface IntroTransitionProps {
  phase: AppPhase
  telemetry: Telemetry | null
  onBegin: () => void
  onTransitionComplete: () => void
  map: ReactNode
  children?: ReactNode
}

export function IntroTransition({
  phase,
  telemetry,
  onBegin,
  onTransitionComplete,
  map,
  children,
}: IntroTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const cardClipRef = useRef('inset(30% 30% 30% 30% round 12px)')

  const isCard = phase === 'idle' || phase === 'ready'
  const isExpanded = phase === 'transitioning' || phase === 'active'

  useEffect(() => {
    if (isCard && containerRef.current && cardRef.current) {
      const c = containerRef.current.getBoundingClientRect()
      const card = cardRef.current.getBoundingClientRect()
      const top = card.top - c.top
      const right = c.right - card.right
      const bottom = c.bottom - card.bottom
      const left = card.left - c.left
      cardClipRef.current = `inset(${top}px ${right}px ${bottom}px ${left}px round 12px)`
    }
  })

  return (
    <div ref={containerRef} className="size-full relative">
      {telemetry && (
        <motion.div
          className={`absolute inset-0 border border-white/10 rounded-lg overflow-hidden ${isCard ? 'invisible' : 'visible'}`}
          initial={false}
          animate={
            isExpanded
              ? { clipPath: 'inset(0px round 8px)' }
              : { clipPath: cardClipRef.current }
          }
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={() => {
            if (phase === 'transitioning') onTransitionComplete()
          }}
        >
          {map}
        </motion.div>
      )}

      {isCard && (
        <div className="absolute inset-0 flex items-center justify-center z-[1]">
          <div
            ref={cardRef}
            className="w-72 backdrop-blur-sm bg-(--gray-a2) border border-white/10 shadow-lg rounded-xl"
          >
            <IntroCard phase={phase} onBegin={onBegin} />
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
