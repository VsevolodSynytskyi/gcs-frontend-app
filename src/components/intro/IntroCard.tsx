import { motion, AnimatePresence } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AppPhase } from '@/hooks/useAppPhase'

interface IntroCardProps {
  phase: AppPhase
  onBegin: () => void
}

const badgeStyles: Record<string, string> = {
  green: 'bg-green-500/15 text-green-500 border-green-500/25',
  yellow: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/25',
}

export function IntroCard({ phase, onBegin }: IntroCardProps) {
  const connected = phase === 'ready'

  return (
    <div className="flex flex-col items-stretch gap-4 p-6 w-full">
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={connected ? 'connected' : 'waiting'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant="outline"
              className={connected ? badgeStyles.green : badgeStyles.yellow}
            >
              {connected ? 'Connected' : 'Waiting for connection'}
            </Badge>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        size="lg"
        className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white"
        disabled={!connected}
        onClick={onBegin}
      >
        Begin
      </Button>
    </div>
  )
}
