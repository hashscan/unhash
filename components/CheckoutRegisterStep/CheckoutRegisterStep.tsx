import clsx from 'clsx'
import { CheckoutWait } from 'components/CheckoutWait'
import { useRegistration } from 'lib/hooks/useRegistration'
import { useSendRegister } from 'lib/hooks/useSendRegister'
import { useCountdown } from 'lib/hooks/useCountdown'
import React from 'react'
import styles from './CheckoutRegisterStep.module.css'
import ui from 'styles/ui.module.css'
import { ProgressBar } from 'components/icons'


interface CheckoutRegisterStepProps {
  domain: string
  name: string
}

export const CheckoutRegisterStep = (props: CheckoutRegisterStepProps) => {
  // TODO: can it be undefined for some reason? 
  // do we need to handle by returning empty div?
  const { registration: reg } = useRegistration(props.name)
  const commitTimestamp = reg?.commitTimestamp!
  const count = useCountdown(commitTimestamp + 60 * 1000)
  const wait = count > 0

  const { write, isLoading, error } = useSendRegister(props.name)


  const onRegisterClick = () => {
    // TODO: is this really the best way to check hook is ready?
    if (typeof write === 'undefined') return
    write()
  }


  return (
    <div className={styles.container}>
      {wait
        ? (
          <CheckoutWait value={count} />
        )
        : (<>
          <div className={styles.header}>Confirm registration</div>
          <div className={styles.subheader}>Confirm below to register your domain and configure the profile</div>

          {/* TODO: replace by button with loader component */}
          <button
            className={clsx(ui.button, styles.registerButton)}
            onClick={() => !isLoading && onRegisterClick()}
            disabled={isLoading}
          >
            {!isLoading && 'Complete registration'}
          </button>
          {isLoading && (
            <ProgressBar className={styles.loader} color='var(--color-slate-f)' width={'32px'} height={'32px'} />
          )}

          {/* TODO: remove temp error solution */}
          {error && (
            <div className={styles.error}>
              {error.message}
            </div>
          )}
        </>)
      }
    </div>
  )
}