import clsx from 'clsx'
import { SlideFlap } from 'components/ui/SlideFlap/SlideFlap'
import { motion } from 'framer-motion'
import { useCountdown } from 'lib/hooks/useCountdown'

import styles from './RadialCountdown.module.css'

interface RadialCountdownProps {
  timestamp: number
  className?: string
}

export const RadialCountdown = ({ timestamp, className }: RadialCountdownProps) => {
  const count = useCountdown(timestamp)

  // always show no more than two digits
  // even if for some reason the wait time is longer
  const seconds60 = Math.max(Math.min(60, count), 0)

  const pathLength = 1.0 - seconds60 / 60.0

  return (
    <div className={clsx(styles.timer, className)}>
      <div className={styles.seconds}>
        <SlideFlap flipKey={String(seconds60)} slotClassName={styles.second}>
          {seconds60}
        </SlideFlap>
      </div>

      <svg viewBox="0 0 128 128">
        <circle stroke="var(--color-slate-6)" cx={64} cy={64} r={54} fill="none" strokeWidth={6} />

        <motion.circle
          stroke="var(--color-slate-1)"
          cx={64}
          cy={64}
          r={54}
          fill="none"
          strokeWidth={6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength }}
        />
      </svg>
    </div>
  )
}
