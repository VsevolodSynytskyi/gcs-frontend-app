import { Separator } from '@/components/ui/separator'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatItem } from '@/components/ui/StatItem'
import { NoData } from '@/components/ui/NoData'
import { Compass } from './Compass'

interface NavigationCardProps {
  heading?: number
  groundSpeed?: number
  altitude?: number
  verticalSpeed?: number
}

export function NavigationCard({
  heading,
  groundSpeed,
  altitude,
  verticalSpeed,
}: NavigationCardProps) {
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
