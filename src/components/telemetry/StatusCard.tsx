import {AnimatePresence, motion} from 'motion/react'
import {Badge, type badgeVariants} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {GlassCard} from '@/components/ui/GlassCard'
import {type ConnectionStatus, useTelemetry} from '@/hooks/useTelemetry'
import {armAndTakeoff} from "@/api/droneControl.ts"
import type { VariantProps } from 'class-variance-authority'

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

const connectionBadge: Record<ConnectionStatus, { variant: BadgeVariant; label: string }> = {
  connected: { variant: 'default', label: 'Connected' },
  disconnected: { variant: 'destructive', label: 'Disconnected' },
  reconnecting: { variant: 'secondary', label: 'Reconnecting' },
}

export function StatusCard() {
  const {telemetry, connectionStatus} = useTelemetry()
  const armed = telemetry?.armed ?? false
  const connected = connectionStatus === 'connected'
  const onTakeOffClick = async () => {
    await armAndTakeoff()
  }
  const onLandClick = async () => {
    console.log("land") // TODO
  }

  return (
    <GlassCard>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Connection</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={connectionStatus}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.15}}
              >
                <Badge variant={connectionBadge[connectionStatus].variant}>
                  {connectionStatus === 'reconnecting' && (
                    <motion.span
                      className="inline-block size-1.5 rounded-full bg-current mr-1"
                      animate={{opacity: [1, 0.3, 1]}}
                      transition={{repeat: Infinity, duration: 1.5}}
                    />
                  )}
                  {connectionBadge[connectionStatus].label}
                </Badge>
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Status</span>
            <Badge variant={armed ? 'default' : 'destructive'}>
              {armed ? 'Armed' : 'Disarmed'}
            </Badge>
          </div>
        </div>

        <Separator/>

        <div className="grid grid-cols-2 gap-2">
          <Button
            className="w-full"
            disabled={!connected || armed}
            onClick={onTakeOffClick}
          >
            Take off
          </Button>
          <Button
            className="w-full"
            disabled={!connected || !armed}
            onClick={onLandClick}
          >
            Land
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
