import { GlassCard } from '../ui/GlassCard'

interface PositionCardProps {
  lat: number
  lon: number
}

export function PositionCard({ lat, lon }: PositionCardProps) {
  return (
    <GlassCard>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Latitude</span>
          <span className="text-base text-foreground font-mono">{lat.toFixed(7)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Longitude</span>
          <span className="text-base text-foreground font-mono">{lon.toFixed(7)}</span>
        </div>
      </div>
    </GlassCard>
  )
}
