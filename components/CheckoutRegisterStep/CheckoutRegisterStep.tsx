import { useSendRegister } from 'lib/hooks/useSendRegister'
import React from 'react'
import styles from './CheckoutRegisterStep.module.css'
import { LoadingButton } from 'components/LoadingButton/LoadingButton'

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

      <LoadingButton
        className={styles.registerButton}
        onClick={() => !isLoading && onRegisterClick()}
        isLoading={isLoading}
        text="Complete registration"
      />

      {/* TODO: remove temp error solution */}
      {error && <div className={styles.error}>{error.message}</div>}
    </div>
  )
}
