import { useState } from 'react'
import type { Map } from 'leaflet'
import { useTelemetry } from '@/context/TelemetryContext'
import { useAppPhase } from '@/hooks/useAppPhase'
import { useLogStatusText } from '@/hooks/useLogStatusText'
import { useLastPosition } from '@/hooks/useLastPosition'
import { MapView } from '@/components/map/MapView'
import { MapControls } from '@/components/map/MapControls'
import { LayerSwitcher } from '@/components/map/LayerSwitcher'
import { TelemetryPanel } from '@/components/telemetry/TelemetryPanel'
import { IntroTransition } from '@/components/intro/IntroTransition'
import { Toaster } from '@/components/ui/Toaster'

function App() {
  const { connectionStatus, telemetry } = useTelemetry()
  const { phase, beginTransition, onTransitionComplete } =
    useAppPhase(connectionStatus)
  const isViewExpanded = phase === 'transitioning' || phase === 'active'
  useLogStatusText(connectionStatus === 'connected')
  const [map, setMap] = useState<Map | null>(null)
  const position = useLastPosition(telemetry)

  return (
    <div className="h-screen w-screen bg-(--color-background) p-1">
      <IntroTransition
        phase={phase}
        onBegin={beginTransition}
        onTransitionComplete={onTransitionComplete}
        map={<MapView onMapReady={setMap} />}
      >
        {isViewExpanded && (
          <>
            <LayerSwitcher />
            {map && (
              <div className="absolute inset-y-0 right-3 z-1000 flex items-center">
                <MapControls map={map} position={position} />
              </div>
            )}
            <TelemetryPanel />
          </>
        )}
      </IntroTransition>
      <Toaster />
    </div>
  )
}

export default App
