import { addToast } from '@/components/ui/Toaster'

const COMMAND_URL = 'http://localhost:8088/v1/mavlink'

const sendCommand: (
  command: string,
  params?: number[],
) => Promise<void> = async (command, params = []) => {
  const message = {
    header: {
      system_id: 255,
      component_id: 240,
      sequence: 0,
    },
    message: {
      type: 'COMMAND_LONG',
      target_system: 1,
      target_component: 1,
      command: { type: command },
      confirmation: 1,
      param1: params[0] ?? 0.0,
      param2: params[1] ?? 0.0,
      param3: params[2] ?? 0.0,
      param4: params[3] ?? 0.0,
      param5: params[4] ?? 0.0,
      param6: params[5] ?? 0.0,
      param7: params[6] ?? 0.0,
    },
  }

  try {
    const response = await fetch(COMMAND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error(`Command ${command} failed (${response.status})`)
    }
  } catch (error) {
    addToast(
      error instanceof Error ? error.message : 'Unknown command error',
      'error',
    )
    throw error
  }
}

// MAV_CMD_COMPONENT_ARM_DISARM: param1 1.0 = arm, 0.0 = disarm
export const arm: () => Promise<void> = async () => {
  await sendCommand('MAV_CMD_COMPONENT_ARM_DISARM', [1.0])
}

export const disarm: () => Promise<void> = async () => {
  await sendCommand('MAV_CMD_COMPONENT_ARM_DISARM', [0.0])
}

// MAV_CMD_NAV_TAKEOFF: param7 = altitude in meters
export const takeoff: (altitude?: number) => Promise<void> = async (
  altitude = 3,
) => {
  await sendCommand('MAV_CMD_NAV_TAKEOFF', [0, 0, 0, 0, 0, 0, altitude])
}

// MAV_CMD_NAV_LAND
export const land: () => Promise<void> = async () => {
  await sendCommand('MAV_CMD_NAV_LAND')
}

export const goToLocation: (
  lat: number,
  lon: number,
  alt: number,
) => Promise<void> = async (lat, lon, alt) => {
  await setModeGuided()

  // Use COMMAND_INT (not COMMAND_LONG) for positional commands —
  // integer lat/lon avoids float32 precision loss that causes UNSUPPORTED
  const message = {
    header: {
      system_id: 255,
      component_id: 240,
      sequence: 0,
    },
    message: {
      type: 'COMMAND_INT',
      target_system: 1,
      target_component: 1,
      frame: { type: 'MAV_FRAME_GLOBAL_RELATIVE_ALT_INT' },
      command: { type: 'MAV_CMD_DO_REPOSITION' },
      current: 0,
      autocontinue: 0,
      param1: 0,
      param2: 0,
      param3: 0,
      param4: 0,
      x: Math.round(lat * 1e7),
      y: Math.round(lon * 1e7),
      z: alt,
    },
  }

  const response = await fetch(COMMAND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    const err = new Error(`Go to location failed (${response.status})`)
    addToast(err.message, 'error')
    throw err
  }
}

export const setModeGuided: () => Promise<void> = async () => {
  // param1 = 1 (MAV_MODE_FLAG_CUSTOM_MODE_ENABLED)
  // param2 = 4 (GUIDED mode for ArduCopter)
  await sendCommand('MAV_CMD_DO_SET_MODE', [1, 4])
}

export const armAndTakeoff: (altitude?: number) => Promise<void> = async (
  altitude = 3,
) => {
  await setModeGuided()
  await arm()
  await takeoff(altitude)
}
