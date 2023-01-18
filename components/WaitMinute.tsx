import { RegistrationStep } from 'lib/types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { ProgressBar } from './icons'

export const WaitMinute = () => {
  const [isReady, setReady] = useState(false)
  const router = useRouter()
  const [_, setStep] = useLocalStorage<RegistrationStep>('step', 'wait')

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
            setStep('register')
          }}
        >
          Next
        </button>
      ) : (
        <div>
          Wait a minute <ProgressBar color="var(--text-primary)" />
        </div>
      )}
    </>
  )
}
