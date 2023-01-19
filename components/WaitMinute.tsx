import { RegistrationStep } from 'lib/types'
import { useEffect, useState } from 'react'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import { useProvider } from 'wagmi'
import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'
import { useCountdown } from 'lib/hooks/useCountdown'

export const WaitMinute = () => {
  const provider = useProvider()
  const commitTxBlock = useReadLocalStorage<number>('commit-tx-block')
  const [_, setStep] = useLocalStorage<RegistrationStep>('step', 'wait')
  const [date, setDate] = useState<Date>(new Date(0))

  const [days, hours, minutes, seconds] = useCountdown(date)

  useEffect(() => {
    provider.getBlock(commitTxBlock!).then((block) => {
      setDate(new Date(block.timestamp * 1000 + 60000)) // timestamp + 1 minute
    })
  }, [commitTxBlock, provider])

  if (days + hours + minutes + seconds <= 0) {
    return (
      <button
        className={ui.button}
        onClick={() => {
          setStep('register')
        }}
      >
        Next
      </button>
    )
  } else {
    return (
      <div>
        <p>Wait {seconds} seconds</p>
        <ProgressBar color="var(--text-primary)" />
      </div>
    )
  }
}
