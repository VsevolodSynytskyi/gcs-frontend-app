import { useRef, useEffect, useCallback, useState } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'motion/react'

interface UsePerspectiveTiltOptions {
  maxTilt?: number
  stiffness?: number
  damping?: number
  disabled?: boolean
}

interface UsePerspectiveTiltReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  springRotateX: MotionValue<number>
  springRotateY: MotionValue<number>
  isHovered: boolean
  handlers: {
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
}

export const usePerspectiveTilt: (
  options?: UsePerspectiveTiltOptions,
) => UsePerspectiveTiltReturn = ({
  maxTilt = 12,
  stiffness = 100,
  damping = 20,
  disabled = false,
} = {}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isHoveredRef = useRef(false)
  const [isHovered, setIsHovered] = useState(false)

  const initialTilt = disabled ? 0 : maxTilt * 0.5
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springRotateX = useSpring(rotateX, { stiffness, damping })
  const springRotateY = useSpring(rotateY, { stiffness, damping })

  // Set an initial lean so the panel is already tilted on first render
  const initializedRef = useRef(false)
  useEffect(() => {
    if (!initializedRef.current && !disabled) {
      initializedRef.current = true
      rotateY.set(initialTilt)
    }
  }, [disabled, initialTilt, rotateY])

  useEffect(() => {
    if (disabled) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isHoveredRef.current || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dx = e.clientX - centerX
      const dy = e.clientY - centerY

      const nx = dx / (window.innerWidth / 2)
      const ny = dy / (window.innerHeight / 2)

      const clamp = (v: number, min: number, max: number) =>
        Math.min(max, Math.max(min, v))

      rotateX.set(clamp(-ny * maxTilt * 0.125, -maxTilt, maxTilt))
      rotateY.set(clamp(nx * maxTilt, -maxTilt, maxTilt))
    }

    window.addEventListener('mousemove', handleMouseMove, true)
    return () => window.removeEventListener('mousemove', handleMouseMove, true)
  }, [disabled, maxTilt, rotateX, rotateY])

  const onMouseEnter = useCallback(() => {
    isHoveredRef.current = true
    setIsHovered(true)
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  const onMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    setIsHovered(false)
  }, [])

  return {
    containerRef,
    springRotateX,
    springRotateY,
    isHovered,
    handlers: { onMouseEnter, onMouseLeave },
  }
}
