import { useRef, useSyncExternalStore } from 'react'
import { telemetryStore, type TelemetrySnapshot } from '@/stores/telemetryStore'

const shallowEqual: (a: unknown, b: unknown) => boolean = (a, b) => {
  if (Object.is(a, b)) return true
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  )
    return false
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !Object.is(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      )
    )
      return false
  }
  return true
}

export const useTelemetrySelector: <T>(
  selector: (snapshot: TelemetrySnapshot) => T,
) => T = (selector) => {
  const prev = useRef(selector(telemetryStore.getSnapshot()))

  return useSyncExternalStore(telemetryStore.subscribe, () => {
    const next = selector(telemetryStore.getSnapshot())
    if (shallowEqual(prev.current, next)) return prev.current
    prev.current = next
    return next
  })
}
