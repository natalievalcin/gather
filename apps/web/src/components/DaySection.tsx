import type { Day } from '@gather/shared'
import { ActivityItem } from './ActivityItem'
import { AddActivityForm } from './AddActivityForm'

type DaySectionProps = {
  day: Day
}

export function DaySection({ day }: DaySectionProps) {
  return (
    <section>
      <h2>{day.date} · {day.city}</h2>
      <ul role='list' style={{ listStyle: 'none' }}>
        {day.activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </ul>
      <AddActivityForm />
    </section>
  )
}
