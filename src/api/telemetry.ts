const MAVLINK_BASE = 'http://localhost:8088/mavlink'
const API_BASE = `${MAVLINK_BASE}/vehicles/1/components/1/messages`

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

/** MAV_MODE_FLAG bitmask for armed state. */
const MAV_MODE_FLAG_SAFETY_ARMED = 0x80

/** GPS fix types that provide a position estimate (fix_type >= 3). */
const GPS_FIX_WITH_POSITION = new Set([
  'GPS_FIX_TYPE_3D_FIX',
  'GPS_FIX_TYPE_DGPS',
  'GPS_FIX_TYPE_RTK_FLOAT',
  'GPS_FIX_TYPE_RTK_FIXED',
  'GPS_FIX_TYPE_STATIC',
])

/** EKF status flag bits. */
const EKF_ATTITUDE = 1
const EKF_VELOCITY_HORIZ = 2
const EKF_POS_HORIZ_ABS = 8
const EKF_PRED_POS_HORIZ_ABS = 256
const REQUIRED_EKF_BITS =
  EKF_ATTITUDE | EKF_VELOCITY_HORIZ | EKF_POS_HORIZ_ABS | EKF_PRED_POS_HORIZ_ABS

export const requestDataStreams: () => Promise<void> = async () => {
  await fetch(MAVLINK_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      header: { system_id: 255, component_id: 0, sequence: 0 },
      message: {
        type: 'REQUEST_DATA_STREAM',
        target_system: 1,
        target_component: 1,
        req_stream_id: 0,
        req_message_rate: 4,
        start_stop: 1,
      },
    }),
  })
}

export const fetchTelemetry: () => Promise<Telemetry> = async () => {
  const [posRes, battRes, hbRes, gpsRes, ekfRes] = await Promise.all([
    fetch(`${API_BASE}/GLOBAL_POSITION_INT`),
    fetch(`${API_BASE}/SYS_STATUS`),
    fetch(`${API_BASE}/HEARTBEAT`),
    fetch(`${API_BASE}/GPS_RAW_INT`),
    fetch(`${API_BASE}/EKF_STATUS_REPORT`),
  ])

  const parseRes = async (res: Response) => {
    const text = await res.text()
    if (text === 'None' || !text) {
      throw new Error('Telemetry not yet available')
    }
    return JSON.parse(text)
  }

  const pos = await parseRes(posRes)
  const batt = await parseRes(battRes)
  const hb = await parseRes(hbRes)
  const gps = await parseRes(gpsRes)
  const ekf = await parseRes(ekfRes)

  const lastHeartbeat = Date.parse(hb.status.time.last_update)
  if (Date.now() - lastHeartbeat > STALE_THRESHOLD_MS) {
    throw new Error('Telemetry data is stale')
  }

  // Check 1: All enabled sensors must be healthy
  const enabledBits: number = batt.message.onboard_control_sensors_enabled.bits
  const healthBits: number = batt.message.onboard_control_sensors_health.bits
  const allSensorsHealthy =
    enabledBits > 0 && (enabledBits & healthBits) === enabledBits

  // Check 2: GPS must have a 3D fix or better
  const gpsFixType: string = gps.message.fix_type?.type ?? ''
  const hasGpsFix = GPS_FIX_WITH_POSITION.has(gpsFixType)

  // Check 3: EKF must have converged with a position estimate
  const ekfBits: number = ekf.message.flags?.bits ?? 0
  const ekfReady = (ekfBits & REQUIRED_EKF_BITS) === REQUIRED_EKF_BITS

  const baseModeBits: number = hb.message.base_mode.bits

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
    armed: (baseModeBits & MAV_MODE_FLAG_SAFETY_ARMED) !== 0,
    systemStatus: hb.message.system_status.type as SystemStatus,
    sensorsHealthy: allSensorsHealthy && hasGpsFix && ekfReady,
  }
}
