import { motion } from 'motion/react'
import type { ConnectionStatus, Telemetry } from '../../hooks/useTelemetry'
import { StatusCard } from './StatusCard'
import { BatteryCard } from './BatteryCard'
import { NavigationCard } from './NavigationCard'
import { PositionCard } from './PositionCard'

interface TelemetryPanelProps {
  telemetry: Telemetry | null
  connectionStatus: ConnectionStatus
  onArm: () => void
  onDisarm: () => void
  appearance: 'dark' | 'light'
}

export function TelemetryPanel({ telemetry, connectionStatus, onArm, onDisarm, appearance }: TelemetryPanelProps) {
  return (
    <motion.div
      initial={{ x: 40 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-[1000] w-72"
    >
      <div className={`flex flex-col gap-1 ${appearance === 'dark' ? 'dark' : 'light'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0 }}
        >
          <StatusCard
            connectionStatus={connectionStatus}
            armed={telemetry?.armed ?? false}
            onArm={onArm}
            onDisarm={onDisarm}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          <BatteryCard percentage={telemetry?.battery ?? 0} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <NavigationCard
            heading={telemetry?.heading ?? 0}
            groundSpeed={telemetry?.groundSpeed ?? 0}
            altitude={telemetry?.alt ?? 0}
            verticalSpeed={telemetry?.verticalSpeed ?? 0}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <PositionCard
            lat={telemetry?.lat ?? 0}
            lon={telemetry?.lon ?? 0}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
