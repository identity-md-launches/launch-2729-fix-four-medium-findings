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
- Plain JavaScript, Manifest V3, no runtime dependencies. The extension runs directly from this folder; the optional website build copies the static files to `dist/`.
- Community project, not affiliated with the Squeekchain team.

Built by [@OlricOnlyfornft](https://x.com/OlricOnlyfornft). MIT licensed.

## Website: install, preview and rebuild

The ready-to-serve website is included in `dist/`. Serve that directory on a static host; its scripts, styles, favicon and share image use relative URLs. The existing claim-page and official-app destinations remain configured in `shared.js`.

With Node.js 20 or later, from the repository root:

```sh
npm --prefix web ci
npm --prefix web run typecheck
npm --prefix web run build
npm --prefix web run preview
```

Preview opens a local HTTP server at `http://127.0.0.1:4173/`; visit that address and stop the server with Ctrl+C. `node web/preview.mjs 4174` chooses a different port. Building needs only Node (`node web/build.mjs`); the locked development dependency is TypeScript for checking `shared.js`. The existing dynamic DOM/Chrome scripts are validated with syntax and browser interaction checks, rather than claiming full static typing.

Keep generated dependency and cache directories out of submissions. Source stays in the root; `web/` contains only the new build/preview tooling and its development manifest and lockfile. The build recreates `dist/` from an explicit asset list, without installing or copying dependencies into the export.

## Four-finding revision and validation

- Claims require Sepolia before connection is accepted, immediately before simulation, and immediately before send. Chain/account changes reset to Connect wallet and invalidate pending work.
- Account reads follow every `nextCursor`, combine the token pages before summarizing, and reject partial availability.
- An open holder view refreshes every 60 seconds and on visibility return. The extension also refreshes holder and alert settings on local storage changes. Editing a watched address is preserved.
- An HTTP failure or unavailable claimable response displays `?`, with Claim enabled; an available zero still disables Claim.

Validation of the final export:

| Check | Actual result |
| --- | --- |
| `npm --prefix web run build` | Passed; static export created |
| Clean `npm ci` using the delivered lockfile in a temporary copy | Passed, followed by successful typecheck and build |
| `npm --prefix web run typecheck` | Passed for `shared.js` with TypeScript 7.0.2 |
| `node --check popup.js`, `shared.js`, `background.js`, and tooling | Passed |
| Temporary Node/Playwright regression harness | 31 checks passed: six API checks and 25 Chromium checks; WebKit launch unavailable because required system libraries are missing |
| Temporary responsive/state review | 11 checks passed; website and both signing variants checked at 320, 390, 768 and 1440px |
| Pinned `taste.mjs --out test/scratch/taste` | All 16 checks passed after the final source build |
| Assigned browser inspection | Initial form, invalid submission, keyboard focus and no-wallet signing state inspected at 1280 × 720 |

The interaction harness used controlled API and wallet/Chrome API fixtures; it sent no live transaction. Timers used a virtual clock. A broader JavaScript typecheck reported 15 existing DOM/Chrome typing diagnostics, also reproduced on the original source; it is not a passing full-project typecheck. WebKit, native extensions, physical phones, screen readers and real signing were not verified. The signing page retains its pre-existing implicit `/favicon.ico` 404 when opened directly; the website's explicit favicon loads successfully.

See [DESIGN.md](DESIGN.md) for the existing system and [artifacts/validation.md](artifacts/validation.md) for six-domain coverage, source locations, evidence and limitations. The temporary check scaffolding lived in `test/scratch/`, which is excluded from delivery by the task; the actual results and selected screenshots are retained under `artifacts/`.
