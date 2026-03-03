import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'

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
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs tracking-wider uppercase">
            Battery
          </span>
          <span className="text-foreground font-mono text-base">
            {percentage}%
          </span>
        </div>
        <div className="bg-foreground/10 h-2.5 w-full overflow-hidden rounded-full">
          <motion.div
            className={`h-full rounded-full ${barColor(percentage)}`}
            initial={false}
            animate={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </div>
    </GlassCard>
  )
}
