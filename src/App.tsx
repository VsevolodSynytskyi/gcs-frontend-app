import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { useTelemetry } from './hooks/useTelemetry'
import { useAppPhase } from './hooks/useAppPhase'
import { MapView } from './components/map/MapView'
import { TelemetryPanel } from './components/telemetry/TelemetryPanel'
import { IntroCard } from './components/intro/IntroCard'

function App() {
  const { telemetry, connectionStatus } = useTelemetry()
  const { phase, beginTransition, onTransitionComplete } = useAppPhase(connectionStatus)
  const [mapLayer, setMapLayer] = useState('Dark')

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const cardClipRef = useRef('inset(30% 30% 30% 30% round 12px)')
  const lastPosition = useRef<[number, number]>([0, 0])

  if (telemetry) {
    lastPosition.current = [telemetry.lat, telemetry.lon]
  }
  const position = lastPosition.current

  let panelAppearance: 'dark' | 'light'
  switch (mapLayer) {
    case 'Street':
      panelAppearance = 'light'
      break
    default:
      panelAppearance = 'dark'
  }

  const sendArmCommand = (arm: boolean) => {
    fetch('http://localhost:8088/mavlink', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        header: { system_id: 255, component_id: 0, sequence: 0 },
        message: {
          type: 'COMMAND_LONG',
          param1: arm ? 1 : 0,
          param2: 0, param3: 0, param4: 0, param5: 0, param6: 0, param7: 0,
          command: { type: 'MAV_CMD_COMPONENT_ARM_DISARM' },
          target_system: 1,
          target_component: 1,
          confirmation: 0,
        },
      }),
    }).catch(console.error)
  }

  const handleArm = () => sendArmCommand(true)
  const handleDisarm = () => sendArmCommand(false)

  const isCard = phase === 'idle' || phase === 'ready'
  const isExpanded = phase === 'transitioning' || phase === 'active'

  // Measure card position relative to container for clip-path
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
    <div className="h-screen w-screen bg-(--color-background) p-1">
      <div ref={containerRef} className="size-full relative">
        {/* Map — mounted early for preloading, hidden until transition */}
        {telemetry && (
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={
              isExpanded
                ? { clipPath: 'inset(0px round 8px)', opacity: 1 }
                : { clipPath: cardClipRef.current, opacity: 0 }
            }
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={() => {
              if (phase === 'transitioning') onTransitionComplete()
            }}
          >
            <MapView
              position={position}
              hasTelemetry={!!telemetry}
              onLayerChange={setMapLayer}
            />
          </motion.div>
        )}

        {/* Intro card — unmounts instantly on begin */}
        {isCard && (
          <div className="absolute inset-0 flex items-center justify-center z-[1]">
            <div
              ref={cardRef}
              className="w-72 backdrop-blur-sm bg-(--gray-a2) border border-white/10 shadow-lg rounded-xl"
            >
              <IntroCard phase={phase} onBegin={beginTransition} />
            </div>
          </div>
        )}

        {/* Telemetry panel — enters as soon as transition starts */}
        {isExpanded && (
          <TelemetryPanel
            telemetry={telemetry}
            connectionStatus={connectionStatus}
            onArm={handleArm}
            onDisarm={handleDisarm}
            appearance={panelAppearance}
          />
        )}
      </div>
    </div>
  )
}

export default App
