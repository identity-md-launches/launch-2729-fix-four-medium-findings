import { fetchStatus, wheelState, STATE_TEXT, iconSet } from "./shared.js";

const ALARM = "squeek-poll";

async function refresh() {
  let state = "unknown";
  try {
    state = wheelState(await fetchStatus());
  } catch (e) {
    state = "unknown";
  }

  const { lastState, notify = true } = await chrome.storage.local.get(["lastState", "notify"]);

  await chrome.action.setIcon({ path: iconSet(state) });
  await chrome.action.setBadgeText({ text: STATE_TEXT[state].badge });
  await chrome.action.setBadgeBackgroundColor({ color: state === "running" ? "#2FA866" : "#6B6875" });
  await chrome.action.setTitle({ title: `Squeektoshi Status: ${STATE_TEXT[state].title}` });

  // Ping only on the moment he starts running (not on every poll).
  if (notify && state === "running" && lastState && lastState !== "running") {
    chrome.notifications.create("squeek-wake-" + Date.now(), {
      type: "basic",
      iconUrl: "icons/run-128.png",
      title: "Squeektoshi woke up! 🐹",
      message: "The wheel is spinning. Blocks are being mined right now.",
      priority: 1,
    });
  }

  await chrome.storage.local.set({ lastState: state, checkedAt: Date.now() });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM, { periodInMinutes: 1 });
  refresh();
});
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create(ALARM, { periodInMinutes: 1 });
  refresh();
});
chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === ALARM) refresh();
});
chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "refresh") refresh();
});
chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({ url: "https://x.com/squeektoshi" });
});
