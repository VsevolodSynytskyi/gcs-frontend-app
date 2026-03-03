import { GlassCard } from '@/components/ui/GlassCard'
import { StatItem } from '@/components/ui/StatItem'

interface PositionCardProps {
  lat: number
  lon: number
}

export function PositionCard({ lat, lon }: PositionCardProps) {
  return (
    <GlassCard>
      <div className="grid grid-cols-2 gap-4">
        <StatItem label="Latitude">{lat.toFixed(7)}</StatItem>
        <StatItem label="Longitude">{lon.toFixed(7)}</StatItem>
      </div>
    </GlassCard>
  )
}
