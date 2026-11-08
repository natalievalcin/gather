# What I Learned In Stage 2

Stage 2: add, delete and edit activities with a form. Zod validation, controlled inputs, events. Still no saving, the trip lives in React state and resets on reload.

## Where state lives

The trip moved into `useState` in **App**. Why App and not a smaller component? Every day needs to show it and every form needs to change it. App is the closest component above all of them. Rule: **lift state only as far as it needs to go.**

Each component instance has its **own** state. I typed in the Dec 23 form and nothing appeared in Dec 24, because every form keeps its own title and only edits that.

## Data down, events up

Data goes down as props. Changes go up as function props. The child doesn't change the trip, it *tells* App what happened and App changes it.

How I figured out the wiring: I started in the form, realized the form doesn't have the trip, and went **backwards** up the tree until I found who owns it. Then I asked at each level, "what does this component know that the one above doesn't?" DaySection knows the day, so it adds `day.id` on the way up. I said: "I don't want App to check every day so I will pass the day along."

## Functions are things (this was the hard one)

- `sayHi` is the function itself, like a recipe card. `sayHi()` **runs** it.
- `onClick={onEdit}` hands the function over. `onClick={onEdit()}` would run it right away and hand over the result. Wrong.
- Parentheses do two jobs. **Before `=>`** they say what the function receives: `()` means nothing. **After a name** they run it with arguments: `onStartEditing(activity.id)`.
- **The caller gives, the function receives.** The Delete button gives `onDelete` nothing.
- **The arrow exists to fill in what's missing.** The Edit button gives nothing, but App needs an id, so DaySection wraps it: `() => onStartEditing(activity.id)`. If the function already gets what it needs, pass it directly: `onSubmit={onSave}`.
- Where does `activity.id` come from if nobody passes it in? The arrow is written inside the `.map`, so it **remembers** `activity`. That's a closure. Like a speed-dial button: you press it with no input, the number is already stored inside.
- One function can have different names at each level: `onSubmit` in the form, `onSave` in ActivityItem, then the arrow in DaySection.
- I asked "so the parenthesis belongs to onEdit?" Yes. The empty `()` in `() => onStartEditing(activity.id)` are onEdit's inputs, and they match `onEdit: () => void` in the props type.

I only really got this when I ran tiny plain-JS examples (`doorbell(openDoor)`) in the browser console.

## Updating state without changing it

You never edit the trip, you build a new one: spread (`...`), `.map`, `.filter`.

| Want | Method |
| --- | --- |
| add one | `[...day.activities, activity]` |
| remove one | `.filter` (keep everything except it) |
| replace one | `.map` (same length, same order, one swapped) |

I asked "should it be `find`?" No, `find` gives back **one item**, not the list. I also once used `.filter` on the **days** and deleted the whole day. Map the days, then change that day's activities.

## Forms

- **Controlled input:** React state is the value, `onChange` updates it. `value={undefined}` means "not controlled," which is why `startTime` needs `?? ''`. Without it React warns "changing an uncontrolled input to be controlled." `tsc` didn't catch it.
- `event.preventDefault()` stops the page from reloading on submit.
- `useId()` for label `htmlFor` ids, so two forms on the page don't share an id.
- Every `<button>` inside a `<form>` is **submit by default**. Cancel needs `type='button'` or it saves.
- `?.` stops if the left side is undefined. `??` gives a fallback if it's undefined or null.

## Zod

- `z.enum([...])` for kinds, `.options` to list them, `z.infer` to get the type. The schema is the one source of truth, the type comes from it.
- `Record<ActivityKind, string>` for the labels: if I add a kind and forget a label, `tsc` fails.
- **Parse, don't validate.** `safeParse` gives back cleaned data (`'  Epcot '` becomes `'Epcot'`). Use `result.data`, never the raw values.
- `result` is one of two shapes: `success: true` with `data`, or `success: false` with `error.issues`. After `if (!result.success) return`, TypeScript knows it's the good shape.
- Zod collects **every** problem, not just the first, so the user fixes everything in one go. That's why `issues` is an array and I loop over it.
- Convert at the edge: inside the form "no time" is `''`. It only becomes `undefined` when I build the object for Zod.
- The same schema will check input on the server in stage 4, because anyone can send anything with `curl`. The form isn't the only way in.

## Widening

`useState('sight')` made `kind` a `string`, not `ActivityKind`. I asked "shouldn't it be 'sight' which I have?" TypeScript guesses loosely. Fix: **annotate where you create it** (`useState<ActivityKind>(...)`). Same for `useState<string | null>(null)`, otherwise it's stuck as `null` forever.

## Accessibility

- Disabled buttons are bad for errors: they don't say what's wrong, and keyboard users can't even Tab to them. Show a message instead.
- `aria-invalid` says "this field has a problem." `aria-describedby` points at the message so a screen reader reads it.
- ``aria-label={`Delete ${activity.title}`}`` so "Delete" says *which* one.

## Reusing the form for edit

My first idea was a mode prop (add or edit). Problem: `if (mode === 'edit')` everywhere, and `isNew` plus `initialValues` could contradict each other (two sources of truth again). Better: **props describe what's different, not which mode**: `initialValues?`, `submitLabel`, `onCancel?`.

The riskiest part was the id. The form shouldn't make it. It hands back `NewActivity` (no id) and **the caller decides**: a new uuid for add, the same id for edit.

## One edit form at a time

I said "I only want one open at a time." So the state went up to App as `editingActivityId: string | null`. One variable can't hold two ids, so two open forms are **impossible**, no extra code needed. Each item gets a derived `isEditing` boolean, not the id.

**Unmounting:** when Dinner's form closes, its state is gone. If I typed 20:00 and opened Magic Kingdom, the 20:00 is lost and Dinner shows 18:00 again. I decided that's fine for now. Written down in `docs/flows/edit-activity.md`.

## JSX

- `&&` means "this or nothing." `? :` means "this or that." The edit item uses `? :` to show the form **or** the text.
- `<>…</>` is a Fragment: groups siblings without adding a real element.
- Careful with `count && …` when count can be `0`, React prints the 0.

## Reading errors

- Fix the **first** error and re-run. The second is often caused by the first (TS2322 on a prop, then TS7006 `any` on its parameter).
- 1xxx is syntax. TypeScript stops before checking types, so other errors hide until it's fixed.
- In the props type but not destructured = **silent**. `tsc` only complains when you *use* the name.
- **Types check shape, not meaning.** `{errors.title && <p>{errors.startTime}</p>}` compiled fine. Both are strings.

## What tripped me up

- `.filter` on days instead of activities, deleted whole days
- `activites` typo passed `tsc` (no excess property check through `.map`)
- `kind` widened to `string`
- `errors.title` checked under the time input
- `startTime` without `?? ''`
- Declared `initialValues` in the type but didn't destructure it
- `{ crypto.randomUUID(), ...activity }`: a value with no key, and the wrong variable name
- `git mv`, then saved the old tab in VS Code and recreated the file
- Committed without the shared file, so that commit didn't compile
- The callback wiring in step 5, until I went back to "a function is a thing"

## Tools to remember

- React DevTools → Components tab: see state change live (Cmd + Option + I, then the Components tab)
- `console.log` inside a handler to see what came in
- `git status` columns: left = staged, right = not staged. `RM` means the rename is staged but not my edits.
- `git commit --amend --no-edit` to add a missed file, **only** before pushing
- Stage files by name instead of `git add .`, so one concept per commit
- `git log --follow <file>` to see history across a rename

## Left for later

- `addActivity` / `deleteActivity` / `updateActivity` are hard to read with the nested map. I decided to leave it for `useReducer` in stage 3.
- The edge cases in the flow doc have no tests yet (stage 10).
