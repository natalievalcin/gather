import { useReducer, useState } from 'react'
import { orlandoTrip } from './data/orlando'
import { DaySection } from './components/DaySection'
import type { Activity } from '@gather/shared'
import { tripReducer } from './tripReducer'

function App() {
  const [trip, dispatch] = useReducer(tripReducer, orlandoTrip)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)

  function addActivity(dayId: string, activity: Activity) {
    dispatch({ type: 'activityAdded', dayId, activity })
  }

  function deleteActivity(dayId: string, activityId: string) {
    dispatch({ type: 'activityDeleted', dayId, activityId })
  }

  function updateActivity(dayId: string, updated: Activity) {
    dispatch({ type: 'activityUpdated', dayId, activity: updated })
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
