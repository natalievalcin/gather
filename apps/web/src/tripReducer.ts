import type { Activity, Day, Trip } from '@gather/shared'

export type MoveDirection = 'up' | 'down'

export type TripAction =
  | { type: 'activityAdded'; dayId: string; activity: Activity }
  | { type: 'activityUpdated'; dayId: string; activity: Activity }
  | { type: 'activityDeleted'; dayId: string; activityId: string }
  | { type: 'activityMoved'; dayId: string; activityId: string; direction: MoveDirection }

function updateDay(trip: Trip, dayId: string, change: (day: Day) => Day): Trip {
  return {
    ...trip,
    days: trip.days.map((day) => (day.id === dayId ? change(day) : day)),
  }
}

export function tripReducer(trip: Trip, action: TripAction): Trip {
  switch (action.type) {
    case 'activityAdded':
      return updateDay(trip, action.dayId, (day) => ({
        ...day,
        activities: [...day.activities, action.activity],
      }))
    case 'activityUpdated':
      return updateDay(trip, action.dayId, (day) => ({
        ...day,
        activities: day.activities.map((activity) =>
          activity.id === action.activity.id ? action.activity : activity,
        ),
      }))
    case 'activityDeleted':
      return updateDay(trip, action.dayId, (day) => ({
        ...day,
        activities: day.activities.filter((activity) => activity.id !== action.activityId),
      }))
    case 'activityMoved':
      return updateDay(trip, action.dayId, (day) => {
        const from = day.activities.findIndex((activity) => activity.id === action.activityId)
        const to = action.direction === 'up' ? from - 1 : from + 1
        const moving = day.activities[from]
        const other = day.activities[to]
        if (!moving || !other) return day
        return {
          ...day,
          activities: day.activities.map((activity, index) =>
            index === from ? other : index === to ? moving : activity,
          ),
        }
      })
    default: {
      const unhandled: never = action
      throw new Error(`Unhandled action: ${JSON.stringify(unhandled)}`)
    }
  }
}
