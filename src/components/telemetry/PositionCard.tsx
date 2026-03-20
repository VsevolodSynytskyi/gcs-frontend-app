import type { FC } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatItem } from '@/components/ui/StatItem'
import { NoData } from '@/components/ui/NoData'
import { useTelemetrySelector } from '@/hooks/useTelemetrySelector'

export const PositionCard: FC = () => {
  const lat = useTelemetrySelector((s) => s.telemetry?.position.lat)
  const lon = useTelemetrySelector((s) => s.telemetry?.position.lon)

  const latText = lat != null ? lat.toFixed(7) : <NoData />
  const lonText = lon != null ? lon.toFixed(7) : <NoData />

  return (
    <GlassCard>
      <div className="grid grid-cols-2 gap-4">
        <StatItem label="Latitude">{latText}</StatItem>
        <StatItem label="Longitude">{lonText}</StatItem>
      </div>
    </GlassCard>
  )
}
