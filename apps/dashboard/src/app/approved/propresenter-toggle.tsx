'use client'

import { useTransition } from 'react'
import { togglePropresenter } from './actions'

interface Props {
  graphicId: string
  added: boolean
}

export function PropresenterToggle({ graphicId, added }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleChange() {
    startTransition(async () => {
      try {
        await togglePropresenter(graphicId)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Update failed.')
      }
    })
  }

  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs">
      <input
        type="checkbox"
        checked={added}
        disabled={isPending}
        onChange={handleChange}
        className="h-4 w-4"
        aria-busy={isPending}
      />
      <span className={added ? 'text-muted-foreground line-through' : ''}>
        In ProPresenter
      </span>
    </label>
  )
}
