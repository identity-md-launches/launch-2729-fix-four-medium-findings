# Squeek Keeper 🐹

**A Chrome extension that watches your Squeeks for you and pings you when there's something to do.**

[Squeekchain](https://docs.squeekchain.com) is a proof-of-work toychain on Ethereum where a real hamster, Squeektoshi, mines the blocks. Squeek NFTs share the SQK he mines, and two same-level Squeeks can merge into a stronger one once their cooldowns end. Dashboards show you all of this, but only when you go and look. Squeek Keeper sits in your toolbar and tells you the moment it matters.

![preview](docs/preview.png)

## What it does

**Alerts, in the background (nothing needs to stay open)**
- 🔀 **Merge ready**: two of your same-level Squeeks are both off cooldown
- 💰 **Claim ready**: your claimable SQK passes the amount you set (default 100)
- 🐹 **Squeektoshi woke up**: the wheel just started spinning
- The toolbar badge shows a number when something needs you

**Act on it in one click**
- **Claim** or **Claim + stake** your SQK. The button opens a small signing page, your wallet shows the transaction, you sign. The page simulates the call first and refuses to send anything that would fail.
- **Merge** shows exactly which two Squeeks to pick, then opens the official Squeekchain app

**At a glance**
- Your Squeeks, total power, claimable SQK, last 7 days of earnings
- Which pairs can merge now, or how many blocks until the next cooldown ends
- Live hamster status: running / napping / offline, speed, distance, last 24h of work

## Install (2 minutes)

1. **Code → Download ZIP** on this page, then unzip it
2. Open `chrome://extensions` (Chrome, Brave or Edge)
3. Turn on **Developer mode** (top right)
4. Click **Load unpacked** and pick the unzipped folder (the one with `manifest.json` inside)
5. Pin it from the puzzle icon, open it and paste the wallet that holds your Squeeks

Watching a wallet is read-only: no wallet connection, no signature. Your wallet is only involved when you press Claim.

## How it works

| Part | What it does |
|---|---|
| `background.js` | Every minute checks the wheel; every 5 minutes checks the watched wallet. Fires an alert only when something changes (a new ready pair, claimable crossing your threshold, the hamster waking up), so you aren't spammed |
| `popup.*` | The three tabs: My Squeeks, Hamster, Alerts |
| `shared.js` | API calls and the logic that turns account data into merge pairs, cooldowns and totals |
| `index.html` | Web version of Squeek Keeper (same app in a page, live at olric3015.github.io/squeektoshi-status) |
| `act.html` | The signing page for Claim / Claim + stake, served by GitHub Pages so your wallet extension can reach it |

**Data**: the public [Squeekchain API](https://docs.squeekchain.com/developers/api/): `/v1/status`, `/v1/settlements`, `/v1/accounts/{address}`.

**Transactions** (Sepolia, `SqueekStaking` proxy `0x4b67b739dfd832f4eac67a7aa3bc244fb74cea4f`):
- Claim: `claim(address)` with your own address (`0x1e83409a`)
- Claim + stake: `claimAndStake()` (`0xcb1a4fc0`)

These selectors were read from the deployed contract's bytecode and match successful claims on Sepolia. The contract isn't verified on explorers yet, so merging is left to the official app instead of guessing at an unpublished function. When the team publishes the staking ABI, merge moves into the extension too.

**Privacy**: no accounts, no analytics, no servers of ours. The only hosts it talks to are `api.squeekchain.com` and, when you press Claim, your own wallet.

## Notes

- Squeekchain is on the **Sepolia testnet** right now, so everything here is testnet. Addresses will be updated for mainnet.
- Plain JavaScript, Manifest V3, no build step, no dependencies.
- Community project, not affiliated with the Squeekchain team.

Built by [@OlricOnlyfornft](https://x.com/OlricOnlyfornft). MIT licensed.
