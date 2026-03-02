import { useMemo } from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'

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

interface DroneMarkerProps {
  position: [number, number]
  heading: number
}

export function DroneMarker({ position, heading }: DroneMarkerProps) {
  const icon = useMemo(() => createDroneIcon(heading), [heading])
  return <Marker position={position} icon={icon} />
}
