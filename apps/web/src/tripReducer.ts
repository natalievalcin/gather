import type { Activity, Day, Trip } from '@gather/shared'

export type TripAction =
  | { type: 'activityAdded'; dayId: string; activity: Activity }
  | { type: 'activityUpdated'; dayId: string; activity: Activity }
  | { type: 'activityDeleted'; dayId: string; activityId: string }

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
    default: {
      const unhandled: never = action
      throw new Error(`Unhandled action: ${JSON.stringify(unhandled)}`)
    }
  }
}
