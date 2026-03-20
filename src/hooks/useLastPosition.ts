import { useRef } from 'react'
import type { Telemetry } from '@/api/telemetry'

export const useLastPosition: (
  telemetry: Telemetry | null,
) => [number, number] = (telemetry) => {
  const ref = useRef<[number, number]>([0, 0])
  if (telemetry) ref.current = [telemetry.position.lat, telemetry.position.lon]
  return ref.current
}
