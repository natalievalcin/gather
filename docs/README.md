# Docs

- `notes/`: "what I learned" notes, one per stage.
- `flows/`: how a feature behaves, with a table of decided edge cases. The code is the source of truth; if a flow doc and the code disagree, check the code, confirm what was intended, and fix whichever is wrong.

## Flows

- [Edit activity](flows/edit-activity.md): one activity editable at a time across the trip; switching discards the unsaved draft.
- [Reorder activities](flows/reorder-activities.md): move up/down within a day; out-of-order times are warned about, never blocked or changed.
