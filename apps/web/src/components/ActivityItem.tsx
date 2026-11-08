import type { Activity, NewActivity } from '@gather/shared'
import { ActivityForm } from './ActivityForm'
import type { MoveDirection } from '../tripReducer'

type ActivityItemProps = {
  activity: Activity
  isEditing: boolean
  isFirst: boolean
  isLast: boolean
  onEdit: () => void
  onSave: (values: NewActivity) => void
  onCancel: () => void
  onMove: (direction: MoveDirection) => void
  onDelete: () => void
}

export function ActivityItem({
  activity,
  isEditing,
  isFirst,
  isLast,
  onEdit,
  onSave,
  onCancel,
  onMove,
  onDelete,
}: ActivityItemProps) {
  return (
    <li>
      {isEditing ? (
        <ActivityForm
          initialValues={activity}
          submitLabel='Save'
          onSubmit={onSave}
          onCancel={onCancel}
        />
      ) : (
        <>
          {activity.startTime && <time>{activity.startTime} · </time>}
          {activity.title}
          <button type='button' aria-label={`Edit ${activity.title}`} onClick={onEdit}>
            Edit
          </button>
          <button type='button' aria-label={`Delete ${activity.title}`} onClick={onDelete}>
            Delete
          </button>
          <button
            type='button'
            aria-label={`Move ${activity.title} up`}
            disabled={isFirst}
            onClick={() => onMove('up')}
          >
            ↑
          </button>
          <button
            type='button'
            aria-label={`Move ${activity.title} down`}
            disabled={isLast}
            onClick={() => onMove('down')}
          >
            ↓
          </button>
        </>
      )}
    </li>
  )
}
