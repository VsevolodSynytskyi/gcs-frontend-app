import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

interface CompassProps {
  heading: number
  groundSpeed: number
}

const CARDINALS = [
  { label: 'N', angle: 0 },
  { label: 'E', angle: 90 },
  { label: 'S', angle: 180 },
  { label: 'W', angle: 270 },
]

const TICK_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30)

export function Compass({ heading: _heading, groundSpeed }: CompassProps) {
  // TODO: remove test heading cycle
  const [heading, setHeading] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setHeading((h) => (h + 1) % 360), 100)
    return () => clearInterval(id)
  }, [])

  return (
    <svg viewBox="12 12 176 176" className="w-full h-auto">
      {/* Outer ring */}
      <circle cx="100" cy="100" r="85" className="fill-none stroke-(--gray-a6)" strokeWidth="1" />

      {/* Minor ticks every 30deg */}
      {TICK_ANGLES.map((angle) => {
        const isCardinal = angle % 90 === 0
        const innerR = isCardinal ? 75 : 79
        const rad = (angle - 90) * (Math.PI / 180)
        const x1 = 100 + innerR * Math.cos(rad)
        const y1 = 100 + innerR * Math.sin(rad)
        const x2 = 100 + 85 * Math.cos(rad)
        const y2 = 100 + 85 * Math.sin(rad)
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="stroke-(--gray-a6)"
            strokeWidth={1}
          />
        )
      })}

      {/* Cardinal labels */}
      {CARDINALS.map(({ label, angle }) => {
        const rad = (angle - 90) * (Math.PI / 180)
        const r = 65
        const x = 100 + r * Math.cos(rad)
        const y = 100 + r * Math.sin(rad)
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-(--gray-11) text-[11px] font-semibold"
          >
            {label}
          </text>
        )
      })}

      {/* Heading line — computed endpoint */}
      {(() => {
        const rad = (heading - 90) * (Math.PI / 180)
        return (
          <line
            x1="100"
            y1="100"
            x2={100 + 85 * Math.cos(rad)}
            y2={100 + 85 * Math.sin(rad)}
            className="stroke-(--accent-9)"
            strokeWidth="2"
          />
        )
      })()}

      {/* Center: ground speed */}
      <text
        x="100"
        y="93"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-(--gray-12) text-2xl font-bold"
      >
        {groundSpeed.toFixed(1)}
      </text>
      <text
        x="100"
        y="110"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-(--gray-11) text-[10px]"
      >
        m/s
      </text>

      {/* Heading value below speed */}
      <text
        x="100"
        y="128"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-(--gray-12) text-xs font-bold font-mono"
      >
        {heading.toFixed(0)}&deg;
      </text>
    </svg>
  )
}
