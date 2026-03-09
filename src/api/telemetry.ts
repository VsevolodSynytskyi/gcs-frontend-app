const API_BASE =
  'http://localhost:8088/mavlink/vehicles/1/components/1/messages'

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting'

export type SystemStatus =
  | 'MAV_STATE_UNINIT'
  | 'MAV_STATE_BOOT'
  | 'MAV_STATE_CALIBRATING'
  | 'MAV_STATE_STANDBY'
  | 'MAV_STATE_ACTIVE'
  | 'MAV_STATE_CRITICAL'
  | 'MAV_STATE_EMERGENCY'
  | 'MAV_STATE_POWEROFF'

export interface Telemetry {
  position: { lat: number; lon: number; alt: number }
  heading: number
  groundSpeed: number
  verticalSpeed: number
  battery: number
  armed: boolean
  systemStatus: SystemStatus
  sensorsHealthy: boolean
}

const STALE_THRESHOLD_MS = 3000

/** Parse a pipe-separated MAVLink flag string into a Set. */
function parseFlags(flags: string): Set<string> {
  if (!flags) return new Set()
  return new Set(flags.split('|').map((f) => f.trim()))
}

/** GPS fix types that provide a position estimate (fix_type >= 3). */
const GPS_FIX_WITH_POSITION = new Set([
  'GPS_FIX_TYPE_3D_FIX',
  'GPS_FIX_TYPE_DGPS',
  'GPS_FIX_TYPE_RTK_FLOAT',
  'GPS_FIX_TYPE_RTK_FIXED',
  'GPS_FIX_TYPE_STATIC',
])

/** EKF flags that indicate the drone has a usable position estimate. */
const REQUIRED_EKF_FLAGS = [
  'EKF_ATTITUDE',
  'EKF_VELOCITY_HORIZ',
  'EKF_POS_HORIZ_ABS',
  'EKF_PRED_POS_HORIZ_ABS',
] as const

export async function fetchTelemetry(): Promise<Telemetry> {
  const [posRes, battRes, hbRes, gpsRes, ekfRes] = await Promise.all([
    fetch(`${API_BASE}/GLOBAL_POSITION_INT`),
    fetch(`${API_BASE}/SYS_STATUS`),
    fetch(`${API_BASE}/HEARTBEAT`),
    fetch(`${API_BASE}/GPS_RAW_INT`),
    fetch(`${API_BASE}/EKF_STATUS_REPORT`),
  ])

  const pos = await posRes.json()
  const batt = await battRes.json()
  const hb = await hbRes.json()
  const gps = await gpsRes.json()
  const ekf = await ekfRes.json()

  const lastHeartbeat = Date.parse(hb.status.time.last_update)
  if (Date.now() - lastHeartbeat > STALE_THRESHOLD_MS) {
    throw new Error('Telemetry data is stale')
  }

  // Check 1: All enabled sensors must be healthy
  const enabled = parseFlags(batt.message.onboard_control_sensors_enabled)
  const health = parseFlags(batt.message.onboard_control_sensors_health)
  const allSensorsHealthy =
    enabled.size > 0 && [...enabled].every((sensor) => health.has(sensor))

  // Check 2: GPS must have a 3D fix or better
  const gpsFixType: string = gps.message.fix_type?.type ?? ''
  const hasGpsFix = GPS_FIX_WITH_POSITION.has(gpsFixType)

  // Check 3: EKF must have converged with a position estimate
  const ekfFlags = parseFlags(ekf.message.flags ?? '')
  const ekfReady = REQUIRED_EKF_FLAGS.every((flag) => ekfFlags.has(flag))

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
    systemStatus: hb.message.system_status.type as SystemStatus,
    sensorsHealthy: allSensorsHealthy && hasGpsFix && ekfReady,
  }
}
