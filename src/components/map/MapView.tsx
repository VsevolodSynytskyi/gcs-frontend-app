import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapLayer } from './LayerSwitcher'
import { TILE_LAYERS } from './tileLayers'
import { DroneMarker } from './DroneMarker'
import { RecenterButton } from './RecenterButton'
import { MapResizeObserver } from './MapResizeObserver'

interface MapViewProps {
  position: [number, number]
  hasTelemetry: boolean
  activeLayer: MapLayer
  heading: number
}

export function MapView({ position, hasTelemetry, activeLayer, heading }: MapViewProps) {
  const layer = TILE_LAYERS[activeLayer]

  return (
    <MapContainer
      center={position}
      zoom={17}
      className="size-full"
      zoomControl={false}
    >
      <TileLayer key={activeLayer} url={layer.url} attribution={layer.attribution} />
      <MapResizeObserver />
      {hasTelemetry && <DroneMarker position={position} heading={heading} />}
      <RecenterButton position={position} />
    </MapContainer>
  )
}
