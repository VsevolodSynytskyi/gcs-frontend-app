import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { usePerspectiveTilt } from '@/hooks/usePerspectiveTilt'
import { cn } from '@/lib/utils'

const MAX_TILT = 10
const PERSPECTIVE = '800px'
const STIFFNESS = 80
const DAMPING = 18

interface Perspective3DContainerProps {
  children: ReactNode
  className?: string
  disabled?: boolean
}

export function Perspective3DContainer({
  children,
  className,
  disabled = false,
}: Perspective3DContainerProps) {
  const { containerRef, springRotateX, springRotateY, handlers } =
    usePerspectiveTilt({
      maxTilt: MAX_TILT,
      stiffness: STIFFNESS,
      damping: DAMPING,
      disabled,
    })

  return (
    <div style={{ perspective: PERSPECTIVE }}>
      <motion.div
        ref={containerRef}
        className={cn(className)}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
        }}
        onMouseEnter={handlers.onMouseEnter}
        onMouseLeave={handlers.onMouseLeave}
      >
        {children}
      </motion.div>
    </div>
  )
}
