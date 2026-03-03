import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { usePerspectiveTilt } from '@/hooks/usePerspectiveTilt'
import { cn } from '@/lib/utils'

interface Perspective3DContainerProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  perspective?: string
  stiffness?: number
  damping?: number
  disabled?: boolean
}

export function Perspective3DContainer({
  children,
  className,
  maxTilt = 12,
  perspective = '1000px',
  stiffness = 100,
  damping = 20,
  disabled = false,
}: Perspective3DContainerProps) {
  const { containerRef, springRotateX, springRotateY, handlers } =
    usePerspectiveTilt({ maxTilt, stiffness, damping, disabled })

  return (
    <div style={{ perspective }}>
      <motion.div
        ref={containerRef}
        className={cn('[transform-style:preserve-3d]', className)}
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
