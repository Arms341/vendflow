# S204 (2026-10-05) — four findings from walking the live HQ

Applied by `C:\Jarvis\_s204_scratch\apply_hq_s204.py` (idempotent). Proven on a real stack
(API + Postgres + this front end) under a browser at 375, 768 and 1280 wide; tsc clean, 143 page tests.

| Finding | Change | Builder home |
|---|---|---|
| Phone: the sidebar was a fixed 256px column at every width | `Sidebar` v2.1.0 — below `md` it is an off-canvas drawer behind a top bar with a menu button; any navigation, the backdrop or Escape closes it. `Layout` is `md:flex`. Detail-page header rows wrap; detail rows give the label 2/5 of the width on a phone | Road 1 / B1 |
| Machine page: an unlabelled box showing "1" beside Telemetry | The box is labelled Temperature, starts empty, and the button is disabled until a reading is typed | action request fields need labels |
| "Marketingdashboard" / money without a currency | The three generated dashboards: real headings, `fmtCurrency` on money tiles, no Id column, parents by name | B5 |
| Lists led with ID / Operator Id / Machine Id | 23 generated lists: no leading ID column; a foreign key shows the parent's name under a header without " Id". `useRefLabels` v1.1.0 also resolves account, route and driver | Road 1 / B3 |

## Later the same day — the terminal, from HQ

| Change | Files |
|---|---|
| Machine page gains a **Payment terminal** panel when the machine has a terminal id: last check-in, app version, applied settings revision, what the terminal refused, its status lines and recent log, and a settings form drawn from the server's `spec` | `components/TerminalPanel.tsx` (+ test), `pages/MachinesDetailPage.tsx` |

Server side: vendflow-api `routes/terminal_configs.py`, `services/terminal_settings.py`,
`models/terminal_config.py`, `routes/webhooks.py` v1.6.0. Terminal side: VendFlowPay 0.3.5
(`REMOTE_SETTINGS.md` in that repo).
