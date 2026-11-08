import type { Activity } from '@gather/shared'

type TimeOrderProblem = { earlier: Activity; later: Activity }

export function findTimeOrderProblems(activities: Activity[]): TimeOrderProblem[] {
  const problems: TimeOrderProblem[] = []
  let previous: Activity | undefined

  for (const activity of activities) {
    if (!activity.startTime) continue

    if (previous?.startTime && activity.startTime <= previous.startTime) {
      problems.push({ earlier: previous, later: activity })
    }
    previous = activity
  }
  return problems
}
