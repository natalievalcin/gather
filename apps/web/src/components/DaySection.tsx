import type { Activity, Day } from '@gather/shared'
import { ActivityItem } from './ActivityItem'
import { ActivityForm } from './ActivityForm'

type DaySectionProps = {
  day: Day
  editingActivityId: string | null
  onAddActivity: (dayId: string, activity: Activity) => void
  onDeleteActivity: (dayId: string, activityId: string) => void
  onUpdateActivity: (dayId: string, activity: Activity) => void
  onStartEditing: (activityId: string) => void
  onStopEditing: () => void
}

export function DaySection({
  day,
  editingActivityId,
  onAddActivity,
  onDeleteActivity,
  onUpdateActivity,
  onStartEditing,
  onStopEditing,
}: DaySectionProps) {
  return (
    <section>
      <h2>{day.date} · {day.city}</h2>
      <ul role='list' style={{ listStyle: 'none' }}>
        {day.activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isEditing={activity.id === editingActivityId}
            onEdit={() => onStartEditing(activity.id)}
            onCancel={onStopEditing}
            onSave={(values) => onUpdateActivity(day.id, { id: activity.id, ...values })}
            onDelete={() => onDeleteActivity(day.id, activity.id)}
          />
        ))}
      </ul>
      <ActivityForm submitLabel='Add' onSubmit={(values) => onAddActivity(day.id, { id: crypto.randomUUID(), ...values })} />
    </section>
  )
}
