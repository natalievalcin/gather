import { useState } from 'react'
import { orlandoTrip } from './data/orlando'
import { DaySection } from './components/DaySection'
import type { Activity, Day } from '@gather/shared'

function App() {
  const [trip, setTrip] = useState(orlandoTrip)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)

  function addActivity(dayId: string, activity: Activity) {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((day): Day =>
        day.id === dayId ? { ...day, activities: [...day.activities, activity] } : day,
      ),
    }))
  }

  function deleteActivity(dayId: string, activityId: string) {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((day): Day =>
        day.id === dayId
          ? { ...day, activities: day.activities.filter((activity) => activity.id !== activityId) }
          : day,
      ),
    }))
  }

  function updateActivity(dayId: string, updated: Activity) {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((day): Day =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.map((activity) =>
                activity.id === updated.id ? updated : activity,
              ),
            }
          : day,
      ),
    }))
    stopEditing()
  }

  function startEditing(activityId: string) {
    setEditingActivityId(activityId)
  }

  function stopEditing() {
    setEditingActivityId(null)
  }

  return (
    <main>
      <h1>{trip.name}</h1>
      {trip.days.map((day) => (
        <DaySection
          key={day.id}
          day={day}
          editingActivityId={editingActivityId}
          onAddActivity={addActivity}
          onDeleteActivity={deleteActivity}
          onUpdateActivity={updateActivity}
          onStartEditing={startEditing}
          onStopEditing={stopEditing}
        />
      ))}
    </main>
  )
}

export default App
