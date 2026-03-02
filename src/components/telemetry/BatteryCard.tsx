import { Flex, Text } from '@radix-ui/themes'
import { motion } from 'motion/react'
import { GlassCard } from '../ui/GlassCard'

interface BatteryCardProps {
  percentage: number
}

function barColor(pct: number): string {
  if (pct >= 60) return 'bg-green-500'
  if (pct >= 30) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function BatteryCard({ percentage }: BatteryCardProps) {
  return (
    <GlassCard>
      <Flex direction="column" gap="2">
        <Flex justify="between" align="center">
          <Text size="1" color="gray" className="uppercase tracking-wider">Battery</Text>
          <Text size="3" weight="bold" color="gray" highContrast className="font-mono">
            {percentage}%
          </Text>
        </Flex>
        <div className="h-2.5 w-full rounded-full bg-(--gray-a3) overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor(percentage)}`}
            animate={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </Flex>
    </GlassCard>
  )
}
