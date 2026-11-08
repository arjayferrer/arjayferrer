import { listVehicles, wakeVehicle, getVehicleData, sendCommand } from "./teslaClient.js";

// Watch-facing action name -> Tesla Fleet API command name.
export const COMMANDS = {
  lock: "door_lock",
  unlock: "door_unlock",
  "climate-on": "auto_conditioning_start",
  "climate-off": "auto_conditioning_stop",
  honk: "honk_horn",
  flash: "flash_lights",
};

// The signing proxy only accepts VINs (not the legacy id_s), so use the VIN everywhere.
async function firstVehicleVin() {
  const vehicles = await listVehicles();
  return vehicles.response[0].vin;
}

// Returns { asleep: true } if the car had to be woken, otherwise a status summary.
export async function readVehicleStatus() {
  const vin = await firstVehicleVin();
  let data;
  try {
    data = await getVehicleData(vin);
  } catch {
    await wakeVehicle(vin);
    return { asleep: true };
  }
  const d = data.response;
  return {
    batteryLevel: d.charge_state.battery_level,
    rangeKm: Math.round(d.charge_state.battery_range * 1.60934),
    charging: d.charge_state.charging_state,
    locked: d.vehicle_state.locked,
    lat: d.drive_state.latitude,
    lon: d.drive_state.longitude,
  };
}

export async function runCommand(action) {
  const teslaCommand = COMMANDS[action];
  if (!teslaCommand) throw new Error(`Unknown command: ${action}`);
  const vin = await firstVehicleVin();

  let result;
  try {
    result = await sendCommand(vin, teslaCommand);
  } catch (err) {
    if (/\(408\)/.test(err.message)) {
      await wakeVehicle(vin);
      throw new Error("Car was asleep — waking it, try again in ~15s");
    }
    throw err;
  }

  // Tesla can answer HTTP 200 with { result: false, reason } when the car refuses.
  if (result.response?.result === false) {
    throw new Error(result.response.reason || "Car refused the command");
  }
  return result.response;
}
