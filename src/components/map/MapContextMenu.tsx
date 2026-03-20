import { type FC, useCallback, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Marker, useMapEvents } from 'react-leaflet'
import type { LatLng, LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import { Locate } from 'lucide-react'
import { useTelemetry } from '@/context/TelemetryContext'
import { goToLocation } from '@/api/droneControl'
import { MapPopover, type MapPopoverItem } from './MapPopover'

const ICON_SIZE = 24

const locateIcon = L.divIcon({
  html: renderToStaticMarkup(
    <Locate size={ICON_SIZE} color="white" strokeWidth={2} />,
  ),
  className: '!bg-transparent !border-none flex items-center justify-center',
  iconSize: [ICON_SIZE, ICON_SIZE],
  iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
})

export const MapContextMenu: FC = () => {
  const { telemetry, connectionStatus } = useTelemetry()
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
      disabled: !telemetry?.armed || connectionStatus !== 'connected',
      onClick: async () => {
        if (!click || !telemetry) return
        const { lat, lng } = click.latlng
        await goToLocation(lat, lng, telemetry.position.alt)
        setClick(null)
      },
    },
  ]

  return (
    <>
      {click && (
        <Marker
          position={[click.latlng.lat, click.latlng.lng]}
          icon={locateIcon}
          interactive={false}
        />
      )}
      <MapPopover
        open={!!click}
        x={click?.x ?? 0}
        y={click?.y ?? 0}
        items={items}
        onClose={() => setClick(null)}
      />
    </>
  )
}
