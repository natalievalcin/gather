import { useId, useState, type ChangeEvent } from 'react'

export function AddActivityForm() {
  const titleId = useId()
  const [title, setTitle] = useState('')

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value)
  }

  return (
    <form>
      <label htmlFor={titleId}>Title</label>
      <input
        id={titleId}
        value={title}
        onChange={handleTitleChange}
      />
      <p>You typed: {title}</p>
    </form>
  )
}
