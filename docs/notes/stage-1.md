# What I Learned In Stage 1

Stage 1: a static Orlando trip with typed data and components. No forms, no saving.

## How engineers decide what to do first

I asked "how do they know what to do first?" There's no magic, it's the same questions every time:

1. What does done look like? (something I can see, not the work)
2. Work backwards: what does that need? Screen ← components ← data ← types ← deciding what a trip/day/activity _is_. So you start with thinking, not code.
3. What's the riskiest part? Do it first. For us it was importing from `@gather/shared`, so we tested it with a tiny `sharedCheck` before writing real types.
4. What's the smallest step I can check? One day, one activity, then more.
5. What can I put off? Costs, packing, position, styling.

## Types

**`type` vs `interface`:** my rule for this project is `type` for data shapes. `interface` is only for things that get extended.

**Unions:** `ActivityKind` is `'sight' | 'meal' | 'stay' | 'transport'`. TypeScript only lets those exact strings through.

**Optional fields (`?`):** only when real data can actually be missing it. Magic Kingdom has no time, dinner does, so `startTime?` is optional. Every `?` means I have to handle the missing case wherever I use it.

**The compiler checks shapes, not meaning.** I wrote `activities: Day[]` by mistake and `tsc` passed, because a type that contains itself is legal. Writing the real Orlando data is what exposed it. Real data tests your types.

**Variable vs object:** I asked "I thought sharedCheck is a variable, why an object?" It's both. The variable is the name, the object is what's stored in it. `sharedCheck.message` reaches inside the object to get the string.

**Importing types:** I didn't need to import `SharedCheck`, because the type comes along with the value. You import a type by name when _you_ write it, like in props: `{ day }: { day: Day }`. Use `import type` so it gets erased at runtime.

## Date vs string

A `Date` is a **moment** in time, not a calendar day. `new Date('2026-12-24')` showed up as **Dec 23** in Orlando because it's read as midnight UTC. Also, JSON has no dates, so after an API it comes back as a string anyway.

A calendar day is a string: `'2026-12-24'`. No time zone, survives JSON, and it sorts correctly as text.

## Wall-clock time

I said dinner at 7 PM "is a moment." Half right. It _happens_ at a moment, but what I mean is "7 PM on the clock in Orlando," the same for everyone looking at the plan. So `startTime` is a string like `'19:00'`. You can work out the real moment later from date + time + the city's time zone. Flights are where real moments matter.

## Nested vs referenced data

- **Nested** (trip has `days`, day has `activities`): easy to render, because it's the same shape as the screen.
- **Referenced** (separate lists with `tripId` / `dayId`): easy to move things and how databases store data.

Neither is "right," you pick based on what you do most. Stage 1 only renders, so nested.

## Two sources of truth

I said I needed `position`. I didn't, because the array already holds the order. Storing it twice means they can disagree. Derive it, don't store it. `position` comes in stage 4 because database rows have no order.

## IDs

An ID identifies the thing, not where it is. Passport number, not seat number. I asked "does the activity id need to be unique if the day ids are unique?" Yes. In stage 5 when I drag dinner to another day, the ID has to stay the same and not collide.

I made the duplicate ID mistake **twice** (`a1`, then `a2`). TypeScript can't catch it, it only checks types, not values. When a bug happens twice, get a tool to catch it (database in stage 4, a test in stage 10).

## Keys in maps

When you use `.map` in JSX, each item needs a `key` so React can tell which item is which when the list changes.

- The key goes on the **outermost** element the `.map` returns. I put the `<ul>` inside the `.map` and the key on the `<li>`, so it didn't work. Also that made one list per activity.
- The key goes **where the `.map` is**, not inside the component. I left a `key` inside `DaySection` that did nothing.
- Use a stable `id`, not the array index.
- `tsc` and ESLint don't catch missing keys, the **browser console** does.

## Semantic HTML

Pick the element for what the content _is_, not how it looks. Date + city is one heading (`<h2>`). Activities are a list (`<ul>` / `<li>`), not headings. Screen readers use headings like a table of contents. If you hide bullets with CSS, add `role="list"` or Safari forgets it's a list.

## Components and props

A component is a function that returns JSX. Props are its input, one object. I type them with `type ActivityItemProps`, plural because it describes all the props.

Why `ActivityItem` exists: you draw boxes around the screen and they match the data, Trip → Day → Activity. A piece gets its own component when it has a name, repeats, makes the parent hard to read, or will have its own behavior. Honestly, `ActivityItem` is tiny right now. I extracted it because I know it'll get edit, drag and costs later.

## Refactor

Splitting into components should change _nothing_ on the screen. If the page looks exactly the same, the refactor worked.

## What tripped me up

- `Day[]` instead of `Activity[]`, and `tsc` was fine with it
- Duplicate IDs, twice
- `<ul>` inside the `.map`
- Leftover `key` inside a component
- Days out of order (Dec 23 after Christmas!)
- The page went blank after `npm install` because the tab was stale. A hard reload fixed it.

## Tools to remember

- `npx tsc -b`: no output means it passed
- `npx tsc --showConfig -p <file>`: see the final tsconfig settings
- `git check-ignore -v <file>`: which `.gitignore` rule matched
- Browser console (Cmd + Option + J): runtime errors and key warnings
- Hover in VS Code: shows JSDoc comments like the date format
