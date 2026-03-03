const COMMAND_URL = 'http://localhost:8088/v1/mavlink'

async function sendCommand(command: string, params: number[] = []) {
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
      command: {type: command},
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

  await fetch(COMMAND_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(message),
  })
}

// MAV_CMD_COMPONENT_ARM_DISARM: param1 1.0 = arm, 0.0 = disarm
export async function arm() {
  await sendCommand('MAV_CMD_COMPONENT_ARM_DISARM', [1.0])
}

export async function disarm() {
  await sendCommand('MAV_CMD_COMPONENT_ARM_DISARM', [0.0])
}

// MAV_CMD_NAV_TAKEOFF: param7 = altitude in meters
export async function takeoff(altitude: number = 10) {
  await sendCommand('MAV_CMD_NAV_TAKEOFF', [0, 0, 0, 0, 0, 0, altitude])
}

// MAV_CMD_NAV_LAND
export async function land() {
  await sendCommand('MAV_CMD_NAV_LAND')
}

// MAV_CMD_DO_REPOSITION: param5 = lat, param6 = lon, param7 = alt
export async function goToLocation(lat: number, lon: number, alt: number) {
  await sendCommand('MAV_CMD_DO_REPOSITION', [0, 0, 0, 0, lat, lon, alt])
}

export async function setModeGuided() {
  // param1 = 1 (MAV_MODE_FLAG_CUSTOM_MODE_ENABLED)
  // param2 = 4 (GUIDED mode for ArduCopter)
  await sendCommand('MAV_CMD_DO_SET_MODE', [1, 4])
}

export async function armAndTakeoff(altitude: number = 10) {
  await setModeGuided()
  await arm()
  await takeoff(altitude)
}