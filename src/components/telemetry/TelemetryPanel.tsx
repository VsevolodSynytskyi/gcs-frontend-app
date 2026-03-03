import { motion } from 'motion/react'
import { useTelemetry } from '@/context/TelemetryContext'
import { useAppearance } from '@/context/AppearanceContext'
import { StatusCard } from './StatusCard'
import { BatteryCard } from './BatteryCard'
import { NavigationCard } from './NavigationCard'
import { PositionCard } from './PositionCard'
import { Perspective3DContainer } from '@/components/ui/Perspective3DContainer'

export function TelemetryPanel() {
  const { telemetry } = useTelemetry()
  const { appearance } = useAppearance()
  return (
    <motion.div
      initial={{ x: 40 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="absolute top-1/2 left-4 z-[1000] w-72 -translate-y-1/2"
    >
      <Perspective3DContainer
        maxTilt={10}
        perspective="800px"
        stiffness={80}
        damping={18}
      >
        <div
          className={`flex flex-col gap-1 ${appearance === 'dark' ? 'dark' : 'light'}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0 }}
          >
            <StatusCard />
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
            <PositionCard lat={telemetry?.lat ?? 0} lon={telemetry?.lon ?? 0} />
          </motion.div>
        </div>
      </Perspective3DContainer>
    </motion.div>
  )
}
