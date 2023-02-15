import clsx from 'clsx'
import { Domain } from 'lib/types'
import { CheckoutStep } from 'pages/[domain]/register'
import { ComponentProps } from 'react'
import styles from './CheckoutProgress.module.css'

interface CheckoutProgressProps extends ComponentProps<'div'> {
  step: CheckoutStep
  domain: Domain
}

const STEPS_IN_ORDER = ['commit', 'wait', 'register', 'success']

const STEP_NAMES: Record<CheckoutStep, string> = {
  initializing: 'Loading...',
  commit: 'Confirming Your Order',
  wait: 'Reserving Domain Name',
  register: 'Complete Registration',
  success: 'Congratulation!'
}

export const CheckoutProgress = (props: CheckoutProgressProps) => {
  const stepIndex = STEPS_IN_ORDER.indexOf(props.step) + 1

  return (
    <div className={clsx(styles.container, props.className)}>
      <div className={styles.content}>
        <h1 className={styles.title}>{String(props.domain)}</h1>

        <div className={styles.stepName}>
          <span>{stepIndex}</span>
          {STEP_NAMES[props.step]}
        </div>
        <div className={styles.bar}>
          {Array.from({ length: STEPS_IN_ORDER.length }, (v, i) => {
            return (
              <span
                key={i}
                className={clsx(styles.step, { [styles.stepActive]: i < stepIndex })}
                style={{ transitionDelay: `${i}s` }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
