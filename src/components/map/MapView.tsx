import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapLayer } from './LayerSwitcher'

const droneIcon = L.divIcon({
  html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.16496 19.5025L10.5275 2.99281C11.1178 1.66906 12.8822 1.66906 13.4725 2.99281L20.835 19.5025C21.5021 20.9984 20.0209 22.5499 18.6331 21.809L12.7294 18.657C12.2702 18.4118 11.7298 18.4118 11.2706 18.657L5.36689 21.809C3.97914 22.5499 2.49789 20.9984 3.16496 19.5025Z" fill="#e54545"/>
    <circle cx="12" cy="12" r="2" fill="#991b1b"/>
  </svg>`,
  className: 'drone-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
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
