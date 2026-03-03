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
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Battery</span>
          <span className="text-base text-foreground font-mono">{percentage}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-foreground/10 overflow-hidden">
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
