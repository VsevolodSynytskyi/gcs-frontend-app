import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapLayer } from './LayerSwitcher'

const droneIcon = L.divIcon({
  html: '✈',
  className: 'drone-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

const TILE_LAYERS: Record<MapLayer, { url: string; attribution: string }> = {
  Dark: {
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap, &copy; Stadia Maps',
  },
  Street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
  },
  Satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
}

function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(position, map.getZoom())
  }, [position, map])
  return null
}

function MapResizeObserver() {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container)
    return () => observer.disconnect()
  }, [map])
  return null
}

interface MapViewProps {
  position: [number, number]
  hasTelemetry: boolean
  activeLayer: MapLayer
}

export function MapView({ position, hasTelemetry, activeLayer }: MapViewProps) {
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
      {hasTelemetry && (
        <>
          <Marker position={position} icon={droneIcon} />
          <MapUpdater position={position} />
        </>
      )}
    </MapContainer>
  )
}
