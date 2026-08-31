import type { FC } from 'react'
import { Separator } from '@/components/ui/separator'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatItem } from '@/components/ui/StatItem'
import { NoData } from '@/components/ui/NoData'
import { useTelemetrySelector } from '@/hooks/useTelemetrySelector'
import { Compass } from './Compass'

export const NavigationCard: FC = () => {
  const heading = useTelemetrySelector((s) => s.telemetry?.heading)
  const groundSpeed = useTelemetrySelector((s) => s.telemetry?.groundSpeed)
  const altitude = useTelemetrySelector((s) => s.telemetry?.position.alt)
  const verticalSpeed = useTelemetrySelector((s) => s.telemetry?.verticalSpeed)

  const altitudeText =
    altitude != null ? `${altitude.toFixed(1)} m` : <NoData />
  const verticalSpeedText =
    verticalSpeed != null ? (
      `${verticalSpeed > 0 ? '+' : ''}${verticalSpeed.toFixed(1)} m/s`
    ) : (
      <NoData />
    )

  return (
    <GlassCard>
      <Compass heading={heading ?? null} groundSpeed={groundSpeed ?? null} />
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-4">
        <StatItem label="Altitude">{altitudeText}</StatItem>
        <StatItem label="Vertical Speed">{verticalSpeedText}</StatItem>
      </div>
    </GlassCard>
  )
}
