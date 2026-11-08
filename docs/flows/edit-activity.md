# Edit activity flow

> Source of truth is the code. If this doc and the code disagree, verify against the
> code, confirm intent with the owner, and update whichever is wrong. See docs/README.md.

**Status:** implemented (stage 2 step 5) · **Last decided:** 2026-11-08
**Owner(s):** Natalie · **Code:** `apps/web/src/App.tsx`, `apps/web/src/components/DaySection.tsx`, `apps/web/src/components/ActivityItem.tsx`, `apps/web/src/components/ActivityForm.tsx`

## Purpose

Let the trip organizer change an existing activity's title, kind or start time in
place, without changing its id or its position in the day.

## State machine / happy path

```
viewing ──Edit──▶ editing ──Save (valid)──▶ viewing (activity replaced in the trip)
                     │
                     ├──Save (invalid)──▶ editing (error messages shown, trip unchanged)
                     ├──Cancel─────────▶ viewing (trip unchanged)
                     └──Edit on another─▶ that one is editing, this one is viewing (draft discarded)
```

- App holds `editingActivityId: string | null`. `null` means nothing is open.
  Only one id can be stored, so only one activity can be edited at a time across
  the whole trip.
- Each item gets `isEditing` (a boolean derived as `activity.id === editingActivityId`),
  not the id itself.
- While editing, the form holds a **draft copy** in its own state, started from
  the activity's saved values. Typing never changes the trip.
- Save validates with `NewActivitySchema`, keeps the activity's existing id, and
  replaces it in the same place in its day.

## Edge-case decision table

| Scenario                                                     | Current behavior                                               | Decided behavior                                                               | Status | Test |
| ------------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------ | ---- |
| Click Edit on a second activity while one is open            | `editingActivityId` is replaced, so the first form closes      | The first form closes; only the second is open                                 | built  | TODO |
| Unsaved changes in the open form when another is opened      | The closed form unmounts and its state is gone                 | The draft is discarded; reopening shows the saved values                       | built  | TODO |
| Click Save on one activity while another had unsaved changes | Only the submitted form calls `onSubmit`                       | Only the submitted activity is saved; the other's draft never reaches the trip | built  | TODO |
| Click Cancel                                                 | `stopEditing()` sets `editingActivityId` to `null`             | The form closes; the trip is unchanged (it was never changed by typing)        | built  | TODO |
| Save with an invalid title or time                           | `safeParse` fails, errors are shown, `onSubmit` is not called  | The form stays open with error messages; the trip is unchanged                 | built  | TODO |
| Save a valid edit                                            | `updateActivity` replaces it with `.map`, then `stopEditing()` | Same id, same position in the day; title, kind and time replaced               | built  | TODO |

## Alternatives considered

- **`isEditing` in each `ActivityItem`:** simplest, but several forms could be open at once.
- **`editingActivityId` in `DaySection`:** one open form per day, not per trip.
- **Keep drafts in App:** reopening would restore unsaved changes, but needs one draft per activity in App's state.
- **Ask before discarding** ("Discard changes to Dinner?"): the likely fix if users lose work. Could come with stage 5's undo work.

## Open questions

none
