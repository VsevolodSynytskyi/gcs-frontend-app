const API_BASE = 'http://localhost:8088/mavlink/vehicles/1/components/1/messages'

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting'

export interface Telemetry {
  lat: number
  lon: number
  alt: number
  heading: number
  groundSpeed: number
  verticalSpeed: number
  battery: number
  armed: boolean
}

export async function fetchTelemetry(): Promise<Telemetry> {
  const [posRes, battRes, hbRes] = await Promise.all([
    fetch(`${API_BASE}/GLOBAL_POSITION_INT`),
    fetch(`${API_BASE}/SYS_STATUS`),
    fetch(`${API_BASE}/HEARTBEAT`),
  ])

  const pos = await posRes.json()
  const batt = await battRes.json()
  const hb = await hbRes.json()

  return {
    lat: pos.message.lat / 1e7,
    lon: pos.message.lon / 1e7,
    alt: pos.message.alt / 1000,
    heading: pos.message.hdg / 100,
    groundSpeed: Math.sqrt(
      Math.pow(pos.message.vx / 100, 2) + Math.pow(pos.message.vy / 100, 2),
    ),
    verticalSpeed: -(pos.message.vz / 100),
    battery: batt.message.battery_remaining,
    armed: (hb.message.base_mode & 128) !== 0,
  }
}
