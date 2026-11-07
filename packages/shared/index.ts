export type ActivityKind =
  | 'sight'
  | 'meal'
  | 'stay'
  | 'transport'

export type Activity = {
  id: string
  title: string
  kind: ActivityKind
  /** Local wall-clock time at the day's city, 'HH:MM' */
  startTime?: string
}

export type Day = {
  id: string
  /** Calendar date, 'YYYY-MM-DD' (no time, no time zone) */
  date: string
  city: string
  activities: Activity[]
}

export type Trip = {
  id: string
  name: string
  days: Day[]
}
