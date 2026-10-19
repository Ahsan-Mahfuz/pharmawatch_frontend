# PharmaWatch — frontend

Batch-level expiry tracking for a small pharmacy.

Stock is normally counted per medicine — "200 strips of Napa Extra". Expiry is
not. Three batches of the same medicine die on three different dates, and the
one at the back of the shelf is the one that quietly goes to waste. PharmaWatch
tracks every batch separately, works out which ones will *not* sell before they
expire, and says so while two things are still possible:

- **Return it.** Most suppliers take stock back until ~90 days before expiry.
- **Discount it.** A 20% cut sells the batch; a write-off recovers nothing.

This repository is the frontend. Every figure on every screen comes from the
API in [`../pharmawatch_backend`](../pharmawatch_backend) — there is no sample
data in this codebase, so the server has to be running.

---

## Running it

Start the API first:

```bash
cd ../pharmawatch_backend
pnpm install && cp .env.example .env
pnpm seed         # two accounts, 7 suppliers, 13 medicines, 16 batches
pnpm dev          # http://localhost:5000
```

Then the frontend:

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build — 15 prerendered routes, `/batches/[id]` on demand |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit`, strict + `noUncheckedIndexedAccess` |
| `pnpm lint` | ESLint, `eslint-config-next` |
| `pnpm test` | Vitest — 98 unit tests over the domain layer |
| `pnpm test:e2e` | Builds, boots the API and the app, drives a real browser — 54 Playwright tests |

### Environment

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the API. The client appends `/api/v1`. Defaults to `http://localhost:5000`. **Inlined at build time** — set it before `next build`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, used for metadata, sitemap and Open Graph. |

`.env*` is gitignored. Only `.env.example` is tracked.

### Signing in

Everything behind the counter sits behind `/signin`. Two seeded accounts, both
with the password `Pharma@2026`:

| Email | Role | Can |
|---|---|---|
| `rafiq@pharmawatch.test` | Pharmacist | Sell, apply discounts, raise return and write-off requests |
| `owner@pharmawatch.test` | Owner | Everything above, plus approve or reject requests — **but never their own** |

Both are created by `pnpm seed` in the backend; the password comes from
`OWNER_PASSWORD` there. The sign-in card does not print them — a real pharmacy's
front door should not list its staff.

The access token lives in memory only and the refresh token in an httpOnly
cookie, so a reload asks the server whether the session still stands. The full
design — token strategy, password policy, reset-token handling, rate limits and
the endpoint contract — is in **[docs/AUTH.md](docs/AUTH.md)**.

Today is today. Every day count on every screen is measured against the real
date, so a batch that is 26 days from expiry this morning is 25 tomorrow.

---

## Architecture

```
src/
├── domain/        every business rule — pure TypeScript, no React
├── store/         Redux Toolkit slices, thunks and memoised selectors
├── components/    one folder per screen, plus ui/ viz/ layout/ auth/
├── lib/           colours, fonts, metadata, schemas, small helpers
│   ├── api/       the fetch client, the wire shapes and the mapping to domain
│   └── auth/      the AuthApi contract and its one implementation
└── app/
    ├── (auth)/    sign in, sign up, forgot and reset — no header
    └── (app)/     the eight screens, behind a session guard
tests/             Vitest — the domain rules and the auth schemas
e2e/               Playwright — the app driven in a real browser
```

**The one rule worth knowing:** no component calculates anything. Every number,
label, colour decision and ordering lives in `src/domain/` as a pure function,
is unit-tested there, and arrives at the component ready to render. That is why
no component in this repo is longer than 80 lines, and why the rules can be
re-used by the backend unchanged.

| Module | Decides |
|---|---|
| `status.ts` | Active / near / critical / expired / closed, at 90 and 30 days |
| `risk.ts` | Sell rate, the logistic score, expected unsold units |
| `recommend.ts` | Which single action recovers the most money |
| `enrich.ts` | Joins all of the above onto a batch, once |
| `fefo.ts`, `counter.ts` | First Expiry First Out, and why each batch is or is not next |
| `approvals.ts` | The two-person rule |
| `password.ts` | The password policy, shared by the browser and the server |
| `select.ts`, `calendar.ts`, `suppliers.ts`, `reports.ts` | Filtering, grouping, chart shapes |
| `sim.ts`, `factors.ts` | The what-if panel and the model's own explanation |

### Screens

| # | Route | What it is for |
|---|---|---|
| 01 | `/` | Today — the ledger, the shelf calendar, what to decide now |
| 02 | `/batches` | The register: search, filter, sort, receive a batch |
| 03 | `/batches/[id]` | One batch: risk, factors, recommendation, shelf life, movement |
| 04 | `/counter` | Counter sale — FEFO picking, cart, complete sale |
| 05 | `/medicines` | The catalogue: search, add and edit what the pharmacy stocks |
| 06 | `/suppliers` | Suppliers and their return windows, plus per-supplier exposure |
| 07 | `/approvals` | The two-person queue |
| 08 | `/reports` | Month to date: recovered, discounted, written off, still at risk |
| 09 | `/risk-model` | The model itself: simulator, metrics, weights, failure modes |

A batch belongs to a medicine and a supplier, so those two come first. The
register's **Receive batch** form only offers what is already on file, and says
where to add it when the list is empty — a batch with no owner is not a batch.

| Auth route | What it is for |
|---|---|
| `/signin` | Email and password |
| `/signup` | First account owns the pharmacy; live password-policy meter |
| `/forgot-password` | Requests a single-use link, 30 minutes |
| `/reset-password` | Sets the new password and kills the link |

---

## The risk model

> "What is the chance this batch does **not** sell out before it expires?"

A logistic regression, written by hand — four terms, no library, no API.

```
sell_rate = (0.6 × units/day over 30d  +  0.4 × units/day over 7d)
            × (1 + discount% / 25)

coverage  = min(2, sell_rate × days_to_expiry / stock_on_hand)
remaining = stock_on_hand / quantity_received

z = 2.40  −  3.40 × coverage  +  1.10 × remaining  +  0.70 × (days ≤ 30)
p = 1 / (1 + e^−z)
```

**Coverage is the feature that matters** — it asks whether the pace of sales
covers the stock in the time left. The other terms nudge. An expired batch
scores 1 by definition; an empty one scores 0.

**Outputs** — a probability, a band (High ≥ 0.70, Medium ≥ 0.40, Low), the
expected unsold units, the value that represents at cost, and a recommended
action with the reason written out.

**Explanation, not a black box.** Every batch page shows the three terms at
their real signed size (`src/domain/factors.ts`), so you can see *why* a batch
scored what it did. `/risk-model` exposes the trained weights and a simulator
that runs the same `score()` function the batches do — not a copy of it.

**Evaluation.** Held out 20% of 214 finished batches, split by time rather than
at random, and compared against the rule a pharmacist already uses: *flag
anything under 30 days.*

| | Model | Rule of thumb |
|---|---|---|
| Accuracy | 0.86 | 0.71 |
| Precision | 0.81 | 0.63 |
| Recall | **0.89** | 0.52 |
| F1 | 0.85 | 0.57 |

Recall is favoured deliberately. A missed batch costs the full cost of the
stock; a false alarm costs a few seconds of someone's attention.

**Limitations**, stated on `/risk-model` as well as here:

1. **Seasons are invisible.** It only sees the last 30 days, so it over-flags
   cold and fever medicine in September.
2. **One bulk order skews the pace.** A single wholesale sale makes a slow
   batch look fast for a month.
3. **Thin history.** Under 50 finished batches the weights are unreliable, and
   the app falls back to the days-left rule.
4. It knows nothing outside the shop — competitor pricing, prescribing habits,
   supply shocks.

---

## Testing

98 tests, almost all against `src/domain`. They cover the places where being wrong
costs money, not the places that are easy to test.

- `status.test.ts` — every boundary: 91, 90, 31, 30, 1, 0, −1 days, and the
  closed-wins-over-everything rule
- `risk.test.ts` — the weighting, the discount effect, expired and empty edge
  cases, probability bounds, expected unsold units, band splits
- `fefo.test.ts` — the earliest expiry sells first, expired stock is blocked
- `counter.test.ts` — free stock after reservations, the queue rolling to the
  next batch, generic-name search
- `approvals.test.ts` — the two-person rule from all four angles
- `reports.test.ts` — no value lost between the bars and the beyond bucket,
  scaling with an all-zero set, the simulator agreeing with the model
- `model.test.ts` — the weights and metrics the API sends turned into bars and
  prose, including an unknown feature and a missing metric
- `password.test.ts` — every policy rule at its boundary, and a failing
  password never rating above "fair"
- `auth-schemas.test.ts` — email normalisation, the mismatch pointing at the
  confirm box, a weak password refused before it leaves the browser

```bash
pnpm test
```

### End to end

54 Playwright tests drive the built app in a real browser — not the dev server,
because prerendering, the route groups and the session guard all behave
differently under `next dev`.

```bash
pnpm test:e2e           # builds, then runs everything
pnpm test:e2e:ui        # the same, with the inspector
```

Playwright starts two servers: this app on `:3100`, and the backend's
`pnpm e2e:api` on `:5055` — deliberately **not** `:5000`, so a running
`pnpm dev` is never mistaken for the test API and never reseeded. Both halves
are real: these tests sign in against bcrypt, read batches over HTTP and write
sales to a database.

One database serves the whole run, so the suite is **serial**, and each test
reseeds first. That is slower than running in parallel and it is the honest
price of testing against a real server rather than a fixture.

- `auth.spec.ts` — the guard redirect and its `?next` return, identical answers
  for a wrong password and an unknown address, sign out, the session surviving
  a reload, sign up, and the whole forgot → reset → sign-in-again round trip
  including a link that refuses to work twice
- `approval-flow.spec.ts` — the two-person rule walked from the batch page to
  the closed batch: the pharmacist raises it and cannot decide it, the owner
  can, nobody approves their own, one pending request per batch, and an
  approved write-off emptying the shelf
- `counter.spec.ts` — FEFO picking the earliest expiry, expired stock never
  reaching the cart, the stock ceiling, the tab badge, and a completed sale
  taking the units off the shelf
- `catalogue.spec.ts` — a medicine the pharmacy did not have is added and then
  received against, a duplicate is refused with the message under the right
  input, a supplier is added and its return window reaches a new batch, and —
  against a database emptied to nothing but the owner — a pharmacy stocks
  itself from scratch: medicine, supplier, first batch, first sale
- `screens.spec.ts` — every screen renders its own work, filters carry across
  screens, the simulator reacts, unknown batches and routes are answered
- `responsive.spec.ts` — a phone viewport: nothing scrolls sideways except the
  register inside its own card, and the counter still sells

Three bugs came out of writing these, all now fixed: a link inside a `<label>`
that stole the field's accessible name, a visually-hidden badge label that
escaped its scroll container and stretched the page 231px sideways on a phone,
and a register that forgot everything the moment you signed out.

---

## Performance and accessibility

- Every route is prerendered; batch pages use `generateStaticParams`
- Fonts are self-hosted by `next/font` — no third-party request, no CLS
- Theme is stamped before first paint, so dark mode never flashes white
- No chart library: bars are divs, the blister strip is rounded rectangles
- Status colour is never the only cue — a dot, a label or an icon always
  accompanies it, and every pairing clears WCAG AA against its background
- Dark and light palettes are defined as tokens and swapped at `:root`

---

## Notes and limits

- **Undo is gone.** It used to roll back a local snapshot. Once a sale or an
  approval is a row on a server, a client-side undo would be a lie — and the
  API has no reversal endpoint. A rejected request and a replaced discount do
  the same job honestly.
- **A received batch cannot be corrected.** `PATCH /batches/:id` accepts cost,
  price and expiry on the server, but no screen calls it — only the discount
  does. Type the wrong cost and the only way back is the database. This is the
  next thing to build.
- **Deleting is not wired up.** The API refuses to delete a medicine or
  supplier that still has batches, and offers deactivation instead; the screens
  only add and edit. Removing something you have bought from is a decision with
  a paper trail behind it, and that is a larger piece of work than it looks.
- **The list calls ask for 100 rows.** That is the server's cap and it covers a
  single pharmacy comfortably. Paging through the register is the next step.
- **The register derives its numbers in the browser.** `src/domain/` and the
  backend's `src/app/domain/` hold the same pure functions, and both test
  suites pin them, so the two agree. One shared package would be better.
- **Model training.** The weights are fixed constants; nothing retrains them.
- The seeded history is simulated, not from a real pharmacy.
