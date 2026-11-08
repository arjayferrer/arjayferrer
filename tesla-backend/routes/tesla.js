import express from "express";
import { exchangeCodeForTokens } from "../teslaClient.js";
import { COMMANDS, readVehicleStatus, runCommand } from "../vehicleActions.js";
import { handleVoice } from "../voiceAgent.js";

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
    const status = await readVehicleStatus();
    if (status.asleep) {
      // Car asleep — it's being woken; let the watch know to retry shortly
      return res.status(202).json({ status: "waking", message: "Car was asleep, waking up — retry in ~15s" });
    }
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/command/:action", requireWatchKey, async (req, res) => {
  if (!(req.params.action in COMMANDS)) return res.status(400).json({ error: "Unknown command" });

  try {
    const result = await runCommand(req.params.action);
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Body: { "text": "unlock the car" } -> { "reply": "...", "actions": ["unlock"] }
router.post("/voice", requireWatchKey, async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text || text.length > 300) {
    return res.status(400).json({ error: "Send {\"text\": \"...\"} up to 300 characters" });
  }

  try {
    const outcome = await handleVoice(text);
    console.log(`[voice] "${text}" -> [${outcome.actions.join(", ")}] "${outcome.reply}"`);
    res.json(outcome);
  } catch (err) {
    console.error(`[voice] "${text}" failed:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
