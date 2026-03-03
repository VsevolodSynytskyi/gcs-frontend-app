import { AnimatePresence, motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/GlassCard'
import type { AppPhase } from '@/hooks/useAppPhase'

interface IntroCardProps {
  phase: AppPhase
  onBegin: () => void
}

export function IntroCard({ phase, onBegin }: IntroCardProps) {
  const connected = phase === 'ready'

  return (
    <GlassCard className="flex w-full flex-col items-stretch gap-4 p-6">
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={connected ? 'connected' : 'waiting'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Badge variant={connected ? 'default' : 'secondary'}>
              {connected ? 'Connected' : 'Waiting for connection'}
            </Badge>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button className="w-full" disabled={!connected} onClick={onBegin}>
        Begin
      </Button>
    </GlassCard>
  )
}
