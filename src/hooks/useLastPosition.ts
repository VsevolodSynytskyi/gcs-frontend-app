import { useRef } from 'react'
import type { Telemetry } from './useTelemetry'

export function useLastPosition(telemetry: Telemetry | null): [number, number] {
  const ref = useRef<[number, number]>([0, 0])
  if (telemetry) ref.current = [telemetry.lat, telemetry.lon]
  return ref.current
}
