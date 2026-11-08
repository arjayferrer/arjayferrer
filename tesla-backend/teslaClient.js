import fs from "fs";
import https from "https";
import fetch from "node-fetch";

const TOKEN_PATH = process.env.TOKEN_STORE_PATH || "./data/tesla-tokens.json";

function readTokens() {
  if (fs.existsSync(TOKEN_PATH)) {
    return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
  }
  // Ephemeral-disk hosts (Render free tier) wipe TOKEN_PATH on restart;
  // fall back to a refresh token pinned in the environment.
  if (process.env.TESLA_REFRESH_TOKEN) {
    return { refresh_token: process.env.TESLA_REFRESH_TOKEN, obtained_at: 0 };
  }
  return null;
}

function writeTokens(tokens) {
  fs.mkdirSync("./data", { recursive: true });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

// Exchange the one-time OAuth code for access + refresh tokens.
// Called once from /api/tesla/callback during initial setup.
export async function exchangeCodeForTokens(code) {
  const res = await fetch("https://auth.tesla.com/oauth2/v3/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.TESLA_CLIENT_ID,
      client_secret: process.env.TESLA_CLIENT_SECRET,
      code,
      redirect_uri: process.env.TESLA_REDIRECT_URI,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  writeTokens({ ...data, obtained_at: Date.now() });
  return data;
}

async function refreshTokens() {
  const tokens = readTokens();
  if (!tokens?.refresh_token) throw new Error("No refresh token on file — run initial OAuth setup first.");

  const res = await fetch("https://auth.tesla.com/oauth2/v3/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.TESLA_CLIENT_ID,
      refresh_token: tokens.refresh_token,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  writeTokens({ ...data, obtained_at: Date.now() });
  return data;
}

// Returns a valid access token, refreshing if it's older than ~7 minutes
// (Tesla access tokens are typically short-lived, refresh tokens last much longer).
async function getValidAccessToken() {
  let tokens = readTokens();
  if (!tokens) throw new Error("Not authenticated with Tesla yet.");

  const ageMs = Date.now() - (tokens.obtained_at || 0);
  const sevenMinutes = 7 * 60 * 1000;
  if (ageMs > sevenMinutes) {
    tokens = await refreshTokens();
  }
  return tokens.access_token;
}

async function teslaRequest(path, options = {}, { base = process.env.TESLA_AUDIENCE, agent } = {}) {
  const token = await getValidAccessToken();
  const res = await fetch(`${base}${path}`, {
    ...options,
    ...(agent && { agent }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Tesla API error (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

export async function listVehicles() {
  return teslaRequest("/api/1/vehicles");
}

export async function wakeVehicle(vehicleTag) {
  return teslaRequest(`/api/1/vehicles/${vehicleTag}/wake_up`, { method: "POST" });
}

export async function getVehicleData(vehicleTag) {
  return teslaRequest(`/api/1/vehicles/${vehicleTag}/vehicle_data?endpoints=charge_state;drive_state;vehicle_state`);
}

// Vehicle commands (lock, unlock, climate, honk, flash) must be signed with your
// command-signing private key, which Tesla's official `tesla-http-proxy` does. The
// Docker image runs it next to this server (see docker-entrypoint.sh) and sets
// TESLA_PROXY_URL + TESLA_PROXY_CA. The proxy is TLS-only and addresses vehicles by
// VIN, and it works out the right regional Fleet API host from the OAuth token.
// Reads (vehicle_data, wake_up) don't need signing and still go straight to Tesla.
let proxyAgent;
function getProxyAgent() {
  proxyAgent ??= new https.Agent({ ca: fs.readFileSync(process.env.TESLA_PROXY_CA) });
  return proxyAgent;
}

export async function sendCommand(vin, command, body = {}) {
  const base = process.env.TESLA_PROXY_URL;
  if (!base || !process.env.TESLA_PROXY_CA) {
    throw new Error("Signing proxy not configured (TESLA_PROXY_URL / TESLA_PROXY_CA). Commands need tesla-http-proxy.");
  }
  return teslaRequest(
    `/api/1/vehicles/${vin}/command/${command}`,
    { method: "POST", body: JSON.stringify(body) },
    { base, agent: getProxyAgent() },
  );
}
