import {useEffect, useState} from 'react'
import {MapContainer, Marker, TileLayer, useMap} from 'react-leaflet'
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

function MapUpdater({position}: { position: [number, number] }) {
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
            Math.pow(pos.message.vx / 100, 2) + Math.pow(pos.message.vy / 100, 2)
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
    <div style={{display: 'flex', height: '100vh'}}>
      <div style={{width: 250, padding: 20, fontFamily: 'monospace', background: '#1a1a1a', color: '#fff'}}>
        <h2>Telemetry</h2>
        {telemetry ? (
          <div>
            <p>Lat: {telemetry.lat.toFixed(7)}</p>
            <p>Lon: {telemetry.lon.toFixed(7)}</p>
            <p>Alt: {telemetry.alt.toFixed(1)} m</p>
            <p>Hdg: {telemetry.heading.toFixed(0)}°</p>
            <p>Spd: {telemetry.groundSpeed.toFixed(1)} m/s</p>
            <p>Bat: {telemetry.battery}%</p>
          </div>
        ) : (
          <p>Waiting...</p>
        )}
      </div>
      <div style={{flex: 1, height: '100%'}}>
        <MapContainer
          center={position}
          zoom={17}
          style={{
            height:"1000px",
            width:"1000px"
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          {telemetry && (
            <>
              <Marker position={position} icon={droneIcon}/>
              <MapUpdater position={position}/>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  )
}

export default App