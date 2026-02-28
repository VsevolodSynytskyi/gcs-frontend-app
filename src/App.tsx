import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Telemetry {
  lat: number
  lon: number
  alt: number
  heading: number
  groundSpeed: number
  battery: number
}

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

function App() {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null)

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const base = 'http://localhost:8088/mavlink/vehicles/1/components/1/messages'

        const [posRes, battRes] = await Promise.all([
          fetch(`${base}/GLOBAL_POSITION_INT`),
          fetch(`${base}/SYS_STATUS`),
        ])

        const pos = await posRes.json()
        const batt = await battRes.json()

        setTelemetry({
          lat: pos.message.lat / 1e7,
          lon: pos.message.lon / 1e7,
          alt: pos.message.alt / 1000,
          heading: pos.message.hdg / 100,
          groundSpeed: Math.sqrt(
            Math.pow(pos.message.vx / 100, 2) + Math.pow(pos.message.vy / 100, 2),
          ),
          battery: batt.message.battery_remaining,
        })
      } catch (e) {
        console.error(e)
      }
    }

    const interval = setInterval(fetchTelemetry, 100)
    return () => clearInterval(interval)
  }, [])

  const position: [number, number] = telemetry
    ? [telemetry.lat, telemetry.lon]
    : [-35.3632, 149.1652]

  return (
    <div className="flex h-screen">
      <div className="w-64 p-5 font-mono bg-(--color-panel-solid) text-white">
        <h2 className="text-lg font-semibold mb-3">Telemetry</h2>
        {telemetry ? (
          <div className="space-y-1 text-sm">
            <p>Lat: {telemetry.lat.toFixed(7)}</p>
            <p>Lon: {telemetry.lon.toFixed(7)}</p>
            <p>Alt: {telemetry.alt.toFixed(1)} m</p>
            <p>Hdg: {telemetry.heading.toFixed(0)}&deg;</p>
            <p>Spd: {telemetry.groundSpeed.toFixed(1)} m/s</p>
            <p>Bat: {telemetry.battery}%</p>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">Waiting...</p>
        )}
      </div>
      <div className="flex-1 size-full">
        <MapContainer
          center={position}
          zoom={17}
          className="size-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
          {telemetry && (
            <>
              <Marker position={position} icon={droneIcon} />
              <MapUpdater position={position} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  )
}

export default App
