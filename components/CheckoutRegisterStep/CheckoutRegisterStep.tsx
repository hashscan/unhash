import clsx from 'clsx'
import { useSendRegister } from 'lib/hooks/useSendRegister'
import React from 'react'
import styles from './CheckoutRegisterStep.module.css'
import ui from 'styles/ui.module.css'
import { ProgressBar } from 'components/icons'

interface CheckoutRegisterStepProps {
  domain: string
  name: string
}

export const CheckoutRegisterStep = (props: CheckoutRegisterStepProps) => {
  const { write, isLoading, error } = useSendRegister(props.name)

  const onRegisterClick = () => {
    // TODO: is this really the best way to check hook is ready?
    if (typeof write === 'undefined') return
    write()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>Confirm registration</div>
      <div className={styles.subheader}>
        Confirm below to register your domain and configure the profile
      </div>

      {/* TODO: replace by button with loader component */}
      <button
        className={clsx(ui.button, styles.registerButton)}
        onClick={() => !isLoading && onRegisterClick()}
        disabled={isLoading}
      >
        {!isLoading && 'Complete registration'}
      </button>
      {isLoading && (
        <ProgressBar
          className={styles.loader}
          color="var(--color-slate-f)"
          width={'32px'}
          height={'32px'}
        />
      )}

      {/* TODO: remove temp error solution */}
      {error && <div className={styles.error}>{error.message}</div>}
    </div>
  )
}
