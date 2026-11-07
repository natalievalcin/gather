import { useState } from 'react'
import { orlandoTrip } from './data/orlando'
import { DaySection } from './components/DaySection'
import type { Activity, Day } from '@gather/shared'

function App() {
  const [trip, setTrip] = useState(orlandoTrip)

  function addActivity(dayId: string, activity: Activity) {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((day): Day =>
        day.id === dayId
        ? { ...day, activities: [...day.activities, activity] }
        : day
      )
    }))
  }

  return (
    <main>
      <h1>{trip.name}</h1>
      {trip.days.map((day) => (
        <DaySection key={day.id} day={day} onAddActivity={addActivity} />
      ))}
    </main>
  )
}

export default App
