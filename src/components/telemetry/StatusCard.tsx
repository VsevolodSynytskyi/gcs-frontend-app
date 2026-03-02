import { Badge, Button, Flex, Separator, Text } from '@radix-ui/themes'
import { motion, AnimatePresence } from 'motion/react'
import { GlassCard } from '../ui/GlassCard'
import type { ConnectionStatus } from '../../hooks/useTelemetry'

interface StatusCardProps {
  connectionStatus: ConnectionStatus
  armed: boolean
  onArm: () => void
  onDisarm: () => void
}

const connectionColor: Record<ConnectionStatus, 'green' | 'red' | 'yellow'> = {
  connected: 'green',
  disconnected: 'red',
  reconnecting: 'yellow',
}

const connectionLabel: Record<ConnectionStatus, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  reconnecting: 'Reconnecting',
}

export function StatusCard({ connectionStatus, armed, onArm, onDisarm }: StatusCardProps) {
  return (
    <GlassCard>
      <Flex direction="column" gap="3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text size="1" color="gray" className="uppercase tracking-wider block mb-1">Connection</Text>
            <AnimatePresence mode="wait">
              <motion.div
                key={connectionStatus}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Badge color={connectionColor[connectionStatus]} variant="soft">
                  {connectionStatus === 'reconnecting' && (
                    <motion.span
                      className="inline-block size-1.5 rounded-full bg-(--yellow-9) mr-1"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                  {connectionLabel[connectionStatus]}
                </Badge>
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <Text size="1" color="gray" className="uppercase tracking-wider block mb-1">Status</Text>
            <Badge color={armed ? 'red' : 'gray'} variant="soft">
              {armed ? 'Armed' : 'Disarmed'}
            </Badge>
          </div>
        </div>

        <Separator size="4" />

        <div className="grid grid-cols-2 gap-2">
          <Button
            size="2"
            variant="solid"
            color="red"
            className="w-full cursor-pointer"
            onClick={onArm}
          >
            Arm
          </Button>
          <Button
            size="2"
            variant="outline"
            color="gray"
            className="w-full cursor-pointer"
            onClick={onDisarm}
          >
            Disarm
          </Button>
        </div>
      </Flex>
    </GlassCard>
  )
}
