import { type FC, useCallback } from 'react'
import type { Map } from 'leaflet'
import { Crosshair, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { GlassCard } from '@/components/ui/GlassCard.tsx'
import { useTelemetrySelector } from '@/hooks/useTelemetrySelector'

interface MapControlsProps {
  map: Map
  position: [number, number]
}

export const MapControls: FC<MapControlsProps> = ({ map, position }) => {
  const connected = useTelemetrySelector(
    (s) => s.connectionStatus === 'connected',
  )
  const handleRecenter = useCallback(() => {
    map.setView(position, map.getZoom())
  }, [map, position])

  const handleZoomIn = useCallback(() => {
    map.zoomIn()
  }, [map])

  const handleZoomOut = useCallback(() => {
    map.zoomOut()
  }, [map])

  return (
    <GlassCard className="flex flex-col gap-1 p-1">
      <Tooltip content="Re-center on drone" side="left">
        <Button size="icon" disabled={!connected} onClick={handleRecenter}>
          <Crosshair size={18} />
        </Button>
      </Tooltip>
      <Tooltip content="Zoom in" side="left">
        <Button size="icon" onClick={handleZoomIn}>
          <Plus size={18} />
        </Button>
      </Tooltip>
      <Tooltip content="Zoom out" side="left">
        <Button size="icon" onClick={handleZoomOut}>
          <Minus size={18} />
        </Button>
      </Tooltip>
    </GlassCard>
  )
}
