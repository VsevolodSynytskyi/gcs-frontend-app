import { Separator } from '@/components/ui/separator'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatItem } from '@/components/ui/StatItem'
import { Compass } from './Compass'

interface NavigationCardProps {
  heading: number
  groundSpeed: number
  altitude: number
  verticalSpeed: number
}

export function NavigationCard({ heading, groundSpeed, altitude, verticalSpeed }: NavigationCardProps) {
  return (
    <GlassCard>
      <Compass heading={heading} groundSpeed={groundSpeed} />
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-4">
        <StatItem label="Altitude">{altitude.toFixed(1)} m</StatItem>
        <StatItem label="Vertical Speed">
          {verticalSpeed > 0 ? '+' : ''}{verticalSpeed.toFixed(1)} m/s
        </StatItem>
      </div>
    </GlassCard>
  )
}
