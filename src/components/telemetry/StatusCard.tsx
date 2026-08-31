import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTelemetrySelector } from '@/hooks/useTelemetrySelector'
import { armAndTakeoff, land } from '@/api/droneControl'
import { DroneStatusBadge } from '@/components/telemetry/DroneStatusBadge'

export const StatusCard: FC = () => {
  const connectionStatus = useTelemetrySelector((s) => s.connectionStatus)
  const systemStatus = useTelemetrySelector((s) => s.telemetry?.systemStatus)
  const sensorsHealthy = useTelemetrySelector(
    (s) => s.telemetry?.sensorsHealthy,
  )
  const armed = useTelemetrySelector((s) => s.telemetry?.armed)

  const canTakeOff =
    connectionStatus === 'connected' &&
    systemStatus === 'MAV_STATE_STANDBY' &&
    sensorsHealthy &&
    !armed
  const canLand = armed === true

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

  console.log(`StatusCard`)

  return (
    <GlassCard>
      <div className="flex flex-col gap-3">
        <div>
          <DroneStatusBadge
            connectionStatus={connectionStatus}
            systemStatus={systemStatus}
            sensorsHealthy={sensorsHealthy}
            armed={armed}
          />
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
