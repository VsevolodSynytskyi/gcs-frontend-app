import { Separator } from '@/components/ui/separator'
import { GlassCard } from '../ui/GlassCard'
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
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Altitude</span>
          <span className="text-base font-bold text-foreground font-mono">
            {altitude.toFixed(1)} m
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Vertical Speed</span>
          <span className="text-base font-bold text-foreground font-mono">
            {verticalSpeed > 0 ? '+' : ''}{verticalSpeed.toFixed(1)} m/s
          </span>
        </div>
      </div>
    </GlassCard>
  )
}
