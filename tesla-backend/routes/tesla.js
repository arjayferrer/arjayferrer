import express from "express";
import {
  exchangeCodeForTokens,
  listVehicles,
  wakeVehicle,
  getVehicleData,
  sendCommand,
} from "../teslaClient.js";

const router = express.Router();

// --- Auth middleware: only your watch (or you) can call these ---
function requireWatchKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (key !== process.env.WATCH_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// --- One-time OAuth setup (open in a normal browser, not the watch) ---
// 1. Visit /api/tesla/login to kick off the Tesla consent screen
// 2. Tesla redirects back here with ?code=...
router.get("/login", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.TESLA_CLIENT_ID,
    redirect_uri: process.env.TESLA_REDIRECT_URI,
    response_type: "code",
    scope: "openid vehicle_device_data vehicle_cmds vehicle_charging_cmds offline_access",
    state: "watchapp",
  });
  res.redirect(`https://auth.tesla.com/oauth2/v3/authorize?${params}`);
});

router.get("/callback", async (req, res) => {
  try {
    const { code } = req.query;
    await exchangeCodeForTokens(code);
    res.send("Tesla account linked successfully. You can close this tab and use the watch app now.");
  } catch (err) {
    res.status(500).send(`Setup failed: ${err.message}`);
  }
});

// --- Endpoints the watch actually calls ---

router.get("/vehicle", requireWatchKey, async (req, res) => {
  try {
    const vehicles = await listVehicles();
    const vehicleTag = vehicles.response[0].id_s;
    let data;
    try {
      data = await getVehicleData(vehicleTag);
    } catch {
      // Car asleep — wake it and let the watch know to retry shortly
      await wakeVehicle(vehicleTag);
      return res.status(202).json({ status: "waking", message: "Car was asleep, waking up — retry in ~15s" });
    }
    const d = data.response;
    res.json({
      batteryLevel: d.charge_state.battery_level,
      rangeKm: Math.round(d.charge_state.battery_range * 1.60934),
      charging: d.charge_state.charging_state,
      locked: d.vehicle_state.locked,
      lat: d.drive_state.latitude,
      lon: d.drive_state.longitude,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/command/:action", requireWatchKey, async (req, res) => {
  const actionMap = {
    lock: "door_lock",
    unlock: "door_unlock",
    "climate-on": "auto_conditioning_start",
    "climate-off": "auto_conditioning_stop",
    honk: "honk_horn",
    flash: "flash_lights",
  };
  const action = actionMap[req.params.action];
  if (!action) return res.status(400).json({ error: "Unknown command" });

  try {
    const vehicles = await listVehicles();
    const vehicleTag = vehicles.response[0].id_s;
    const result = await sendCommand(vehicleTag, action);
    res.json({ ok: true, result: result.response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
