import type { FC } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Badge, type badgeVariants } from '@/components/ui/badge'
import type { VariantProps } from 'class-variance-authority'
import type { ConnectionStatus, SystemStatus } from '@/api/telemetry'

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

type DroneStatus =
  | 'disconnected'
  | 'connecting'
  | 'initializing'
  | 'booting'
  | 'calibrating'
  | 'preflight'
  | 'ready'
  | 'armed'
  | 'critical'
  | 'emergency'
  | 'poweroff'

type DroneStatusBadgeProps = {
  connectionStatus: ConnectionStatus
  systemStatus?: SystemStatus
  sensorsHealthy?: boolean
  armed?: boolean
}

const STATUS_CONFIG: Record<
  DroneStatus,
  { variant: BadgeVariant; label: string; pulsing: boolean }
> = {
  disconnected: {
    variant: 'destructive',
    label: 'Disconnected',
    pulsing: false,
  },
  connecting: {
    variant: 'secondary',
    label: 'Connecting',
    pulsing: true,
  },
  initializing: {
    variant: 'secondary',
    label: 'Initializing',
    pulsing: true,
  },
  booting: {
    variant: 'secondary',
    label: 'Booting',
    pulsing: true,
  },
  calibrating: {
    variant: 'secondary',
    label: 'Calibrating',
    pulsing: true,
  },
  preflight: {
    variant: 'secondary',
    label: 'Preflight',
    pulsing: true,
  },
  ready: {
    variant: 'default',
    label: 'Ready',
    pulsing: false,
  },
  armed: {
    variant: 'default',
    label: 'Armed',
    pulsing: false,
  },
  critical: {
    variant: 'destructive',
    label: 'Critical',
    pulsing: false,
  },
  emergency: {
    variant: 'destructive',
    label: 'Emergency',
    pulsing: false,
  },
  poweroff: {
    variant: 'secondary',
    label: 'Power Off',
    pulsing: false,
  },
}

const SYSTEM_STATUS_MAP: Record<SystemStatus, DroneStatus> = {
  MAV_STATE_UNINIT: 'initializing',
  MAV_STATE_BOOT: 'booting',
  MAV_STATE_CALIBRATING: 'calibrating',
  MAV_STATE_STANDBY: 'ready',
  MAV_STATE_ACTIVE: 'armed',
  MAV_STATE_CRITICAL: 'critical',
  MAV_STATE_EMERGENCY: 'emergency',
  MAV_STATE_POWEROFF: 'poweroff',
}

const resolveDroneStatus: (
  args: DroneStatusBadgeProps,
) => DroneStatus | null = ({
  connectionStatus,
  systemStatus,
  sensorsHealthy,
  armed,
}) => {
  if (!systemStatus) {
    if (connectionStatus === 'reconnecting') return 'connecting'
    return null
  }

  if (connectionStatus === 'disconnected') return 'disconnected'

  if (armed) return 'armed'

  const mapped = SYSTEM_STATUS_MAP[systemStatus]

  if (mapped === 'ready' && !sensorsHealthy) return 'preflight'

  return mapped
}

export const DroneStatusBadge: FC<DroneStatusBadgeProps> = (props) => {
  const status = resolveDroneStatus(props)

  if (!status)
    return (
      <Badge variant="secondary" className="invisible">
        Loading
      </Badge>
    )

  const { variant, label, pulsing } = STATUS_CONFIG[status]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <Badge variant={variant}>
          {pulsing && (
            <motion.span
              className="mr-1 inline-block size-1.5 rounded-full bg-current"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
          {label}
        </Badge>
      </motion.div>
    </AnimatePresence>
  )
}
