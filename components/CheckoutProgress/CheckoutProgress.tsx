import clsx from 'clsx'
import { Domain } from 'lib/types'
import { RegisterStep } from 'pages/[domain]/register'
import { ComponentProps } from 'react'
import styles from './CheckoutProgress.module.css'
import { SlideFlap } from 'components/ui/SlideFlap/SlideFlap'

interface CheckoutProgressProps extends ComponentProps<'div'> {
  step: RegisterStep
  domain: Domain
}

const STEPS_IN_ORDER = ['commit', 'wait', 'register', 'success']

const STEP_NAMES: Record<RegisterStep, string> = {
  initializing: 'Loading...',
  commit: 'Confirming Your Order',
  wait: 'Reserving Domain Name',
  register: 'Complete Registration',
  success: "You've bought the Domain!"
}

export const CheckoutProgress = (props: CheckoutProgressProps) => {
  const stepIndex = STEPS_IN_ORDER.indexOf(props.step) + 1

  return (
    <div className={clsx(styles.container, props.className)}>
      <div className={styles.content}>
        <h1 className={styles.title}>{String(props.domain)}</h1>

        <SlideFlap
          flipKey={String(stepIndex)}
          className={styles.stepNameLine}
          slotClassName={styles.stepName}
        >
          <span>{stepIndex}</span>
          {STEP_NAMES[props.step]}
        </SlideFlap>

        <div className={styles.bar}>
          {Array.from({ length: STEPS_IN_ORDER.length }, (v, i) => {
            return (
              <span
                key={i}
                className={clsx(styles.step, {
                  [styles.stepComplete]: i < stepIndex - 1,
                  [styles.stepActive]: i < stepIndex
                })}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
