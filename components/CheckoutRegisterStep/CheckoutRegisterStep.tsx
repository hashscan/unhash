import clsx from 'clsx'
import { CheckoutWait } from 'components/CheckoutWait'
import { useRegistrationRead } from 'lib/hooks/storage'
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
  const reg = useRegistrationRead(props.name)
  const commitTimestamp = reg?.commitTimestamp!
  const count = useCountdown(commitTimestamp + 60 * 1000)
  const wait = count > 0

  const { write, isLoading } = useSendRegister(props.name)


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
            <div className={styles.loader}>
              <ProgressBar color='var(--color-slate-f)' width={'32px'} height={'32px'} />
            </div>
          )}
        </>)
      }
    </div>
  )
}