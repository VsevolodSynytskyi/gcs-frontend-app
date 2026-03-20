import { type FC, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTelemetry } from '@/context/TelemetryContext'
import { useAppearance } from '@/context/AppearanceContext'
import { useLastPosition } from '@/hooks/useLastPosition'
import { TILE_LAYERS } from './tileLayers'
import { DroneMarker } from './DroneMarker'
import { MapResizeObserver } from './MapResizeObserver'
import { MapScale } from './MapScale'
import { MapContextMenu } from './MapContextMenu'
import { MapControls } from './MapControls'
import { LayerSwitcher } from './LayerSwitcher'

export const MapView: FC = () => {
  const { telemetry } = useTelemetry()
  const { mapLayer } = useAppearance()
  const position = useLastPosition(telemetry)
  const layer = TILE_LAYERS[mapLayer]
  const [map, setMap] = useState<Map | null>(null)

  return (
    <div className="relative size-full">
      <MapContainer
        ref={(m) => {
          if (m) setMap(m)
        }}
        center={position}
        zoom={17}
        className="size-full"
        zoomControl={false}
      >
        <TileLayer
          key={mapLayer}
          url={layer.url}
          attribution={layer.attribution}
        />
        <MapResizeObserver />
        {telemetry && (
          <DroneMarker position={position} heading={telemetry.heading} />
        )}
        <MapScale />
        <MapContextMenu />
      </MapContainer>
      <LayerSwitcher />
      {map && (
        <div className="pointer-events-none absolute inset-y-0 right-3 z-1000 flex items-center">
          <div className="pointer-events-auto">
            <MapControls map={map} position={position} />
          </div>
        </div>
      )}
    </div>
  )
}
