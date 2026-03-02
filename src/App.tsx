import { useState } from 'react'
import { useTelemetry } from './hooks/useTelemetry'
import { useAppPhase } from './hooks/useAppPhase'
import { useLastPosition } from './hooks/useLastPosition'
import { arm, disarm } from './api/droneControl'
import { MapView } from './components/map/MapView'
import { LayerSwitcher, type MapLayer } from './components/map/LayerSwitcher'
import { TelemetryPanel } from './components/telemetry/TelemetryPanel'
import { IntroTransition } from './components/intro/IntroTransition'

function App() {
  const { telemetry, connectionStatus } = useTelemetry()
  const { phase, beginTransition, onTransitionComplete } = useAppPhase(connectionStatus)
  const [mapLayer, setMapLayer] = useState<MapLayer>('Dark')
  const position = useLastPosition(telemetry)

  const isExpanded = phase === 'transitioning' || phase === 'active'
  let panelAppearance: 'dark' | 'light'
  switch (mapLayer) {
    case 'Street':
      panelAppearance = 'light'
      break
    case 'Dark':
    case 'Satellite':
      panelAppearance = 'dark'
      break
  }

  return (
    <div className="h-screen w-screen bg-(--color-background) p-1">
      <IntroTransition
        phase={phase}
        telemetry={telemetry}
        onBegin={beginTransition}
        onTransitionComplete={onTransitionComplete}
        map={<MapView position={position} hasTelemetry={!!telemetry} activeLayer={mapLayer} heading={telemetry?.heading ?? 0} />}
      >
        {isExpanded && (
          <>
            <LayerSwitcher
              activeLayer={mapLayer}
              onLayerChange={setMapLayer}
              appearance={panelAppearance}
            />
            <TelemetryPanel
              telemetry={telemetry}
              connectionStatus={connectionStatus}
              onArm={arm}
              onDisarm={disarm}
              appearance={panelAppearance}
            />
          </>
        )}
      </IntroTransition>
    </div>
  )
}

export default App
