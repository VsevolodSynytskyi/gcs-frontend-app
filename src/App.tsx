import { useState } from 'react'
import { useTelemetry } from './hooks/useTelemetry'
import { MapView } from './components/map/MapView'
import { TelemetryPanel } from './components/telemetry/TelemetryPanel'

function App() {
  const { telemetry, connectionStatus } = useTelemetry()
  const [mapLayer, setMapLayer] = useState('Dark')

  const position: [number, number] = telemetry
    ? [telemetry.lat, telemetry.lon]
    : [-35.3632, 149.1652]

  let panelAppearance: 'dark' | 'light'
  switch (mapLayer) {
    case 'Street':
      panelAppearance = 'light'
      break
    default:
      panelAppearance = 'dark'
  }

  const handleArm = () => {
    // TODO: POST MAV_CMD_COMPONENT_ARM_DISARM (400), param1=1
    console.log('Arm command (mock)')
  }

  const handleDisarm = () => {
    // TODO: POST MAV_CMD_COMPONENT_ARM_DISARM (400), param1=0
    console.log('Disarm command (mock)')
  }

  return (
    <div className="h-screen w-screen bg-(--color-background) p-1">
      <div className="size-full rounded-lg overflow-hidden relative">
        <MapView
          position={position}
          hasTelemetry={!!telemetry}
          onLayerChange={setMapLayer}
        />
        <TelemetryPanel
          telemetry={telemetry}
          connectionStatus={connectionStatus}
          onArm={handleArm}
          onDisarm={handleDisarm}
          appearance={panelAppearance}
        />
      </div>
    </div>
  )
}

export default App
