import type { FC } from 'react'
import { useTelemetry } from '@/context/TelemetryContext'
import { useAppPhase } from '@/hooks/useAppPhase'
import { useLogStatusText } from '@/hooks/useLogStatusText'
import { TelemetryPanel } from '@/components/telemetry/TelemetryPanel'
import { IntroTransition } from '@/components/intro/IntroTransition'
import { Toaster } from '@/components/ui/Toaster'
import { MainView } from '@/components/MainView.tsx'

const App: FC = () => {
  const { connectionStatus } = useTelemetry()
  const { phase, beginTransition, onTransitionComplete } =
    useAppPhase(connectionStatus)
  const isViewExpanded = phase === 'transitioning' || phase === 'active'
  useLogStatusText(connectionStatus === 'connected')

  return (
    <div className="h-screen w-screen bg-(--color-background) p-1">
      <IntroTransition
        phase={phase}
        onBegin={beginTransition}
        onTransitionComplete={onTransitionComplete}
        content={<MainView />}
      >
        {isViewExpanded && <TelemetryPanel />}
      </IntroTransition>
      <Toaster />
    </div>
  )
}

export default App
