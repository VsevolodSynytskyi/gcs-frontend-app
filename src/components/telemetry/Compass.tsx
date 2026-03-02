import { useRef, useLayoutEffect } from 'react'
import { useMotionValue, useSpring } from 'motion/react'

interface CompassProps {
  heading: number | null
  groundSpeed: number
}

const CARDINALS = [
  { label: 'N', angle: 0 },
  { label: 'E', angle: 90 },
  { label: 'S', angle: 180 },
  { label: 'W', angle: 270 },
]

const TICK_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30)

const INNER_R = 35
const OUTER_R = 43
const ARROW_R = 45
const ARROW_SPREAD = 2
const LABEL_R = 75

export function Compass({ heading, groundSpeed }: CompassProps) {
  const unwrapped = useRef(heading ?? 0)
  const motionHeading = useMotionValue(unwrapped.current)
  const springHeading = useSpring(motionHeading, { stiffness: 80, damping: 20 })
  const pointerRef = useRef<SVGGElement>(null)
  const labelRef = useRef<SVGGElement>(null)
  const hasHeading = heading !== null

  useLayoutEffect(() => {
    if (!hasHeading) return

    const current = ((unwrapped.current % 360) + 360) % 360
    let delta = heading - current
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    unwrapped.current += delta
    motionHeading.set(unwrapped.current)

    const update = (v: number) => {
      pointerRef.current?.setAttribute('transform', `rotate(${v} 100 100)`)
      const rad = (v - 90) * (Math.PI / 180)
      const lx = 100 + LABEL_R * Math.cos(rad)
      const ly = 100 + LABEL_R * Math.sin(rad)
      labelRef.current?.setAttribute('transform', `translate(${lx}, ${ly})`)
    }
    update(springHeading.get())
    return springHeading.on('change', update)
  }, [springHeading, hasHeading, heading])

  return (
    <svg viewBox="12 12 176 176" className="w-full h-auto">
      {/* Minor ticks every 30deg */}
      {TICK_ANGLES.map((angle) => {
        const isCardinal = angle % 90 === 0
        const innerR = isCardinal ? 75 : 79
        const rad = (angle - 90) * (Math.PI / 180)
        return (
          <line
            key={angle}
            x1={100 + innerR * Math.cos(rad)}
            y1={100 + innerR * Math.sin(rad)}
            x2={100 + 85 * Math.cos(rad)}
            y2={100 + 85 * Math.sin(rad)}
            className="stroke-foreground/20"
            strokeWidth={1}
          />
        )
      })}

      {/* Cardinal labels */}
      {CARDINALS.map(({ label, angle }) => {
        const rad = (angle - 90) * (Math.PI / 180)
        const r = 65
        return (
          <text
            key={label}
            x={100 + r * Math.cos(rad)}
            y={100 + r * Math.sin(rad)}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground text-[11px] font-semibold"
          >
            {label}
          </text>
        )
      })}

      {/* Heading pointer — drawn at north, spring-rotated around compass center */}
      {heading !== null && (
        <g ref={pointerRef}>
          <line
            x1={100}
            y1={100 - INNER_R}
            x2={100}
            y2={100 - OUTER_R}
            className="stroke-foreground"
            strokeWidth="1"
          />
          <polygon
            points={`${100},${100 - ARROW_R} ${100 - ARROW_SPREAD},${100 - OUTER_R} ${100 + ARROW_SPREAD},${100 - OUTER_R}`}
            className="fill-foreground"
          />
        </g>
      )}

      {/* Heading label — position animated via spring, stays horizontal */}
      {heading !== null && (
        <g ref={labelRef}>
          <text
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground text-xs font-mono"
          >
            {heading.toFixed(0)}&deg;
          </text>
        </g>
      )}

      {/* Center: ground speed */}
      <text
        x="100"
        y="93"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-2xl"
      >
        {groundSpeed.toFixed(1)}
      </text>
      <text
        x="100"
        y="110"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-muted-foreground text-[10px]"
      >
        m/s
      </text>
    </svg>
  )
}
