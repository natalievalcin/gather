import type { Activity } from '@gather/shared'
import { ActivityForm } from './ActivityForm'

type ActivityItemProps = {
  activity: Activity
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onDelete: () => void
}

export function ActivityItem({ activity, isEditing, onEdit, onCancel, onDelete }: ActivityItemProps) {
  return (
    <li>
      {isEditing ? (
        <ActivityForm
          initialValues={activity}
          submitLabel='Save'
          onSubmit={onCancel}
          onCancel={onCancel}
        />
      ) : (
        <>
          {activity.startTime && <time>{activity.startTime} · </time>}
          {activity.title}
          <button
            type='button'
            aria-label={`Edit ${activity.title}`}
            onClick={onEdit}
          >Edit</button>
          <button
            type='button'
            aria-label={`Delete ${activity.title}`}
            onClick={onDelete}
          >Delete</button>
        </>
      )}

    </li>
  )
}
