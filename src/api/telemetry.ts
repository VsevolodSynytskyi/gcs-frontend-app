const API_BASE =
  'http://localhost:8088/mavlink/vehicles/1/components/1/messages'

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting'

export interface Telemetry {
  position: { lat: number; lon: number; alt: number }
  heading: number
  groundSpeed: number
  verticalSpeed: number
  battery: number
  armed: boolean
}

const STALE_THRESHOLD_MS = 3000

export async function fetchTelemetry(): Promise<Telemetry> {
  const [posRes, battRes, hbRes] = await Promise.all([
    fetch(`${API_BASE}/GLOBAL_POSITION_INT`),
    fetch(`${API_BASE}/SYS_STATUS`),
    fetch(`${API_BASE}/HEARTBEAT`),
  ])

  const pos = await posRes.json()
  const batt = await battRes.json()
  const hb = await hbRes.json()

  const lastHeartbeat = Date.parse(hb.status.time.last_update)
  if (Date.now() - lastHeartbeat > STALE_THRESHOLD_MS) {
    throw new Error('Telemetry data is stale')
  }

  return {
    position: {
      lat: pos.message.lat / 1e7,
      lon: pos.message.lon / 1e7,
      alt: pos.message.relative_alt / 1000,
    },
    heading: pos.message.hdg / 100,
    groundSpeed: Math.sqrt(
      Math.pow(pos.message.vx / 100, 2) + Math.pow(pos.message.vy / 100, 2),
    ),
    verticalSpeed: -(pos.message.vz / 100),
    battery: batt.message.battery_remaining,
    armed: String(hb.message.base_mode).includes('MAV_MODE_FLAG_SAFETY_ARMED'),
  }
}
