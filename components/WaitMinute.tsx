import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'
import { useCountdownOld } from 'lib/hooks/useCountdownOld'
import { useRegisterStatus } from 'lib/hooks/storage'

export const WaitMinute = ({ timestamp }: { timestamp: number }) => {
  const { setStatus } = useRegisterStatus()

  const [days, hours, minutes, seconds] = useCountdownOld(new Date(timestamp * 1000 + 60000))

  if (days + hours + minutes + seconds <= 0) {
    return (
      <button
        className={ui.button}
        onClick={() => {
          setStatus('committed')
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
