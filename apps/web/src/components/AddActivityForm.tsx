import { type ActivityKind, ActivityKindSchema, type Activity } from '@gather/shared'
import { useId, useState, type ChangeEvent, type SubmitEvent } from 'react'

type AddActivityFormProps = {
  onAdd: (activity: Activity) => void
}

const DEFAULT_KIND: ActivityKind = 'sight'

const kindLabels: Record<ActivityKind, string> = {
  sight: 'Sight',
  meal: 'Meal',
  stay: 'Stay',
  transport: 'Transport',
}

export function AddActivityForm({ onAdd }: AddActivityFormProps) {
  const titleId = useId()
  const kindId = useId()
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<ActivityKind>(DEFAULT_KIND)

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value)
  }

  function handleKindChange(event: ChangeEvent<HTMLSelectElement>) {
    setKind(ActivityKindSchema.parse(event.target.value))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const newActivity: Activity = {
      id: crypto.randomUUID(),
      title,
      kind,
    }
    onAdd(newActivity)

    setTitle('')
    setKind(DEFAULT_KIND)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={titleId}>Title</label>
      <input
        id={titleId}
        value={title}
        onChange={handleTitleChange}
      />
      <label htmlFor={kindId}>Kind</label>
      <select
        id={kindId}
        value={kind}
        onChange={handleKindChange}
      >
        {ActivityKindSchema.options.map((option) => (
          <option key={option} value={option}>{kindLabels[option]}</option>
        ))}
      </select>
      <button
        type='submit'
        disabled={title.trim() === ''}
      >Add</button>
    </form>
  )
}
