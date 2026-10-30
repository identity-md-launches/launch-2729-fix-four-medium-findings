# Four-finding validation

## Scope and completion

Complete for the four requested fixes, with the verification limits below. The workspace did not contain `.imd-findings.json`; the four findings enumerated in the assignment supplied the scope. The existing plain JavaScript source, styling, visible copy, contracts, transaction selectors and destinations were retained. No wallet connector migration, deployment or live transaction was performed.

`dist/` is the production export. A copy-only Node build, a scoped TypeScript check, preview tooling, a new development lockfile and the required documentation accompany it. The only index markup additions are the required favicon and Open Graph metadata, using existing local assets. Existing build/dependency configuration was absent and none was replaced. The new `.gitignore` excludes dependency/cache directories at every depth and explicitly allows only these seven validation files, with per-path limits totaling 335,872 bytes; no other artifact is added to the submission.

The product is a compact Squeek holder dashboard, carried visually by the hamster icon, dark flat surfaces and gold actions.

## Findings and fixes

| Finding | Final source | Correction and observed recheck |
| --- | --- | --- |
| Medium: connected state could survive an unsuccessful chain switch | `act.html:77`, `act.html:123`, `act.html:149` | Connected account assignment follows a successful Sepolia chain read. Simulation and send each immediately follow their own `eth_chainId` check. `chainChanged` and `accountsChanged` clear the account and restore enabled Connect wallet. Version checks discard pending work, including events arriving between a chain check and its continuation. Rejected/ineffective switching, unreadable chain, silent network changes, both events, and pending work passed Chromium tests with zero sends in blocked cases. |
| Medium: holder summary only used the first token page | `shared.js:18` | Follow `nextCursor` through encoded `?cursor=…` requests until null, retaining first-page account metadata and merging every token before callers summarize. An unavailable response invalidates the whole account; HTTP/network/JSON failure rejects the fetch. Three-page totals, a pair spanning pages, a later cooldown, special cursor characters and all failure modes passed. |
| Medium: open holder view went stale | `popup.js:119`, `popup.js:140`, `popup.js:193`, `popup.js:196`, `popup.js:200` | Refresh every 60 seconds and when visible again; extension local-storage changes refresh the holder and alert controls. Superseded responses are ignored and a change-address edit stays open. Virtual-clock assertions showed no holder request at 59,999ms and one at 60,000ms; visibility return and storage updates changed displayed values. A delayed response for the previous wallet could not overwrite the new wallet. |
| Medium: unavailable claimable data appeared as zero | `act.html:106`, `act.html:142` | Require both HTTP success and `status === "available"` before displaying a number. HTTP 503, unavailable status, network failure and malformed JSON each displayed `?` and kept Claim enabled. A known available zero still disabled Claim. Both claim variants were exercised. |

Successful fixture transactions retained `SqueekStaking` at `0x4b67b739dfd832f4eac67a7aa3bc244fb74cea4f`, the original selectors and zero value. No request in the tests reached an actual signing wallet.

## Better Interface coverage

Applied the pinned Better Interface workflow and core principles of all six domains. The explicit assignment, “Keep everything else, including design and text, the same,” limits correction to the four findings and required export/metadata/documentation.

| Domain | Coverage and evidence | Limitations |
| --- | --- | --- |
| Accessibility | Checked native controls, keyboard submit/tab focus, source names and status text; browser accessibility snapshot exposed the three tabs, wallet field and main actions. Inspected a visible native button focus ring. Entry-page target/contrast probe passed. | No screen-reader or full accessibility audit. The existing address input uses a placeholder instead of an associated label (`index.html:43`, `popup.html:19`); existing tabs lack selected-state/roving-keyboard semantics (`popup.js:48`). These are outside the four-finding revision. Eight entry controls were below the probe's comfortable 44px size but passed its 24px/spacing rule. |
| Layout | Checked source order, existing flex/grid/max-width rules, initial and populated website screenshots, and signing pages. Website and both signing variants had no document overflow at 320, 390, 768 or 1440px. The 390 × 844 initial page shows the title and Watch wallet; button bottom approximately y=441. | No native 200% zoom, RTL/localization or physical-device test. Fixed extension popup width is retained. |
| Writing | Checked existing action labels and error/recovery copy against their handlers. Restored Connect wallet on invalidation and `?` for unknown rewards. No visible copy was rewritten. | This is a dashboard, not a new marketing/copy assignment. |
| Typography | Checked declared sizes, family stacks, numeric stability and wrap behavior in screenshots; captured computed signing-page typography. Initial page passed probe size/family/weight checks. | No custom fonts are bundled. Existing invalid `font: … inherit` button shorthands (`popup.css:24`, `popup.css:66`, `act.html:22`) leave native defaults in Chromium; retained under the preservation constraint. Full loaded-holder typography was inspected, but the entry probe does not certify every dynamic state. |
| Colors | Reused all eight existing hex tokens. Entry-page probe measured solid-background text contrast and passed 4.5:1/3:1 thresholds. Ready, unknown and error states also have text. | No separate theme exists. No claim of contrast certification for every possible wallet/API string, native forced-colors mode or disabled state. |
| UI | Walked connected/disconnected, unknown/zero rewards, simulation failure, signing cancellation, successful fixture send, API failure, refresh, address editing and storage updates. Existing surfaces, icons and hover/disabled treatments remain. Probe found no transitions or endless motion, including under reduced motion. | No animation replay was needed because no animation exists. No native extension/notification integration or real-wallet session. |

## Commands and actual results

Commands were run from the repository root. Tool packages and browser downloads were installed outside the repository; no dependency/cache directories are delivered.

| Command / check | Result |
| --- | --- |
| `npm --prefix web run build` | Exit 0 after the last application-source change; copied complete local runtime assets into `dist/`. |
| Clean install using the delivered `web/package.json` and lockfile in a temporary copy | `npm ci`, scoped typecheck and production build all exited 0; no runtime dependency or cache was copied into the export. |
| `npm --prefix web run typecheck` | Exit 0 with TypeScript 7.0.2; checks `shared.js` using `allowJs`, `checkJs`, `noEmit`. |
| `node --check popup.js`, `node --check shared.js`, `node --check background.js`, `node --check web/build.mjs`, `node --check web/preview.mjs` | All exit 0; signing inline script was also parsed/executed by Chromium. |
| Broad `tsc --allowJs --checkJs --noEmit --strict false --target es2022 --module esnext --moduleResolution bundler … shared.js popup.js background.js` with Chrome ambient types | Exit 1, 15 diagnostics. Running the same check on original-source copies reproduced all 15: 11 dynamic DOM-property typings in `popup.js`, four storage/update shape typings in `background.js`. No full-project typing pass is claimed; those unrelated scripts were not rewritten. |
| `node test/scratch/validate.mjs` with Playwright 1.64.1 | 31 checks passed (six direct shared-helper/API checks, 25 Chromium checks). Overall exit 1 solely because WebKit could not launch: missing GTK/GStreamer and related system libraries. WebKit behavior remains unperformed. |
| `node test/scratch/review.mjs` | Exit 0; 11 additional initial-page, metadata, responsive and unknown-state checks passed, plus computed typography captured. |
| `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` using the external Playwright installation | Exit 0; 16/16 checks passed against the final export at 320, 390 and 1440px, plus reduced-motion measurement. Retained actual check outputs in `taste-results.json`. |
| Assigned browser tool | Inspected final export at 1280 × 720: empty watch form, invalid address via Enter, Tab to the visible focused Watch wallet button, and no-wallet Connect response. Initial page had no console errors and all referenced local assets returned 200. Directly opening `act.html` caused the existing browser-generated `/favicon.ico` 404; no missing app script/image or runtime exception. |
| Preview and packaging | Preview returned 200 for the entry/signing pages, both scripts, CSS, favicon and share image, and 404 for a missing file. Byte comparisons confirmed all exported runtime files match source and original body markup/CSS are unchanged. Full changed-file contents plus additions remain below 1 MiB, within the 8 MiB assignment limit; each allowlisted artifact is within its explicit path budget. |

Website regression checks also exercised valid/invalid watch submissions, pagination-fed rendering, My Squeeks/Hamster/Alerts navigation, persistent alert settings, claim/claim-and-stake destinations and the official merge destination. The production files were served under `/preview/` in the interaction harness, verifying relative local assets at a subpath. No live API availability or transaction success is inferred from fixtures.

## Evidence and limits

`interaction-results.json` retains individual regression outcomes, responsive geometry and the WebKit limitation without machine-specific paths. Screenshots in `screenshots/` show the actual final export:

- `initial-390.png`: first screen, with Watch wallet visible.
- `holder-390.png`: paginated holder fixture, claim actions and merge pair.
- `claim-unknown-390.png`: unavailable balance displayed as `?`, enabled Claim SQK.
- `claim-and-stake-unknown-390.png`: same state for Claim + stake.

Holder amounts, token IDs and accounts in these diagnostic screenshots are controlled fixtures, not live user balances. The source and export contain no fixture wallet, test key, owner address or fabricated balance.

The original input share image remains `docs/preview.png` and is copied into the export. The index has a title, description, explicit local favicon, `og:title` and local `og:image`. CSS and all body markup/copy were compared with the original source and preserved. The static export is an exact copy of its source runtime files.

Unperformed: WebKit/Safari rendering, screen-reader sessions, native browser zoom, physical devices, native extension installation/alarms/notifications, real wallet network switching/signing, and live transaction execution. The worker's results are local evidence, not independent certification. No publication was attempted.
