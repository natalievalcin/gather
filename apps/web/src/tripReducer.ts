import type { Activity, Day, Trip } from '@gather/shared'

export type TripAction =
  | { type: 'activityAdded'; dayId: string; activity: Activity }
  | { type: 'activityUpdated'; dayId: string; activity: Activity }
  | { type: 'activityDeleted'; dayId: string; activityId: string }

export function tripReducer(trip: Trip, action: TripAction): Trip {
  switch (action.type) {
    case 'activityAdded':
      return {
        ...trip,
        days: trip.days.map((day): Day =>
          day.id === action.dayId
            ? { ...day, activities: [...day.activities, action.activity] }
            : day,
        ),
      }
    case 'activityUpdated':
      return {
        ...trip,
        days: trip.days.map((day): Day =>
          day.id === action.dayId
            ? {
                ...day,
                activities: day.activities.map((activity) =>
                  activity.id === action.activity.id ? action.activity : activity,
                ),
              }
            : day,
        ),
      }
    case 'activityDeleted':
      return {
        ...trip,
        days: trip.days.map((day): Day =>
          day.id === action.dayId
            ? {
                ...day,
                activities: day.activities.filter((activity) => activity.id !== action.activityId),
              }
            : day,
        ),
      }
    default: {
      const unhandled: never = action
      throw new Error(`Unhandled action: ${JSON.stringify(unhandled)}`)
    }
  }
}
