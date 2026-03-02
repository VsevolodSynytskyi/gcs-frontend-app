import { Badge, Button, Flex } from '@radix-ui/themes'
import { motion, AnimatePresence } from 'motion/react'
import type { AppPhase } from '../../hooks/useAppPhase'

interface IntroCardProps {
  phase: AppPhase
  onBegin: () => void
}

export function IntroCard({ phase, onBegin }: IntroCardProps) {
  const connected = phase === 'ready'

  return (
    <Flex direction="column" align="stretch" gap="4" className="p-6 w-full">
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
              color={connected ? 'green' : 'yellow'}
              variant="soft"
              size="2"
            >
              {connected ? 'Connected' : 'Waiting for connection'}
            </Badge>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        size="3"
        color="green"
        className="w-full cursor-pointer"
        // TODO: revert to disabled={!connected}
        disabled={false}
        onClick={onBegin}
      >
        Begin
      </Button>
    </Flex>
  )
}
