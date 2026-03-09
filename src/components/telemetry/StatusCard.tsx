import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTelemetry } from '@/hooks/useTelemetry'
import { armAndTakeoff, land } from '@/api/droneControl'
import {
  DroneStatusBadge,
  resolveDroneStatus,
} from '@/components/telemetry/DroneStatusBadge'

export function StatusCard() {
  const { telemetry, connectionStatus } = useTelemetry()

  const droneStatus = resolveDroneStatus({
    connectionStatus,
    systemStatus: telemetry?.systemStatus,
    sensorsHealthy: telemetry?.sensorsHealthy ?? false,
    armed: telemetry?.armed,
  })

  const canTakeOff = droneStatus === 'ready'
  const canLand = droneStatus === 'armed'

  const onTakeOffClick = async () => {
    try {
      await armAndTakeoff()
    } catch {
      // Toast already shown by sendCommand
    }
  }
  const onLandClick = async () => {
    try {
      await land()
    } catch {
      // Toast already shown by sendCommand
    }
  }

  return (
    <GlassCard>
      <div className="flex flex-col gap-3">
        <div>
          <DroneStatusBadge status={droneStatus} />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Button
            className="w-full"
            disabled={!canTakeOff}
            onClick={onTakeOffClick}
          >
            Take off
          </Button>
          <Button className="w-full" disabled={!canLand} onClick={onLandClick}>
            Land
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
