import type { FC } from 'react'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { NoData } from '@/components/ui/NoData'
import { useTelemetrySelector } from '@/hooks/useTelemetrySelector'
import { clsx } from 'clsx'

const barColor: (pct: number) => string = (pct) => {
  if (pct >= 60) return 'bg-green-500'
  if (pct >= 30) return 'bg-yellow-500'
  return 'bg-red-500'
}

export const BatteryCard: FC = () => {
  const percentage = useTelemetrySelector((s) => s.telemetry?.battery)

  return (
    <GlassCard>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs tracking-wider uppercase">
            Battery
          </span>
          <span className="text-foreground font-mono text-base">
            {percentage != null ? `${percentage}%` : <NoData />}
          </span>
        </div>
        <div className="bg-foreground/10 h-2.5 w-full overflow-hidden rounded-full">
          <motion.div
            className={clsx(
              `h-full rounded-full`,
              percentage !== undefined && barColor(percentage),
            )}
            initial={false}
            animate={{
              width: `${Math.max(0, Math.min(100, percentage || 0))}%`,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </div>
    </GlassCard>
  )
}
