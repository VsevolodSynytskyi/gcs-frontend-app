import { type FC, useState } from 'react'
import { useTelemetry } from '@/context/TelemetryContext'
import { useAppPhase } from '@/hooks/useAppPhase'
import { useLogStatusText } from '@/hooks/useLogStatusText'
import { useLastPosition } from '@/hooks/useLastPosition'
import { MapControls } from '@/components/map/MapControls'
import { LayerSwitcher } from '@/components/map/LayerSwitcher'
import { TelemetryPanel } from '@/components/telemetry/TelemetryPanel'
import { IntroTransition } from '@/components/intro/IntroTransition'
import { Toaster } from '@/components/ui/Toaster'
import { MainView } from '@/components/MainView.tsx'
import type { Map } from 'leaflet'

const App: FC = () => {
  const { connectionStatus, telemetry } = useTelemetry()
  const { phase, beginTransition, onTransitionComplete } =
    useAppPhase(connectionStatus)
  const isViewExpanded = phase === 'transitioning' || phase === 'active'
  useLogStatusText(connectionStatus === 'connected')
  const position = useLastPosition(telemetry)
  const [map, setMap] = useState<Map | null>(null)

  return (
    <div className="h-screen w-screen bg-(--color-background) p-1">
      <IntroTransition
        phase={phase}
        onBegin={beginTransition}
        onTransitionComplete={onTransitionComplete}
        content={<MainView onMapReady={setMap} />}
      >
        {isViewExpanded && (
          <>
            <LayerSwitcher />
            {map && (
              <div className="pointer-events-none absolute inset-y-0 right-3 z-1000 flex items-center">
                <div className={`pointer-events-auto`}>
                  <MapControls map={map} position={position} />
                </div>
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
