import {
  fetchTelemetry,
  requestDataStreams,
  type ConnectionStatus,
  type Telemetry,
} from '@/api/telemetry'

const POLL_INTERVAL = 100
const RECONNECT_THRESHOLD = 5

export interface TelemetrySnapshot {
  telemetry: Telemetry | null
  connectionStatus: ConnectionStatus
}

type Listener = () => void

const createTelemetryStore: () => {
  subscribe: (listener: Listener) => () => void
  getSnapshot: () => TelemetrySnapshot
  start: () => void
  stop: () => void
} = () => {
  let snapshot: TelemetrySnapshot = {
    telemetry: null,
    connectionStatus: 'disconnected',
  }
  const listeners = new Set<Listener>()
  let intervalId: ReturnType<typeof setInterval> | null = null
  let consecutiveErrors = 0
  let wasConnected = false

  const emit: () => void = () => {
    listeners.forEach((l) => l())
  }

  const poll: () => Promise<void> = async () => {
    try {
      const telemetry = await fetchTelemetry()
      consecutiveErrors = 0
      wasConnected = true
      snapshot = { telemetry, connectionStatus: 'connected' }
      emit()
    } catch (e) {
      console.error(e)
      consecutiveErrors += 1

      if (wasConnected && consecutiveErrors < RECONNECT_THRESHOLD) {
        snapshot = { ...snapshot, connectionStatus: 'reconnecting' }
      } else {
        snapshot = { telemetry: null, connectionStatus: 'disconnected' }
      }
      emit()
    }
  }

  return {
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => snapshot,
    start: () => {
      if (intervalId) return
      requestDataStreams().catch(() => {})
      intervalId = setInterval(poll, POLL_INTERVAL)
    },
    stop: () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    },
  }
}

export const telemetryStore = createTelemetryStore()
