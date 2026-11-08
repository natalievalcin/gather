import { type ActivityKind, ActivityKindSchema, NewActivitySchema, type NewActivity } from '@gather/shared'
import { useId, useState, type ChangeEvent, type SubmitEvent } from 'react'

type AddActivityFormProps = {
  onSubmit: (values: NewActivity) => void
}

const DEFAULT_KIND: ActivityKind = 'sight'

const kindLabels: Record<ActivityKind, string> = {
  sight: 'Sight',
  meal: 'Meal',
  stay: 'Stay',
  transport: 'Transport',
}

type FormErrors = {
  title?: string
  startTime?: string
}

export function AddActivityForm({ onSubmit }: AddActivityFormProps) {
  const titleId = useId()
  const kindId = useId()
  const timeId = useId()
  const titleErrorId = useId()
  const timeErrorId = useId()
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<ActivityKind>(DEFAULT_KIND)
  const [startTime, setStartTime] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value)
  }

  function handleKindChange(event: ChangeEvent<HTMLSelectElement>) {
    setKind(ActivityKindSchema.parse(event.target.value))
  }

  function handleTimeChange(event: ChangeEvent<HTMLInputElement>) {
    setStartTime(event.target.value)
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = NewActivitySchema.safeParse({
      title,
      kind,
      startTime: startTime === '' ? undefined : startTime,
    })

    if (!result.success) {
      const nextErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (field === 'title' || field === 'startTime') {
          nextErrors[field] = issue.message
        }
      }
      setErrors(nextErrors)
      return
    }
    onSubmit(result.data)

    setTitle('')
    setKind(DEFAULT_KIND)
    setStartTime('')
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={titleId}>Title</label>
      <input
        id={titleId}
        aria-invalid={errors.title ? true : undefined}
        aria-describedby={errors.title ? titleErrorId : undefined}
        value={title}
        onChange={handleTitleChange}
      />
      {errors.title && <p id={titleErrorId}>{errors.title}</p>}
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
      <label htmlFor={timeId}>Time (optional)</label>
      <input
        id={timeId}
        aria-invalid={errors.startTime ? true : undefined}
        aria-describedby={errors.startTime ? timeErrorId : undefined}
        type='time'
        value={startTime}
        onChange={handleTimeChange}
      />
      {errors.startTime && <p id={timeErrorId}>{errors.startTime}</p>}
      <button
        type='submit'
      >Add</button>
    </form>
  )
}
