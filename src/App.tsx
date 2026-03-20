import { type FC, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useTelemetry } from '@/context/TelemetryContext'
import { useAppPhase } from '@/hooks/useAppPhase'
import { useLogStatusText } from '@/hooks/useLogStatusText'
import { TelemetryPanel } from '@/components/telemetry/TelemetryPanel'
import { IntroTransition } from '@/components/intro/IntroTransition'
import { Toaster } from '@/components/ui/Toaster'
import { MainView } from '@/components/MainView.tsx'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'

const App: FC = () => {
  const { connectionStatus } = useTelemetry()
  const { phase, beginTransition, onTransitionComplete } =
    useAppPhase(connectionStatus)
  const isViewExpanded = phase === 'transitioning' || phase === 'active'
  const [telemetryVisible, setTelemetryVisible] = useState(true)
  useLogStatusText(connectionStatus === 'connected')

  return (
    <div className="h-screen w-screen bg-(--color-background) p-1">
      <IntroTransition
        phase={phase}
        onBegin={beginTransition}
        onTransitionComplete={onTransitionComplete}
        content={<MainView />}
      >
        {isViewExpanded && (
          <>
            <div className="absolute top-4 left-4 z-1000">
              <GlassCard className="p-1">
                <Tooltip
                  content={
                    telemetryVisible
                      ? 'Hide telemetry'
                      : 'Show telemetry'
                  }
                  side="right"
                >
                  <Button
                    size="icon"
                    onClick={() =>
                      setTelemetryVisible((v) => !v)
                    }
                  >
                    {telemetryVisible ? (
                      <PanelLeftClose size={18} />
                    ) : (
                      <PanelLeftOpen size={18} />
                    )}
                  </Button>
                </Tooltip>
              </GlassCard>
            </div>
            <AnimatePresence>
              {telemetryVisible && <TelemetryPanel />}
            </AnimatePresence>
          </>
        )}
      </IntroTransition>
      <Toaster />
    </div>
  )
}

export default App
