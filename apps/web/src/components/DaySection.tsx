import type { Activity, Day } from '@gather/shared'
import { ActivityItem } from './ActivityItem'
import { AddActivityForm } from './AddActivityForm'

type DaySectionProps = {
  day: Day
  onAddActivity: (dayId: string, activity: Activity) => void
  onDeleteActivity: (dayId: string, activityId: string) => void
}

export function DaySection({ day, onAddActivity, onDeleteActivity }: DaySectionProps) {
  return (
    <section>
      <h2>{day.date} · {day.city}</h2>
      <ul role='list' style={{ listStyle: 'none' }}>
        {day.activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} onDelete={() => onDeleteActivity(day.id, activity.id)}/>
        ))}
      </ul>
      <AddActivityForm onAdd={(activity) => onAddActivity(day.id, activity)} />
    </section>
  )
}
