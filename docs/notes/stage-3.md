# What I Learned In Stage 3

Stage 3: move activities up and down in a day, warn when the times are out of order, and move every trip change into a reducer. Still no saving.

## Reducers

I said "I never heard of Reducer, so I don't know what is needed in the hook and what the function is supposed to do." The restaurant made it click:

- **Waiter** = App's functions. They only write a **ticket** now: `dispatch({ type: 'activityDeleted', dayId, activityId })`.
- **Ticket** = an **action**, a plain object that says _what happened_. Named in the past tense.
- **Kitchen** = the **reducer**, one function that reads the ticket and **returns** the new trip.

A reducer is just `(current state, action) => new state`. No React in it. I tried a tiny `listReducer` in the console first.

`useReducer(tripReducer, orlandoTrip)` needs two things: the kitchen and the starting value. It gives back `[trip, dispatch]`. `dispatch(ticket)` makes React call the reducer, store what it returns, and re-render.

Two rules for reducers:

1. **Return** the new trip. Never call `setTrip`, it doesn't even exist in that file.
2. No side effects. No `stopEditing()`, no `crypto.randomUUID()`. Same trip + same action = same result. Closing the form stays in App, and the id is already made in DaySection (stage 2's 5a paid off again).

After the refactor, each App function went from ~10 lines of nested `.map` to one line. DaySection, ActivityItem and the form **didn't change at all**. A refactor that stays inside one file means the design is working.

## Discriminated unions

`TripAction` is several shapes, each with a different literal `type`. `switch (action.type)` narrows it: inside `case 'activityDeleted'` TypeScript knows `action.activityId` exists, inside `case 'activityAdded'` it doesn't. Same thing as Zod's `result.success` in stage 2.

**The `never` check:** in `default`, `const unhandled: never = action`. If every case is handled, nothing is left, so `action` is `never`. If I add an action and forget its case, `tsc` points at that line and names the missing shape. Same idea as `Record<ActivityKind, string>`.

A bare `return` gives back `undefined`. If the function promises `: Trip`, every path has to return a trip.

## updateDay: a helper that takes a function

All three cases had the same frame: copy the trip, map the days, change the matching one. Only the middle was different. So the frame went into `updateDay(trip, dayId, change)`, and each case hands it **a function** that says what to do to the day. `updateDay` is the caller, it gives the matching day to my function and puts back what it returns.

Arrow gotcha: `(day) => ({ ...day })` needs the parentheses to return an object. Without them `{` starts a function body. When I need a few steps first (like the move case), I use `(day) => { ...; return ... }` on purpose.

Each case is now only what's different:

| Case    | `day.activities`                       |
| ------- | -------------------------------------- |
| added   | `[...day.activities, action.activity]` |
| updated | `.map` to replace one                  |
| deleted | `.filter` to remove one                |

## Moving up and down

Order is the position in the array (stage 1: don't store `position`). Moving = swapping two neighbors.

- `findIndex` gives the **position**, or `-1` if not found.
- `day.activities[i]` is `Activity | undefined` because of `noUncheckedIndexedAccess`. That turned out useful: **one check** `if (!moving || !other) return day` covers moving the first one up, the last one down, and an unknown id.
- `.map((activity, index) => …)` gives the position as a second argument.
- `MoveDirection = 'up' | 'down'` is defined once and imported everywhere. One source of truth for types too.

**This time the child gives something.** The ↑ button gives `'up'`, DaySection's arrow receives it and adds the two ids: `(direction) => onMoveActivity(day.id, activity.id, direction)`. Each level adds only what it knows. The button needs `() => onMove('up')` because the click gives an event, not a direction.

**Disabled buttons, again:** ↑ is disabled on the first item. That's fine here because the reason is obvious from looking at the list. In stage 2 it was bad because the user needed to know what to fix. And the reducer still guards it, because you never trust the screen to protect the data.

**Keys and focus:** after pressing ↑ with the keyboard, focus stayed on the button. That's because of the stable `key`: React moves the same element instead of redrawing two.

## Derived warning

I asked "what if moving makes the times not make sense?" Options were block it, sort automatically, change the time, or allow it and warn. I picked **warn**: I'm the organizer, the app should notice, not stop me or guess.

The warning is **computed every render**, never stored. If I stored `hasTimeProblem`, add, update, delete and move would all have to remember to update it. Four places to forget one.

I decided **the same time also warns** (`<=` instead of `<`). The whole decision is one character, which is why it's written in `docs/flows/reorder-activities.md`. Tradeoff: kids at the pool at 14:00 and parents at the spa at 14:00 will always warn.

- `'12:00' <= '21:00'` works as text because `'HH:MM'` has leading zeros.
- `problems.length > 0 &&`, not `problems.length &&`, or React prints a `0`.
- `role='status'` on a `<div>` that's **always** there, so screen readers announce the warning when it appears.

## How to write a loop (I asked to go through it like a junior engineer)

1. **Do it by hand** in a table with real data. Write down what you're holding in your head (`previous`) after each row.
2. **Write the steps as comments** before any code.
3. **Turn each comment into one line.**
4. **Check the code against the table.**

New things: `continue` skips to the next item. `let` when the variable gets reassigned, `const` when it doesn't (`.push` isn't reassigning). `let previous: Activity | undefined` because on the first loop there's nothing yet.

## Prettier

Prettier handles how code looks, ESLint handles whether it's likely wrong. Mine matches my style (no semicolons, single quotes). Pinned to an exact version so a teammate's machine doesn't reformat everything. Formatting got its own commit so real changes don't get buried in spacing noise. Formats on save now.

## What tripped me up

- Called `setTrip` inside the reducer, and imported `useReducer` there
- `(trip) =>` inside the reducer made a second `trip` that hid the real one
- A bare `return` in the move case
- A stray `}` closed the `switch` early (five 1xxx errors from one character)
- The update case had the **add** code. It would have compiled and made two Dinners with the same id
- `onMove` in the props type but not destructured (third time!). Add the name to the destructuring right when I add it to the type
- `activivty` typo in the action type, only caught where it's used
- `let previous: Activity` without `| undefined`

## Tools to remember

- `npm run format` / `npm run format:check`
- `git add -u`: stage changes to tracked files only, leaves new files out
- React DevTools shows the trip under **Reducer** now
- Temporarily comment out a case to watch the `never` check fire

## Left for later

- Moving activities **between days** is stage 5 (drag and drop), with its own action
- The flow doc edge cases still have no tests (stage 10)
