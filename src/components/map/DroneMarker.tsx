import { type FC, useRef, useLayoutEffect } from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { useMotionValue, useSpring } from 'motion/react'

const SPRING_CONFIG = { stiffness: 80, damping: 20 }

const createDroneIcon: (heading: number) => L.DivIcon = (heading) => {
  return L.divIcon({
    html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${heading + 45}deg)">
    <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" fill="#e54545" stroke="white" stroke-width="1"/>
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

export const DroneMarker: FC<DroneMarkerProps> = ({ position, heading }) => {
  const markerRef = useRef<L.Marker>(null)

  // Heading spring (same unwrapping logic as Compass)
  const unwrappedHeading = useRef(heading)
  const motionHeading = useMotionValue(heading)
  const springHeading = useSpring(motionHeading, SPRING_CONFIG)

  // Update heading with unwrapping to find shortest rotation path
  useLayoutEffect(() => {
    const current = ((unwrappedHeading.current % 360) + 360) % 360
    let delta = heading - current
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    unwrappedHeading.current += delta
    motionHeading.set(unwrappedHeading.current)
  }, [heading, motionHeading])

  // Apply spring rotation to the Leaflet marker's SVG
  useLayoutEffect(() => {
    return springHeading.on('change', (v) => {
      const el = markerRef.current?.getElement()
      const svg = el?.querySelector('svg')
      if (svg) {
        const h = ((v % 360) + 360) % 360
        svg.style.transform = `rotate(${h + 45}deg)`
      }
    })
  }, [springHeading])

  const icon = createDroneIcon(heading)

  return <Marker ref={markerRef} position={position} icon={icon} />
}
