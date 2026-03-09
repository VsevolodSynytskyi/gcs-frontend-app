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

interface MapViewProps {
  onMapReady?: (map: Map) => void
}

export function MapView({ onMapReady }: MapViewProps) {
  const { telemetry } = useTelemetry()
  const { mapLayer } = useAppearance()
  const position = useLastPosition(telemetry)
  const layer = TILE_LAYERS[mapLayer]

  return (
    <MapContainer
      ref={(map) => {
        if (map) onMapReady?.(map)
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
  )
}
