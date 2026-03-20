import {
  type FC,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { AppPhase } from '@/hooks/useAppPhase'
import { useTelemetrySelector } from '@/hooks/useTelemetrySelector'
import { IntroCard } from './IntroCard'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { Perspective3DContainer } from '@/components/ui/Perspective3DContainer'

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
  content: ReactNode
  children?: ReactNode
}

export const IntroTransition: FC<IntroTransitionProps> = ({
  phase,
  onBegin,
  onTransitionComplete,
  content,
  children,
}) => {
  const contentMounted = useTelemetrySelector((s) => s.telemetry !== null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardClip, setCardClip] = useState(CLIP_DEFAULT)

  const isCard = phase === 'idle' || phase === 'ready'
  const isExpanded = phase === 'transitioning' || phase === 'active'
  const showRipple = phase !== 'active'

  useLayoutEffect(() => {
    if (!isCard || !containerRef.current || !cardRef.current) return

    const container = containerRef.current
    const card = cardRef.current

    const updateCardClip = () => {
      const c = container.getBoundingClientRect()
      const r = card.getBoundingClientRect()
      setCardClip(
        `inset(${r.top - c.top}px ${c.right - r.right}px ${c.bottom - r.bottom}px ${r.left - c.left}px round 12px)`,
      )
    }

    updateCardClip()

    const observer = new ResizeObserver(updateCardClip)
    observer.observe(container)

    return () => observer.disconnect()
  }, [isCard])

  return (
    <div ref={containerRef} className="relative size-full">
      {contentMounted && (
        <motion.div
          className={`absolute inset-0 z-4 overflow-hidden rounded-lg bg-(--color-background) ${isCard ? 'invisible' : 'visible'}`}
          initial={false}
          animate={{
            clipPath: isExpanded ? CLIP_EXPANDED : cardClip,
          }}
          transition={EXPAND_TRANSITION}
          onAnimationComplete={() => {
            if (phase === 'transitioning') onTransitionComplete()
          }}
        >
          {content}
          <AnimatePresence>
            {isCard && (
              <motion.div
                className="absolute inset-0 z-1001 rounded-lg bg-(--color-background)"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={EXPAND_TRANSITION}
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
            <Perspective3DContainer>
              <IntroCard phase={phase} onBegin={onBegin} />
            </Perspective3DContainer>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
