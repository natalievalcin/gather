# Reorder activities flow

> Source of truth is the code. If this doc and the code disagree, verify against the
> code, confirm intent with the owner, and update whichever is wrong. See docs/README.md.

**Status:** draft (decided, being built in stage 3) · **Last decided:** 2026-11-08
**Owner(s):** Natalie · **Code:** `apps/web/src/tripReducer.ts`, `apps/web/src/components/DaySection.tsx`, `apps/web/src/components/ActivityItem.tsx`

## Purpose

Let the trip organizer change the order of activities within a day with Move up and
Move down buttons, without the app blocking or guessing, and point out when the order
no longer matches the start times.

## State machine / happy path

- Order is the position in `day.activities`. There is no stored `position` on the client.
- Move up / Move down dispatches `{ type: 'activityMoved', dayId, activityId, direction: 'up' | 'down' }`.
- The reducer swaps the activity with its neighbor. Ids and times never change.
- The "out of time order" warning is **derived** on every render, never stored: walking
  the day in order, each activity that has a start time must be later than the
  last activity before it that had a start time. Activities without a time are skipped.

## Edge-case decision table

| Scenario                                                                   | Current behavior | Decided behavior                                                                                                      | Status  | Test |
| -------------------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------- | ------- | ---- |
| Move makes start times go backwards (Fireworks 21:00 above Lunch 12:00)    | not built        | The move happens; the day shows a warning naming both activities                                                      | decided | TODO |
| Move up on the first activity / down on the last                           | not built        | The button is disabled (the reason is visible); the reducer also returns the trip unchanged if such an action arrives | decided | TODO |
| Activity without a start time (Magic Kingdom)                              | not built        | Can sit anywhere; never causes a warning                                                                              | decided | TODO |
| Two activities with the same start time                                    | not built        | Warn: same time counts as a problem                                                                                   | decided | TODO |
| The warning's cause is fixed (time edited, activity moved back or deleted) | not built        | The warning disappears on the next render, because it is computed, not stored                                         | decided | TODO |

## Alternatives considered

- **Block moves that break time order:** annoying mid-edit; the organizer may be about to fix the time.
- **Sort by time automatically:** makes manual order pointless, and untimed activities have no place.
- **Change the time when moving:** the app guessing plans is worse than no help.
- **Store a `hasTimeProblem` flag:** every action (add, update, delete, move) would have to keep it in sync. Derived instead.

## Open questions

none
