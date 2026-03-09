import { useEffect, useRef, useState } from 'react'
import {
  fetchTelemetry,
  type ConnectionStatus,
  type Telemetry,
} from '@/api/telemetry'

export type { ConnectionStatus, Telemetry } from '@/api/telemetry'

const POLL_INTERVAL = 100
const RECONNECT_THRESHOLD = 5

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null)
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected')
  const consecutiveErrors = useRef(0)
  const wasConnected = useRef(false)

  useEffect(() => {
    const poll = async () => {
      try {
        setTelemetry(await fetchTelemetry())
        consecutiveErrors.current = 0
        wasConnected.current = true
        setConnectionStatus('connected')
      } catch (e) {
        console.error(e)
        consecutiveErrors.current += 1

        if (
          wasConnected.current &&
          consecutiveErrors.current < RECONNECT_THRESHOLD
        ) {
          setConnectionStatus('reconnecting')
        } else {
          setTelemetry(null)
          setConnectionStatus('disconnected')
        }
      }
    }

    const interval = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return { telemetry, connectionStatus }
}
