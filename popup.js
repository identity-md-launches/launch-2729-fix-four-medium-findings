import { fetchStatus, fetchSettlements, wheelState, STATE_TEXT } from "./shared.js";

const $ = (id) => document.getElementById(id);
const hasChrome = typeof chrome !== "undefined" && chrome.storage;

function ago(iso) {
  if (!iso) return "–";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ${mins % 60}m ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const fmtInt = (n) => Number(n).toLocaleString("en-US");

// SQK has 18 decimals; keep it readable without floating-point drift on big ints.
function fmtSqk(baseUnits) {
  const whole = BigInt(baseUnits || "0") / 10n ** 18n;
  return Number(whole).toLocaleString("en-US");
}

function renderStatus(status) {
  const state = wheelState(status);
  const t = STATE_TEXT[state];
  document.body.className = state;
  $("title").textContent = t.title;
  $("sub").textContent = t.sub;
  $("face").src = `icons/${state === "running" ? "run" : state === "idle" ? "idle" : "off"}-128.png`;

  const m = status.measurement || {};
  const speed = Number(m.speedMmPerSecond || 0) / 1000; // m/s
  $("speed").textContent = state === "running" ? `${(speed * 3.6).toFixed(1)} km/h` : "0 km/h";
  $("distance").textContent = `${(Number(m.distanceMm || 0) / 1e6).toFixed(2)} km`;
  const height = status.builder?.projected?.blockHeight ?? status.builder?.anchor?.blockHeight;
  $("height").textContent = height ? fmtInt(height) : "–";
  if (state === "running") $("lastRun").textContent = "right now";
  return state;
}

function renderDay(s) {
  const sum = s.summary || {};
  $("blocks24").textContent = fmtInt(sum.completedBlockCount || 0);
  const minted = (s.buckets || []).reduce((a, b) => a + BigInt(b.sqkMintedBaseUnits || "0"), 0n);
  $("sqk24").textContent = fmtSqk(minted.toString());

  const buckets = (s.buckets || []).slice(-24);
  const max = Math.max(1, ...buckets.map((b) => Number(b.workAdded || 0)));
  $("bars").replaceChildren(
    ...buckets.map((b) => {
      const i = document.createElement("i");
      const w = Number(b.workAdded || 0);
      i.style.height = `${Math.max(4, (w / max) * 100)}%`;
      if (w > 0) i.className = "on";
      const hour = new Date(b.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      i.title = `${hour}: ${fmtInt(w)} work, ${fmtInt(b.completedBlockCount || 0)} blocks`;
      return i;
    })
  );

  // Most recent settlement that actually carried wheel work ≈ when he last ran.
  const lastActive = (s.recentSettlements || []).find((r) => Number(r.workAdded) > 0);
  if ($("lastRun").textContent !== "right now") {
    $("lastRun").textContent = lastActive ? ago(lastActive.blockTimestamp) : "not in 24h";
  }
}

async function load() {
  try {
    const [status, settlements] = await Promise.all([fetchStatus(), fetchSettlements()]);
    renderStatus(status);
    renderDay(settlements);
    $("updated").textContent = `updated ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    document.body.className = "unknown";
    $("title").textContent = STATE_TEXT.unknown.title;
    $("sub").textContent = STATE_TEXT.unknown.sub;
  }
}

if (hasChrome) {
  chrome.storage.local.get("notify").then(({ notify = true }) => ($("notify").checked = notify));
  $("notify").addEventListener("change", (e) => chrome.storage.local.set({ notify: e.target.checked }));
  chrome.runtime.sendMessage({ type: "refresh" }).catch(() => {});
}

load();
setInterval(load, 15000);
