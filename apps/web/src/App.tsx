import { useState } from 'react'
import { orlandoTrip } from './data/orlando'
import { DaySection } from './components/DaySection'

function App() {
  const [trip] = useState(orlandoTrip)

  return (
    <main>
      <h1>{trip.name}</h1>
      {trip.days.map((day) => (
        <DaySection key={day.id} day={day} />
      ))}
    </main>
  )
}

export default App
