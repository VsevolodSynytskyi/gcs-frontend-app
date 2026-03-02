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

export function Compass({ heading, groundSpeed }: CompassProps) {
  return (
    <svg viewBox="12 12 176 176" className="w-full h-auto">
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
            className="stroke-foreground/20"
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
            className="fill-muted-foreground text-[11px] font-semibold"
          >
            {label}
          </text>
        )
      })}

      {/* Heading pointer + label */}
      {heading !== null && (() => {
        const rad = (heading - 90) * (Math.PI / 180)
        const innerR = 35
        const outerR = 43
        const arrowR = 45
        const arrowSpread = 2
        const labelR = 75
        const perpRad = rad + Math.PI / 2
        return (
          <>
            <line
              x1={100 + innerR * Math.cos(rad)}
              y1={100 + innerR * Math.sin(rad)}
              x2={100 + outerR * Math.cos(rad)}
              y2={100 + outerR * Math.sin(rad)}
              className="stroke-foreground"
              strokeWidth="1"
            />
            <polygon
              points={`${100 + arrowR * Math.cos(rad)},${100 + arrowR * Math.sin(rad)} ${100 + outerR * Math.cos(rad) + arrowSpread * Math.cos(perpRad)},${100 + outerR * Math.sin(rad) + arrowSpread * Math.sin(perpRad)} ${100 + outerR * Math.cos(rad) - arrowSpread * Math.cos(perpRad)},${100 + outerR * Math.sin(rad) - arrowSpread * Math.sin(perpRad)}`}
              className="fill-foreground"
            />
            <text
              x={100 + labelR * Math.cos(rad)}
              y={100 + labelR * Math.sin(rad)}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground text-xs font-mono"
            >
              {heading.toFixed(0)}&deg;
            </text>
          </>
        )
      })()}

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
