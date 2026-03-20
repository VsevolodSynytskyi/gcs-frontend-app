import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTelemetry } from '@/hooks/useTelemetry'
import { armAndTakeoff, land } from '@/api/droneControl'
import { DroneStatusBadge } from '@/components/telemetry/DroneStatusBadge'

export const StatusCard: FC = () => {
  const { telemetry, connectionStatus } = useTelemetry()

  const canTakeOff =
    connectionStatus === 'connected' &&
    telemetry?.systemStatus === 'MAV_STATE_STANDBY' &&
    telemetry?.sensorsHealthy &&
    !telemetry?.armed
  const canLand = telemetry?.armed === true

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
            systemStatus={telemetry?.systemStatus}
            sensorsHealthy={telemetry?.sensorsHealthy}
            armed={telemetry?.armed}
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
