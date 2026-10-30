// Shared helpers: reading the public Squeekchain API (read-only, no wallet, no keys).
export const API = "https://api.squeekchain.com/v1";

async function getJson(path) {
  const res = await fetch(API + path, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
  return res.json();
}

export const fetchStatus = () => getJson("/status");
export const fetchSettlements = () => getJson("/settlements?range=24h");

// "running" | "idle" | "offline" | "fault" | "unknown"
export function wheelState(status) {
  const m = status && status.measurement;
  if (!m || status.status === "unavailable") return "unknown";
  if (m.freshness !== "online") return "offline";
  if (m.coreStatus === "COUNTER_FAULT") return "fault";
  if (m.coreStatus === "ACTIVE" || Number(m.speedMmPerSecond) > 0) return "running";
  return "idle";
}

export const STATE_TEXT = {
  running: { title: "Squeektoshi is running!", sub: "the wheel is spinning and blocks are being mined", badge: "RUN" },
  idle: { title: "Squeektoshi is napping", sub: "no running = no blocks. check back later", badge: "" },
  offline: { title: "Wheel is offline", sub: "the sensor hasn't reported in for a bit", badge: "OFF" },
  fault: { title: "Sensor hiccup", sub: "the wheel counter reported a fault", badge: "!" },
  unknown: { title: "Status unknown", sub: "couldn't read the API right now", badge: "?" },
};

export function iconSet(state) {
  const name = state === "running" ? "run" : state === "idle" ? "idle" : "off";
  return { 16: `icons/${name}-16.png`, 32: `icons/${name}-32.png` };
}
