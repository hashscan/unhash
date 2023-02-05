import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'
import { useCountdownOld } from 'lib/hooks/useCountdownOld'

export const WaitMinute = ({ timestamp }: { timestamp: number }) => {
  const [days, hours, minutes, seconds] = useCountdownOld(new Date(timestamp * 1000 + 60000))

  if (days + hours + minutes + seconds <= 0) {
    return (
      <button
        className={ui.button}
        onClick={() => {
          // setStatus('committed')
          // TODO: set status for specific registration
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
