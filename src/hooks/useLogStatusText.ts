import { useEffect, useRef } from 'react'
import { addToast, type ToastVariant } from '@/components/ui/Toaster'

const WS_URL = 'ws://localhost:8088/ws/mavlink?filter=STATUSTEXT|COMMAND_ACK'
const MAX_RECONNECT_DELAY = 16000

const SEVERITY_LABELS = [
  'EMERGENCY',
  'ALERT',
  'CRITICAL',
  'ERROR',
  'WARNING',
  'NOTICE',
  'INFO',
  'DEBUG',
] as const

const COMMAND_NAMES: Record<number, string> = {
  176: 'DO_SET_MODE',
  400: 'COMPONENT_ARM_DISARM',
  22: 'NAV_TAKEOFF',
  21: 'NAV_LAND',
  192: 'DO_REPOSITION',
}

const ACK_RESULTS: Record<number, string> = {
  0: 'ACCEPTED',
  1: 'TEMPORARILY_REJECTED',
  2: 'DENIED',
  3: 'UNSUPPORTED',
  4: 'FAILED',
  5: 'IN_PROGRESS',
  6: 'CANCELLED',
}

function severityVariant(severity: number): ToastVariant {
  if (severity <= 3) return 'error'
  if (severity === 4) return 'warning'
  if (severity === 6) return 'info'
  return 'default'
}

function logStatusText(severity: number, text: string) {
  const label = SEVERITY_LABELS[severity] ?? 'UNKNOWN'
  const formatted = `[${label}] ${text}`

  addToast(formatted, severityVariant(severity))

  switch (true) {
    case severity <= 3:
      console.error(formatted)
      break
    case severity === 4:
      console.warn(formatted)
      break
    case severity <= 6:
      console.log(formatted)
      break
    default:
      console.debug(formatted)
  }
}

const KNOWN_COMMANDS = new Set(Object.keys(COMMAND_NAMES).map(Number))
const KNOWN_COMMAND_TYPES = new Set(
  Object.values(COMMAND_NAMES).map((n) => `MAV_CMD_${n}`),
)

function logCommandAck(msg: Record<string, unknown>): boolean {
  const cmdId = (msg.command as { type: string })?.type ?? msg.command

  // Only show ACKs for commands our app sends
  if (typeof cmdId === 'number' && !KNOWN_COMMANDS.has(cmdId)) return false
  if (typeof cmdId === 'string' && !KNOWN_COMMAND_TYPES.has(cmdId)) return false

  const resultId = (msg.result as { type: string })?.type ?? msg.result

  let cmdName: string
  if (typeof cmdId === 'number') {
    cmdName = COMMAND_NAMES[cmdId] ?? `CMD_${cmdId}`
  } else if (typeof cmdId === 'string') {
    cmdName = cmdId.replace('MAV_CMD_', '')
  } else {
    cmdName = String(cmdId)
  }

  let resultName: string
  if (typeof resultId === 'number') {
    resultName = ACK_RESULTS[resultId] ?? `RESULT_${resultId}`
  } else if (typeof resultId === 'string') {
    resultName = resultId.replace('MAV_RESULT_', '')
  } else {
    resultName = String(resultId)
  }

  const formatted = `[COMMAND_ACK] ${cmdName}: ${resultName}`
  const isOk = resultName === 'ACCEPTED' || resultName === 'IN_PROGRESS'

  addToast(formatted, isOk ? 'default' : 'warning')

  if (isOk) {
    console.log(formatted)
  } else {
    console.warn(formatted)
  }

  return true
}

function parseSeverity(raw: unknown): number {
  if (typeof raw === 'number') return raw

  if (typeof raw === 'object' && raw !== null && 'type' in raw) {
    const type = (raw as { type: string }).type
    const match = type.match(/MAV_SEVERITY_(\w+)/)
    if (match) {
      const idx = SEVERITY_LABELS.indexOf(
        match[1] as (typeof SEVERITY_LABELS)[number],
      )
      if (idx !== -1) return idx
    }
  }

  return 6 // default to INFO
}

const DEDUP_WINDOW_MS = 500

export function useLogStatusText(enabled: boolean) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const reconnectAttempt = useRef(0)
  const recentMessages = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    if (!enabled) {
      wsRef.current?.close()
      wsRef.current = null
      clearTimeout(reconnectTimer.current)
      return
    }

    let disposed = false

    function isDuplicate(key: string): boolean {
      const now = Date.now()
      const last = recentMessages.current.get(key)
      if (last && now - last < DEDUP_WINDOW_MS) return true
      recentMessages.current.set(key, now)
      return false
    }

    function connect() {
      if (disposed) return
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        reconnectAttempt.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const msg = data?.message
          if (!msg) return

          switch (msg.type) {
            case 'STATUSTEXT': {
              const severity = parseSeverity(msg.severity)
              const text = (msg.text ?? '').replace(/\0/g, '').trim()
              if (text && !isDuplicate(`ST:${severity}:${text}`))
                logStatusText(severity, text)
              break
            }
            case 'COMMAND_ACK': {
              const key = `ACK:${msg.command?.type ?? msg.command}:${msg.result?.type ?? msg.result}`
              if (!isDuplicate(key)) logCommandAck(msg)
              break
            }
          }
        } catch {
          // ignore malformed messages
        }
      }

      ws.onclose = () => {
        if (!disposed) scheduleReconnect()
      }

      ws.onerror = () => {
        ws.close()
      }
    }

    function scheduleReconnect() {
      const delay = Math.min(
        1000 * 2 ** reconnectAttempt.current,
        MAX_RECONNECT_DELAY,
      )
      reconnectAttempt.current += 1
      reconnectTimer.current = setTimeout(connect, delay)
    }

    connect()

    return () => {
      disposed = true
      clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [enabled])
}
