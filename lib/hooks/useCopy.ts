import { useState, useEffect } from 'react'

type CopyCatStates = 'idle' | 'copied' | 'errored'

export const useCopy = () => {
  const [state, update] = useState<CopyCatStates>('idle')

  useEffect(() => {
    if (state === 'copied') {
      let id = setTimeout(() => {
        update('idle')
      }, 2000)

      return () => clearTimeout(id)
    }
  }, [state])

  const copy =
    state !== 'errored'
      ? (value: string) => {
          navigator.clipboard.writeText(value).then(
            () => update('copied'),
            () => update('errored')
          )
        }
      : () => undefined

  return [state, copy] as const
}
