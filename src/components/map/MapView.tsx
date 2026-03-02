import { useEffect } from 'react'
import { LayersControl, MapContainer, Marker, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const droneIcon = L.divIcon({
  html: '✈',
  className: 'drone-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

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

function LayerChangeListener({ onLayerChange }: { onLayerChange: (name: string) => void }) {
  useMapEvent('baselayerchange', (e) => {
    onLayerChange(e.name)
  })
  return null
}

interface MapViewProps {
  position: [number, number]
  hasTelemetry: boolean
  onLayerChange?: (layerName: string) => void
}

export function MapView({ position, hasTelemetry, onLayerChange }: MapViewProps) {
  return (
    <MapContainer
      center={position}
      zoom={17}
      className="size-full"
      zoomControl={false}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Dark" checked>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap, &copy; CARTO"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Street">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <MapResizeObserver />
      {onLayerChange && <LayerChangeListener onLayerChange={onLayerChange} />}
      {hasTelemetry && (
        <>
          <Marker position={position} icon={droneIcon} />
          <MapUpdater position={position} />
        </>
      )}
    </MapContainer>
  )
}
