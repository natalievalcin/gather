import type { Activity } from '@gather/shared'

type ActivityItemProps = {
  activity: Activity
  onDelete: (activityId: string) => void
}

export function ActivityItem({ activity, onDelete }: ActivityItemProps) {
  return (
    <li>
      {activity.title}
      <button
        type='button'
        aria-label={`Delete ${activity.title}`}
        onClick={() => onDelete(activity.id)}
      >Delete</button>
    </li>
  )
}
