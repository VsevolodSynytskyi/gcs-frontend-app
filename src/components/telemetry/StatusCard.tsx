import { motion, AnimatePresence } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { GlassCard } from '@/components/ui/GlassCard'
import type { ConnectionStatus } from '@/hooks/useTelemetry'

interface StatusCardProps {
  connectionStatus: ConnectionStatus
  armed: boolean
  onArm: () => void
  onDisarm: () => void
}

const connectionBadgeStyle: Record<ConnectionStatus, string> = {
  connected: 'bg-green-500/15 text-green-500 border-green-500/25',
  disconnected: 'bg-red-500/15 text-red-500 border-red-500/25',
  reconnecting: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/25',
}

const connectionLabel: Record<ConnectionStatus, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  reconnecting: 'Reconnecting',
}

export function StatusCard({ connectionStatus, armed, onArm, onDisarm }: StatusCardProps) {
  const connected = connectionStatus === 'connected'
  return (
    <GlassCard>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Connection</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={connectionStatus}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Badge variant="outline" className={connectionBadgeStyle[connectionStatus]}>
                  {connectionStatus === 'reconnecting' && (
                    <motion.span
                      className="inline-block size-1.5 rounded-full bg-yellow-500 mr-1"
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
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Status</span>
            <Badge
              variant="outline"
              className={armed ? 'bg-green-500/15 text-green-500 border-green-500/25' : 'bg-red-500/15 text-red-500 border-red-500/25'}
            >
              {armed ? 'Armed' : 'Disarmed'}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Button
            size="default"
            className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white"
            disabled={!connected || armed}
            onClick={onArm}
          >
            Arm
          </Button>
          <Button
            variant="destructive"
            size="default"
            className="w-full cursor-pointer"
            disabled={!connected || !armed}
            onClick={onDisarm}
          >
            Disarm
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
