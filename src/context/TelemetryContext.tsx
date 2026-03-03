import { createContext, useContext, type ReactNode } from 'react'
import { useTelemetry as useTelemetryHook } from '@/hooks/useTelemetry'
import type { ConnectionStatus, Telemetry } from '@/hooks/useTelemetry'

interface TelemetryContextValue {
  telemetry: Telemetry | null
  connectionStatus: ConnectionStatus
}

const TelemetryContext = createContext<TelemetryContextValue | null>(null)

export function TelemetryProvider({ children }: { children: ReactNode }) {
  const value = useTelemetryHook()
  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>
}

export function useTelemetry(): TelemetryContextValue {
  const ctx = useContext(TelemetryContext)
  if (!ctx) throw new Error('useTelemetry must be used within TelemetryProvider')
  return ctx
}
