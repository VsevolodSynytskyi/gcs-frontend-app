import { useState, useEffect, useCallback } from 'react'
import type { ConnectionStatus } from './useTelemetry'

export type AppPhase = 'idle' | 'ready' | 'transitioning' | 'active'

export function useAppPhase(connectionStatus: ConnectionStatus) {
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
    // TODO: revert to phase === 'ready' only
    if (phase === 'ready' || phase === 'idle') setPhase('transitioning')
  }, [phase])

  const onTransitionComplete = useCallback(() => {
    if (phase === 'transitioning') setPhase('active')
  }, [phase])

  return { phase, beginTransition, onTransitionComplete }
}
