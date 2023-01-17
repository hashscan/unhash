import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ProgressBar } from './icons'

export const WaitMinute = () => {
  const [isReady, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const to = setTimeout(() => {
      setReady(true)
    }, 6 * 1000)
    return () => clearTimeout(to)
  }, [])

  return (
    <>
      {isReady ? (
        <button
          onClick={() => {
            router.replace({
              query: { ...router.query, step: 'registration' }
            })
          }}
        >
          Confirm registration
        </button>
      ) : (
        <div>
          Wait a minute <ProgressBar color="var(--text-primary)" />
        </div>
      )}
    </>
  )
}
