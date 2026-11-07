import type { Activity } from '@gather/shared'
import { useId, useState, type ChangeEvent, type SubmitEvent } from 'react'

type AddActivityFormProps = {
  onAdd: (activity: Activity) => void
}

export function AddActivityForm({ onAdd }: AddActivityFormProps) {
  const titleId = useId()
  const [title, setTitle] = useState('')

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value)
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const newActivity: Activity = {
      id: crypto.randomUUID(),
      title,
      kind: 'sight',
    }
    onAdd(newActivity)

    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={titleId}>Title</label>
      <input
        id={titleId}
        value={title}
        onChange={handleTitleChange}
      />
      <button
        type='submit'
        disabled={title.trim() === ''}
      >Add</button>
    </form>
  )
}
