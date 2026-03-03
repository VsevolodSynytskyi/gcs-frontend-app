import { useTelemetry } from '@/context/TelemetryContext'
import { useAppPhase } from '@/hooks/useAppPhase'
import { MapView } from '@/components/map/MapView'
import { LayerSwitcher } from '@/components/map/LayerSwitcher'
import { TelemetryPanel } from '@/components/telemetry/TelemetryPanel'
import { IntroTransition } from '@/components/intro/IntroTransition'

function App() {
  const { connectionStatus } = useTelemetry()
  const { phase, beginTransition, onTransitionComplete } = useAppPhase(connectionStatus)
  const isViewExpanded = phase === 'transitioning' || phase === 'active'

  return (
    <div className="h-screen w-screen bg-(--color-background) p-1">
      <IntroTransition
        phase={phase}
        onBegin={beginTransition}
        onTransitionComplete={onTransitionComplete}
        map={<MapView />}
      >
        {isViewExpanded && (
          <>
            <LayerSwitcher />
            <TelemetryPanel />
          </>
        )}
      </IntroTransition>
    </div>
  )
}

export default App
