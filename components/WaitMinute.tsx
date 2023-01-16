import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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
    <p>
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
        'Wait a minute'
      )}
    </p>
  )
}
