import { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'

export function VideoReceiver() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [remotePeerId, setRemotePeerId] = useState('')
  const [status, setStatus] = useState('Ready')
  const peerRef = useRef<Peer | null>(null)

  useEffect(() => {
    const peer = new Peer()
    peerRef.current = peer

    peer.on('open', () => {
      setStatus('Ready to connect')
    })

    peer.on('error', (err) => {
      setStatus(`Error: ${err.message}`)
    })

    return () => peer.destroy()
  }, [])

  const connect = () => {
    if (!peerRef.current || !remotePeerId) return

    setStatus('Connecting...')

    // Request a dummy stream to initiate the call
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((localStream) => {
        const call = peerRef.current!.call(remotePeerId, localStream)

        call.on('stream', (remoteStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = remoteStream
          }
          setStatus('Receiving video!')
          // Stop local stream since we don't need it
          localStream.getTracks().forEach((track) => track.stop())
        })

        call.on('error', (err) => {
          setStatus(`Call error: ${err}`)
        })
      })
      .catch((err) => {
        setStatus(`Media error: ${err.message}`)
      })
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Video Receiver (GCS)</h2>
      <p>Status: {status}</p>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Enter sender Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          style={{ padding: 8, width: 300, marginRight: 10 }}
        />
        <button onClick={connect} style={{ padding: 8 }}>
          Connect
        </button>
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: 640, background: '#000' }}
      />
    </div>
  )
}
