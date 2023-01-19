import { RegistrationStep } from 'lib/types'
import { useEffect, useMemo, useState } from 'react'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import { useProvider } from 'wagmi'
import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'

export const WaitMinute = () => {
  const [isReady, setReady] = useState(false)
  const provider = useProvider()
  const commitTxBlock = useReadLocalStorage<number>('commit-tx-block')
  const [_, setStep] = useLocalStorage<RegistrationStep>('step', 'wait')
  const [date, setDate] = useState<Date>(new Date(0))
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const mins = () => {
      const now = new Date()
      setMinutes(now.getMinutes() - date.getMinutes())
      setSeconds(now.getSeconds() - date.getSeconds())
      if (minutes >= 1) {
        setReady(true)
      }
    }
    mins()
    const iv = setInterval(mins, 1000)
    if (isReady) clearInterval(iv)
    return () => clearInterval(iv)
  }, [date, isReady])

  useEffect(() => {
    provider.getBlock(commitTxBlock!).then((block) => {
      setDate(new Date(block.timestamp * 1000))
    })
  }, [commitTxBlock, provider])

  return (
    <>
      {isReady ? (
        <button
          className={ui.button}
          onClick={() => {
            setStep('register')
          }}
        >
          Next
        </button>
      ) : (
        <div>
          <p>Seconds left: {60 - seconds}</p>
          <p>
            Wait a minute <ProgressBar color="var(--text-primary)" />
          </p>
        </div>
      )}
    </>
  )
}
