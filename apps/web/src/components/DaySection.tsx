import type { Activity, Day } from '@gather/shared'
import { ActivityItem } from './ActivityItem'
import { ActivityForm } from './ActivityForm'
import type { MoveDirection } from '../tripReducer'
import { findTimeOrderProblems } from '../timeOrder'

type DaySectionProps = {
  day: Day
  editingActivityId: string | null
  onAddActivity: (dayId: string, activity: Activity) => void
  onDeleteActivity: (dayId: string, activityId: string) => void
  onUpdateActivity: (dayId: string, activity: Activity) => void
  onMoveActivity: (dayId: string, activityId: string, direction: MoveDirection) => void
  onStartEditing: (activityId: string) => void
  onStopEditing: () => void
}

export function DaySection({
  day,
  editingActivityId,
  onAddActivity,
  onDeleteActivity,
  onUpdateActivity,
  onMoveActivity,
  onStartEditing,
  onStopEditing,
}: DaySectionProps) {
  const problems = findTimeOrderProblems(day.activities)

  return (
    <section>
      <h2>
        {day.date} · {day.city}
      </h2>
      <div role='status'>
        {problems.length > 0 && (
          <ul>
            {problems.map((problem) => (
              <li key={`${problem.earlier.id}-${problem.later.id}`}>
                ⚠ {problem.later.title} ({problem.later.startTime}) is at or before{' '}
                {problem.earlier.title} ({problem.earlier.startTime})
              </li>
            ))}
          </ul>
        )}
      </div>
      <ul role='list' style={{ listStyle: 'none' }}>
        {day.activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isEditing={activity.id === editingActivityId}
            isFirst={index === 0}
            isLast={index === day.activities.length - 1}
            onEdit={() => onStartEditing(activity.id)}
            onCancel={onStopEditing}
            onSave={(values) => onUpdateActivity(day.id, { id: activity.id, ...values })}
            onMove={(direction) => onMoveActivity(day.id, activity.id, direction)}
            onDelete={() => onDeleteActivity(day.id, activity.id)}
          />
        ))}
      </ul>
      <ActivityForm
        submitLabel='Add'
        onSubmit={(values) => onAddActivity(day.id, { id: crypto.randomUUID(), ...values })}
      />
    </section>
  )
}
