import type { Trip } from '@gather/shared'

export const orlandoTrip: Trip = {
  id: 't1',
  name: 'Orlando Christmas Trip',
  days: [
    {
      id: 'd1',
      date: '2026-12-24',
      city: 'Orlando',
      activities: [
        {
          id: 'a1',
          title: 'Magic Kingdom',
          kind: 'sight',
        }
      ]
    },
    {
      id: 'd2',
      date: '2026-12-25',
      city: 'Orlando',
      activities: [
        {
          id: 'a2',
          title: 'Dinner',
          kind: 'meal',
          startTime: '18:00'
        }
      ]
    }
  ]
}
