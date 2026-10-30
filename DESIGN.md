# Squeek Keeper design

## Overview

Squeek holders watch rewards, merge pairs and the hamster in a compact dark dashboard. A hamster icon and gold actions carry the existing visual identity. This revision preserves the interface, CSS and visible copy; its changes concern wallet safety and data freshness.

`popup.css` supplies the shared system. `index.html` adds the website shell; `popup.html` uses the compact extension layout. `act.html` has its own inline styles with the same colors.

## Colors

The exact shared tokens are in `popup.css:1`, repeated in `act.html:8`.

| Token | Value | Implemented role |
| --- | --- | --- |
| `--bg` | `#15151b` | App background; foreground on gold buttons |
| `--card` | `#1f1f27` | Cards, fields, signing surface |
| `--line` | `#2e2e39` | Borders, neutral buttons, inactive bars |
| `--gold` | `#e8b84a` | Primary buttons, active tab underline, amounts, links, bars |
| `--green` | `#3fc07a` | Ready/running status and successful messages |
| `--text` | `#f2eee6` | Main text |
| `--muted` | `#8c8a93` | Supporting text, labels, inactive tabs |
| `--red` | `#e86a5a` | Errors |

`index.html:12` uses `#0f0f14` outside the centered app. Status also has text; color does not carry it alone. There is one dark presentation and no theme switch. The rendered entry-page contrast probe passed; its coverage is recorded in `artifacts/validation.md`.

## Typography

Body text requests `Inter, "Segoe UI", system-ui, sans-serif`. There are no bundled or remotely downloaded fonts; the available system fallback renders the text. Wallet addresses and inputs use `ui-monospace, Consolas, monospace`.

| Role | Source values |
| --- | --- |
| Dashboard body | 13px / 1.4 |
| Website title / description | 24px, 800 / 13.5px |
| Wheel heading | 16px, 800 |
| Metric / claim amount | 16px, 700 / 22px, 800 |
| Supporting text / labels / axis | 12px / 11px with `.02em` tracking / 10px |
| Signing body / title / amount | 15px / 1.5; 20px, 700; 34px, 800 |
| Signing supporting / fine text | 13px / 12px |

Amounts and metrics use tabular numerals. `body.running h1` also turns the website title green, as in the existing implementation. Buttons retain their original font declarations: the `font: … inherit` shorthands do not override the browser default in Chromium, where the signing button computed to Arial, 13.3333px, 400. Do not assume those declarations load Inter or establish a new type scale.

## Layout

The extension body is 360px wide with 14px horizontal padding. The website overrides it with `body.page`: 100% width, a 420px maximum, centered margins, and 16px horizontal padding. The website shell has 14px internal padding. The hero uses 26px above and 14px below. There are no media-query breakpoints; flex wrapping, fluid width and the maximum width provide adaptation.

Metric grids have two equal columns and 8px gaps. Cards have 10px by 12px padding and 8px bottom spacing. The claim panel places the amount beside a vertical button group with a 10px gap. Small labels and addresses wrap naturally at narrow widths. The `.app` shell keeps its existing `overflow: hidden`.

The signing page centers a full-width panel capped at 440px, with 26px panel padding and 24px by 16px page padding. Both claim variants were checked at 320, 390, 768 and 1440px without document overflow. At 390 × 844 the initial Watch wallet button ends at approximately y=441, and both signing actions remain on the first screen. The extension's native popup width remains fixed.

## Elevation & Depth

Surfaces are flat: darker background, lighter cards and 1px structural borders. There are no shadows, overlays, gradients or animations.

## Shapes

Cards and metrics use 12px radii; dashboard buttons use 9px; inputs and website CTA use 10px. The website shell and signing panel use 18px. Tab-count and network badges use 99px. Existing hamster artwork lives in `icons/`; `docs/preview.png` is the existing share image.

## Components

- `.tabs` and `.panel` in `popup.css`, controlled by `showTab` in `popup.js`, show My Squeeks, Hamster and Alerts. The active tab uses a gold underline. Controls are native buttons; the existing ARIA limitations are documented in validation.
- `.watch` validates on form submission and shows the existing inline error. `.who` displays a short wallet address and the change control.
- `.btn`, `.primary` and `.wide` provide neutral, gold and full-width actions. Hover increases brightness; disabled buttons use `.4` opacity. Fields have the existing gold focus outline; buttons use native focus indicators.
- `.claim`, `.pairs`, `.grid` and `.bars` display holder data. Holder reads refresh every 60 seconds and on visibility return; extension local-storage changes refresh the view and alerts. Refresh preserves an address edit in progress and ignores superseded requests.
- `act.html` progresses from Connect wallet to Claim SQK or Claim + stake only after a Sepolia check. Wallet chain/account events reset it. Simulation and send each check the chain immediately beforehand. Unavailable reward reads display `?` and leave the claim action enabled; a known available zero disables it. Existing pending, cancellation, failure and success messages remain in place.

## Do's and Don'ts

Reuse the existing variables, flat cards, native controls and compact spacing. For another dashboard page, start from `popup.css` and the website's fluid shell. For a signing page, reuse the panel and explicit network/account rows from `act.html`. Preserve the distinction between an unknown balance and a confirmed zero, and keep wallet invalidation separate from asynchronous data responses.

Do not add a font, theme, animation or wallet stack to make a small fix. Do not treat a measured entry-page probe as proof of screen-reader, native-device or real-wallet behavior.

Review methodology used the pinned Better Interface guidance by Jakub Krehel (MIT, revision `267330e1adfc66a718fb65fa6918c1f06d0a689e`) and the Impeccable documentation guidance by Paul Bakaus (Apache-2.0, revision `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`). This document describes the implemented project.
