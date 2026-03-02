import { useTelemetry } from './hooks/useTelemetry'
import { MapView } from './components/map/MapView'
import { TelemetryPanel } from './components/telemetry/TelemetryPanel'

function App() {
  const { telemetry, connectionStatus } = useTelemetry()

  const position: [number, number] = telemetry
    ? [telemetry.lat, telemetry.lon]
    : [-35.3632, 149.1652]

  const handleArm = () => {
    // TODO: POST MAV_CMD_COMPONENT_ARM_DISARM (400), param1=1
    console.log('Arm command (mock)')
  }

  const handleDisarm = () => {
    // TODO: POST MAV_CMD_COMPONENT_ARM_DISARM (400), param1=0
    console.log('Disarm command (mock)')
  }

  return (
    <div className="h-screen w-screen bg-(--color-background) p-3">
      <div className="size-full rounded-lg overflow-hidden relative">
        <MapView position={position} hasTelemetry={!!telemetry} />
        <TelemetryPanel
          telemetry={telemetry}
          connectionStatus={connectionStatus}
          onArm={handleArm}
          onDisarm={handleDisarm}
        />
      </div>
    </div>
  )
}

export default App
