import { ProgressBar } from './icons'
import ui from 'styles/ui.module.css'
import { useCountdown } from 'lib/hooks/useCountdown'
import { useRegistration } from 'lib/hooks/storage'

export const WaitMinute = ({ timestamp, name }: { timestamp: number; name: string }) => {
  const { registration, setRegistration } = useRegistration(name)

  const [days, hours, minutes, seconds] = useCountdown(new Date(timestamp * 1000 + 60000))

  if (days + hours + minutes + seconds <= 0) {
    return (
      <button
        className={ui.button}
        onClick={() => {
          if (registration) setRegistration({ ...registration, status: 'committed' })
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
