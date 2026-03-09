import { AnimatePresence, motion } from 'motion/react'
import { Badge, type badgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { GlassCard } from '@/components/ui/GlassCard'
import {
  type ConnectionStatus,
  type SystemStatus,
  useTelemetry,
} from '@/hooks/useTelemetry'
import { NoData } from '@/components/ui/NoData'
import { armAndTakeoff, land } from '@/api/droneControl'
import type { VariantProps } from 'class-variance-authority'

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

const connectionBadge: Record<
  ConnectionStatus,
  { variant: BadgeVariant; label: string }
> = {
  connected: { variant: 'default', label: 'Connected' },
  disconnected: { variant: 'destructive', label: 'Disconnected' },
  reconnecting: { variant: 'secondary', label: 'Reconnecting' },
}

const systemStatusBadge: Record<
  SystemStatus,
  { variant: BadgeVariant; label: string }
> = {
  MAV_STATE_UNINIT: { variant: 'secondary', label: 'Initializing' },
  MAV_STATE_BOOT: { variant: 'secondary', label: 'Booting' },
  MAV_STATE_CALIBRATING: { variant: 'secondary', label: 'Calibrating' },
  MAV_STATE_STANDBY: { variant: 'default', label: 'Ready' },
  MAV_STATE_ACTIVE: { variant: 'default', label: 'Active' },
  MAV_STATE_CRITICAL: { variant: 'destructive', label: 'Critical' },
  MAV_STATE_EMERGENCY: { variant: 'destructive', label: 'Emergency' },
  MAV_STATE_POWEROFF: { variant: 'secondary', label: 'Power Off' },
}

export function StatusCard() {
  const { telemetry, connectionStatus } = useTelemetry()
  const armed = telemetry?.armed
  const systemStatus = telemetry?.systemStatus
  const connected = connectionStatus === 'connected'
  const sensorsHealthy = telemetry?.sensorsHealthy ?? false
  const readyToArm =
    (systemStatus === 'MAV_STATE_STANDBY' ||
      systemStatus === 'MAV_STATE_ACTIVE') &&
    sensorsHealthy
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
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-muted-foreground mb-1 block text-xs tracking-wider uppercase">
              Connection
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={connectionStatus}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Badge variant={connectionBadge[connectionStatus].variant}>
                  {connectionStatus === 'reconnecting' && (
                    <motion.span
                      className="mr-1 inline-block size-1.5 rounded-full bg-current"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                      }}
                    />
                  )}
                  {connectionBadge[connectionStatus].label}
                </Badge>
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <span className="text-muted-foreground mb-1 block text-xs tracking-wider uppercase">
              Status
            </span>
            {systemStatus != null ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${systemStatus}-${sensorsHealthy}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {readyToArm ? (
                    <Badge variant="default">Ready</Badge>
                  ) : (
                    <Badge variant={systemStatusBadge[systemStatus].variant}>
                      {(systemStatus === 'MAV_STATE_CALIBRATING' ||
                        (systemStatus === 'MAV_STATE_STANDBY' &&
                          !sensorsHealthy)) && (
                        <motion.span
                          className="mr-1 inline-block size-1.5 rounded-full bg-current"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                          }}
                        />
                      )}
                      {systemStatus === 'MAV_STATE_STANDBY' && !sensorsHealthy
                        ? 'Preflight'
                        : systemStatusBadge[systemStatus].label}
                    </Badge>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <NoData />
            )}
          </div>

          <div>
            <span className="text-muted-foreground mb-1 block text-xs tracking-wider uppercase">
              Motors
            </span>
            {armed != null ? (
              <Badge variant={armed ? 'default' : 'destructive'}>
                {armed ? 'Armed' : 'Disarmed'}
              </Badge>
            ) : (
              <NoData />
            )}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Button
            className="w-full"
            disabled={!connected || !!armed || !readyToArm}
            onClick={onTakeOffClick}
          >
            Take off
          </Button>
          <Button
            className="w-full"
            disabled={!connected || !armed}
            onClick={onLandClick}
          >
            Land
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
