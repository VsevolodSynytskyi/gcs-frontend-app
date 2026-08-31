import { type FC, useEffect, useRef } from 'react'
import { useVideoReceiver } from '@/hooks/useVideoReceiver.ts'
import { Badge } from '@/components/ui/badge'
import useVideoSender from '@/hooks/useVideoSender.ts'
import { motion } from 'motion/react'

export const DroneVideo: FC = () => {
  const { connect, status, remoteStream } = useVideoReceiver()
  const { peerId } = useVideoSender()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  useEffect(() => {
    console.log('running useEffect')
    if (peerId) {
      connect(peerId)
    }
  }, [connect, peerId])

  return (
    <div className="relative h-full w-full">
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 z-0 m-auto h-min w-min`}
      >
        <Badge>{status}</Badge>
      </div>
      <motion.video
        animate={{ opacity: status === 'streaming' ? 1 : 0 }}
        className="relative z-10 h-full w-full object-cover"
        ref={videoRef}
        autoPlay
        playsInline
        width={640}
        height={480}
      />
    </div>
  )
}
