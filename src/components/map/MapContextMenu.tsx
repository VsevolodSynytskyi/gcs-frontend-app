import { useState, useCallback } from 'react'
import { useMapEvents } from 'react-leaflet'
import type { LatLng, LeafletMouseEvent } from 'leaflet'
import { MapPin } from 'lucide-react'
import { useTelemetry } from '@/context/TelemetryContext'
import { goToLocation } from '@/api/droneControl'
import { MapPopover, type MapPopoverItem } from './MapPopover'

export function MapContextMenu() {
  const { telemetry } = useTelemetry()
  const [click, setClick] = useState<{
    latlng: LatLng
    x: number
    y: number
  } | null>(null)

  useMapEvents({
    click: useCallback((e: LeafletMouseEvent) => {
      setClick({
        latlng: e.latlng,
        x: e.containerPoint.x,
        y: e.containerPoint.y,
      })
    }, []),
  })

  const items: MapPopoverItem[] = [
    {
      label: 'Go to location',
      icon: <MapPin className="size-4" />,
      disabled: !telemetry,
      onClick: async () => {
        if (!click || !telemetry) return
        const { lat, lng } = click.latlng
        await goToLocation(lat, lng, telemetry.alt)
        setClick(null)
      },
    },
  ]

  return (
    <MapPopover
      open={!!click}
      x={click?.x ?? 0}
      y={click?.y ?? 0}
      items={items}
      onClose={() => setClick(null)}
    />
  )
}
