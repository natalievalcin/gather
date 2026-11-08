import { z } from 'zod'

export const ActivityKindSchema = z.enum([
  'sight',
  'meal',
  'stay',
  'transport'
])
export type ActivityKind = z.infer<typeof ActivityKindSchema>

export const ActivitySchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, 'Title is required').max(100, 'Keep it under 100 characters'),
  kind: ActivityKindSchema,
  /** Local wall-clock time at the day's city, 'HH:MM' */
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM').optional()
})
export type Activity = z.infer<typeof ActivitySchema>

export const NewActivitySchema = ActivitySchema.omit({ id: true })

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
