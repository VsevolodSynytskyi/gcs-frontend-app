import { createContext, type FC, type ReactNode, useContext } from 'react'
import type { ConnectionStatus, Telemetry } from '@/hooks/useTelemetry'
import { useTelemetry as useTelemetryHook } from '@/hooks/useTelemetry'

interface TelemetryContextValue {
  telemetry: Telemetry | null
  connectionStatus: ConnectionStatus
}

const TelemetryContext = createContext<TelemetryContextValue | null>(null)

export const TelemetryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const value = useTelemetryHook()
  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  )
}

export const useTelemetry: () => TelemetryContextValue = () => {
  const ctx = useContext(TelemetryContext)
  if (!ctx)
    throw new Error('useTelemetry must be used within TelemetryProvider')
  return ctx
}
