# Gather

Gather is a trip planner that holds a whole trip in one place: cities, days, activities, costs and packing. The primary user is the trip organizer, the one person in a friend group or family who plans the trip.

**This is a learning project.** Its first purpose is for Natalie to learn TypeScript and React deeply, project-driven. Its second purpose is to be a real, usable product (open to strangers within a year) and a resume piece. When those two goals conflict, learning wins.

## How to work with me on this repo

- **Coach, don't autopilot.** For anything on the learning map (below), explain the concept first, then let me write the code. Offer to review what I wrote rather than writing it for me. If I ask you to just write it, do so, but add a short note on what I should understand about it.
- **Ask before architecture changes.** The data model, API shape and state design are decided (see `docs/`). Don't change them silently; propose the change and the tradeoff.
- **Review like a senior engineer.** When I ask for a review, point out what's wrong, what's risky, and what's fine but could be better, in that order. Ask me questions that make me think, not only fixes.
- **Keep diffs small.** One concept per commit. Don't refactor files I didn't ask about.
- **Push back.** If I'm about to do something that undermines the design or the learning, say so.

## Stack (decided, don't swap)

- **Frontend:** Vite + React 19 + TypeScript (strict), in `apps/web`. No server-side rendering.
- **Backend:** Express in TypeScript, in `apps/api`. Own authentication (sessions in Postgres, HTTP-only cookie, argon2 for passwords). Never custom crypto.
- **Database:** Postgres. Docker locally, Render in production. Drizzle ORM for queries and migrations (chosen over Prisma to keep SQL visible).
- **Shared types:** `packages/shared` (`@gather/shared`), imported by both apps.
- **Server state:** TanStack Query. **Local UI state:** URL for view and filters, Zustand or `useReducer` for the undo stack and multi-step flows.
- **Validation:** Zod on every API input and on the frontend forms, schemas produce the types.
- **Drag and drop:** dnd-kit. **Map:** Mapbox (key restricted to our domain). **Currency rates:** a free rates API (Frankfurter), refreshed daily by a background job.
- **No Redis in v1.** Sessions, idempotency keys and the job queue are Postgres tables.
- **Tests:** Vitest, React Testing Library, API tests against a real test database.
- **Hosting:** Render (API, Postgres, frontend). Public GitHub repo.

## Monorepo layout

```
gather/
  apps/
    web/        Vite + React frontend
    api/        Express API (added at stage 4)
  packages/
    shared/     types and Zod schemas shared by both apps
  docs/         product breakdown and system design (exported from the design doc)
```

Run everything from the root: `npm install` once, `npm run dev --workspace=apps/web`.

## TypeScript rules

- `strict: true`, plus `noUncheckedIndexedAccess` and `noImplicitOverride`.
- **Zero `any`.** Use `unknown` and narrow.
- Prefer `type` for data shapes and unions, `interface` only when something will be extended.
- Activity `kind` is a union of literals (`'sight' | 'meal' | 'stay' | 'transport'`), not an enum.
- Cost status is a discriminated union: `planned` (converts at current rate) vs `paid` (rate locked when marked paid).
- Money is a branded type; never add two amounts in different currencies.
- Exhaustive `switch` with a `never` check on every union.
- Derive state instead of storing it (day and trip totals are computed, never saved on the client).

## React rules

- Function components and hooks only.
- `useEffect` is a last resort; before reaching for it, ask whether this is derived state, an event handler, or a TanStack Query concern.
- Optimistic updates for drag, edit and packing toggles: snapshot the cached trip, apply, send, roll back on final failure.
- Every write sends an `Idempotency-Key` header.
- Keep components small; lift state only as far as it needs to go.
- Accessibility is not optional: keyboard support for drag and drop, labels on every input.

## Core concepts

- A **trip** owns **days** (one per date, each with a city) and a **packing list**.
- A **day** owns an ordered list of **activities**. Order is a fractional position (a decimal between neighbors), so a move is one row update. A background job renumbers when gaps get too small.
- An **activity** can carry **costs** (amount, currency, shared or personal, paid by whom). Moving an activity moves its costs with it.
- **Places** come from OpenStreetMap data in a large searchable table (full-text + PostGIS).

## Learning map (build in this order)

| Stage | Feature | Focus |
| --- | --- | --- |
| 1 | Static trip and day list (Orlando, Christmas 2026) | strict TS, typing data, components and lists |
| 2 | Add and edit an activity | Zod, controlled forms, event typing |
| 3 | Days with ordered activities | discriminated unions, `useReducer`, derived state |
| 4 | Save to the API | end-to-end types, generics, TanStack Query |
| 5 | Drag between days with undo | optimistic updates, undo stack, custom hooks |
| 6 | Paste a booking confirmation with review | parsing unknown input, type guards, multi-step flow |
| 7 | Costs and totals | branded types, exhaustive switch, memoization, profiling |
| 7b | Places search | large data, debounced search, indexes, EXPLAIN |
| 8 | Day / map / budget views with filters in the URL | typed URL params, context vs store |
| 9 | Packing lists and read-only share link | permissions, Suspense, error boundaries |
| 10 | Tests and polish | Vitest, RTL, accessibility |

After each stage I write a short "what I learned" note in `docs/notes/`. Remind me if I skip it.

## Privacy and security

- Trip dates and place names are encrypted at the application level (AES-256-GCM, one key from an environment variable, random nonce per value). Never commit keys or `.env` files.
- Every endpoint checks trip membership and role on the server. Hiding a button is not authorization.
- Validate all input with Zod. Rate limit per user and per IP.
- Collect the minimum data. No tracking beyond what the product needs.

## Commands

```bash
npm install                              # root, once
npm run dev --workspace=apps/web         # frontend dev server
npm run dev --workspace=apps/api         # API (from stage 4)
npm test                                 # all workspaces
```
