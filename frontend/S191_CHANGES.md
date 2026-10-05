# vendflow-hq — the polished HQ front end

Seeded 2026-09-18 (S191) from `vending_machine_build_0917_1242/frontend`, which is a
BUILD OUTPUT and will be overwritten by the next build. This copy is the one that survives,
and it is the seed for `reference_implementations/vending_machine` (Road 1, Part D).

**Every change here has a builder home. A hand fix with no Road 1 entry is debt being created.**

| # | Change | Files | Road 1 |
|---|---|---|---|
| D3 | Brand comes from `src/config/brand.ts`; **`GET /company` call deleted** (it 404'd twice per page load and the app called itself "JARVIS App") | `config/brand.ts` (new), `contexts/BrandContext.tsx` v3.0.0, `index.html`, `Navbar.tsx`, `Login.tsx`, `Register.tsx` | A4 |
| D9 | "Register for free" removed from the login page of an internal back office | `pages/Login.tsx` | A7 |
| D4 | `optFromInput` + `nullsToUndefined` — **99 optional schemas across 23 form pages**. Fixes "Save does nothing" on any row the UI did not create | `pages/*FormPage.tsx` | A2 |
| D5 | `src/lib/format.ts` — currency, percent, datetime, booleans, enum Title Case, em dash for null. **553 render sites across 56 pages** | `lib/format.ts` (new), all list + detail pages | B5 |
| D7 | Inventories now shows **Cash Price**; Transactions shows **Time / Amount / Status / Slot / Card / Reference** | `InventoriesPage.tsx`, `TransactionsPage.tsx` | A3 |
| D6 | Grouped **sidebar** replaces the 24-link flat row whose section switcher was clipped off-screen | `components/Sidebar.tsx` (new), `Layout.tsx`, `config/nav_groups.ts` (new) | B1 |
| D8 | Operator dashboard: 4 real tiles, single-series net-revenue chart **with an empty state instead of empty axes**, recent-transactions table with status badges | `pages/Dashboard.tsx` v2.0.0 | B6 |

Backend counterpart (in `deploy/vendflow-api`, NOT yet pushed at time of writing):
`routes/webhooks.py` **v1.3.0** — reversal-aware derived data (D1 + D2, Road 1 A1).
Locked template updated in lockstep: `template_library/python/locked_files/files/routes_webhooks_vending.py`.
Tests: 26 -> 49 green.

Still open: D10 (Bulk Price posts `{}` -> 422), D11 (detail/form polish, FK names instead of
raw ids, list search/sort/pagination), demo data seeding, Render paid plan.

## Pass 2 (same session)

| # | Change | Files | Road 1 |
|---|---|---|---|
| D10 | **Bulk price actually works** — modal collects per-slot prices and posts a real `updates` array, scoped to the machine filter. Was `createInventoriesBulkPrice({})` behind a `window.confirm` -> guaranteed 422 | `InventoriesPage.tsx` v2.0.0 | A5 |
| D11a | Foreign keys render as **names**, not raw ids (product, machine) | `InventoriesPage.tsx` | B3 |
| D11b | **Machine filter** + group-by-machine sort on Inventories — nine machines each have a "slot 1" | `InventoriesPage.tsx` | B2 |
| **NEW** | **`fetchAll` — list endpoints default to `limit=100` and return the OLDEST 100.** The dashboard summed 100 of 334 daily reports and called it the all-time total | `lib/paginate.ts` (new), `Dashboard.tsx`, `DailyReportsPage.tsx` | **new Road 1 item** |
| D8b | Dashboard revenue chart aggregates **by day**, not per report row (a fleet files one report per machine per day) | `Dashboard.tsx` | B6 |

### The pagination defect is the most important thing found in pass 2
`GET /daily_reports/` defaults to `limit=100` and returns the oldest rows first. Every emitted list
page and the dashboard call `listX()` with no arguments. **Under 100 rows it is invisible** — which
is exactly why no gate, fixture or test has ever crossed it. At 334 rows the dashboard showed six
days of August and labelled it the all-time total. This belongs in the drive-the-UI probe as a new
assertion: **seed more rows than the default page size and assert the page shows them all, or says
it is showing a page.**

## Pass 3 — visual polish

| Change | Files |
|---|---|
| **Sidebar v2.0.0** — dark slate chrome, per-item icons (24 routes mapped), group dividers, brand tile. v1 grouped correctly but read as one flat list: 10px grey headings and 24 identical text rows give the eye nothing to land on. **Colour separates chrome from content; icons make a row findable by shape.** | `components/Sidebar.tsx` |
| **Stat tiles** — icon chip, uppercase label, tabular-nums value, and a *tone* that only fires when the number means something (machines offline / slots low go amber, all-clear goes green). Status colour stays reserved and always ships with its label. | `pages/Dashboard.tsx` |
| Page header gains a subtitle (machine count + date) | `pages/Dashboard.tsx` |
| Tiles reflow 1 / 2 / 4 columns and truncate rather than collide at narrow widths | `pages/Dashboard.tsx` |

Road 1: all of the above is **B1 + B6** — the emitter should produce this shape, with the icon map
driven by the profile's entity list rather than a hand-written table.

## Pass 4 — pre-video sweep

| Change | Scale |
|---|---|
| **Empty state on every list** — 14 of 24 entities have no rows, and the generated list archetype rendered a bare header over nothing | 23 list pages |
| Form/detail titles singularised — "Edit Inventories" -> "Edit Inventory", "Transactions #1" -> "Transaction #1" | 21 form + 13 detail |
| FK form labels drop " Id" — the control is a name dropdown, so "Machine Id" read wrong | 21 form pages |
| UN20 slots repointed off the duplicate seed products (1,2) onto the properly named ones (3,4) | data |

Road 1: the empty state is **B2**; singular titles and FK labels are **B3/B4** — the emitter knows
the entity's singular name and which columns are foreign keys (it builds the dropdown from them),
so both should come out right rather than be patched.
