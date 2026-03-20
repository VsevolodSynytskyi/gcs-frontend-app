import { useState, useEffect, useCallback } from 'react'
import type { ConnectionStatus } from './useTelemetry'

export type AppPhase = 'idle' | 'ready' | 'transitioning' | 'active'

export const useAppPhase: (connectionStatus: ConnectionStatus) => {
  phase: AppPhase
  beginTransition: () => void
  onTransitionComplete: () => void
} = (connectionStatus) => {
  const [phase, setPhase] = useState<AppPhase>('idle')

  useEffect(() => {
    if (phase === 'idle' && connectionStatus === 'connected') {
      setPhase('ready')
    }
    if (phase === 'ready' && connectionStatus !== 'connected') {
      setPhase('idle')
    }
  }, [phase, connectionStatus])

  const beginTransition = useCallback(() => {
    if (phase === 'ready') setPhase('transitioning')
  }, [phase])

  const onTransitionComplete = useCallback(() => {
    if (phase === 'transitioning') setPhase('active')
  }, [phase])

  return { phase, beginTransition, onTransitionComplete }
}
