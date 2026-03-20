import { useCallback, useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'

// initializing — PeerJS is setting up, not ready yet
// ready       — PeerJS connected to signaling server, can now call peers
// connecting  — call initiated, waiting for remote peer to respond
// streaming   — connection established, video is flowing
type VideoReceiverStatus = 'initializing' | 'ready' | 'connecting' | 'streaming'

export const useVideoReceiver: () => {
  status: VideoReceiverStatus
  remoteStream: MediaStream | null
  connect: (remotePeerId: string) => Promise<void>
  disconnect: () => void
} = () => {
  const peerRef = useRef<Peer | null>(null)
  const [status, setStatus] = useState<VideoReceiverStatus>('initializing')
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  // Create a PeerJS instance on mount.
  // Once connected to the signaling server, 'open' fires → status = ready.
  // Destroy the peer on unmount to clean up.
  useEffect(() => {
    const peer = new Peer()
    peerRef.current = peer

    peer.on('open', () => setStatus('ready'))
    peer.on('error', (err) => console.error('Peer error:', err))

    return () => peer.destroy()
  }, [])

  // Get a local camera stream (WebRTC requires both sides to offer media),
  // call the remote peer, and listen for the incoming stream.
  // Once the remote stream arrives, save it and stop the local stream
  // since we only needed it to initiate the connection.
  const connect = useCallback(async (remotePeerId: string) => {
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
  }, [])

  // Stop all tracks on the remote stream, clear it, and reset to ready.
  const disconnect = useCallback(() => {
    setRemoteStream((prev) => {
      prev?.getTracks().forEach((track) => track.stop())
      return null
    })
    setStatus('ready')
  }, [])

  return { status, remoteStream, connect, disconnect }
}
