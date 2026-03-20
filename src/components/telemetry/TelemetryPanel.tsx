import type { FC } from 'react'
import { motion } from 'motion/react'
import { StatusCard } from './StatusCard'
import { BatteryCard } from './BatteryCard'
import { NavigationCard } from './NavigationCard'
import { PositionCard } from './PositionCard'
import { Perspective3DContainer } from '@/components/ui/Perspective3DContainer'

export const TelemetryPanel: FC = () => {
  return (
    <motion.div
      initial={{ x: '-110%' }}
      animate={{ x: 0 }}
      exit={{ x: '-110%' }}
      className="absolute top-1/2 left-4 z-1000 w-72 -translate-y-1/2"
    >
      <Perspective3DContainer>
        <div className="flex flex-col gap-1">
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
            <BatteryCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <NavigationCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <PositionCard />
          </motion.div>
        </div>
      </Perspective3DContainer>
    </motion.div>
  )
}
