import { useEffect, useState } from 'react'
import Peer from 'peerjs'

type VideoSenderStatus =
  | 'initializing'
  | 'waiting'
  | 'starting'
  | 'streaming'
  | 'error'

const useVideoSender: () => {
  status: VideoSenderStatus
  peerId: string | null
} = () => {
  const [peerId, setPeerId] = useState<string | null>(null)
  const [status, setStatus] = useState<VideoSenderStatus>('initializing')

  useEffect(() => {
    const peer = new Peer()

    peer.on(`open`, () => {
      setPeerId(peer.id)
      setStatus('waiting')
    })

    peer.on(`call`, async (call) => {
      setStatus('starting')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 640,
        },
        audio: false,
      })

      call.answer(stream)
      setStatus(`streaming`)
    })

    peer.on(`error`, (err) => {
      setStatus('error')
      console.error(`Peer error: ${err.message}`)
    })
  }, [])

  return {
    status: status,
    peerId,
  }
}

export default useVideoSender
