import { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'

export const useVideoReceiver: () => {
  status: 'initializing' | 'ready' | 'connecting' | 'streaming'
  remoteStream: MediaStream | null
  connect: (remotePeerId: string) => Promise<void>
  disconnect: () => void
} = () => {
  const peerRef = useRef<Peer | null>(null)
  const [status, setStatus] = useState<
    'initializing' | 'ready' | 'connecting' | 'streaming'
  >('initializing')
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    const peer = new Peer()
    peerRef.current = peer

    peer.on('open', () => setStatus('ready'))
    peer.on('error', (err) => console.error('Peer error:', err))

    return () => peer.destroy()
  }, [])

  const connect = async (remotePeerId: string) => {
    if (!peerRef.current) return

    setStatus('connecting')

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
    const call = peerRef.current.call(remotePeerId, localStream)

    call.on('stream', (stream) => {
      setRemoteStream(stream)
      setStatus('streaming')
      localStream.getTracks().forEach((track) => track.stop())
    })
  }

  const disconnect = () => {
    remoteStream?.getTracks().forEach((track) => track.stop())
    setRemoteStream(null)
    setStatus('ready')
  }

  return { status, remoteStream, connect, disconnect }
}
