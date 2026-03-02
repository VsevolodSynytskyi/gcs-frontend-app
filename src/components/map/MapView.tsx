import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapLayer } from './LayerSwitcher'

function createDroneIcon(heading: number) {
  return L.divIcon({
    html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${heading + 45}deg)">
    <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" fill="#e54545"/>
  </svg>`,
    className: 'drone-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

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
  heading: number
}

export function MapView({ position, hasTelemetry, activeLayer, heading }: MapViewProps) {
  const layer = TILE_LAYERS[activeLayer]
  const icon = useMemo(() => createDroneIcon(heading), [heading])

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
          <Marker position={position} icon={icon} />
          <MapUpdater position={position} />
        </>
      )}
    </MapContainer>
  )
}
