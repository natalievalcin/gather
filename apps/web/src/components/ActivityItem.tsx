import type { Activity } from '@gather/shared'

type ActivityItemProps = {
  activity: Activity
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <li>{activity.title}</li>
  )
}
