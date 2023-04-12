import React, { useCallback } from 'react'
import useChange from '@react-hook/change'

import { useSendRegisterBulk } from 'lib/hooks/useSendRegisterBulk'
import { useNotifier } from 'lib/hooks/useNotifier'
import { TransactionButton } from 'components/TransactionButton/TransactionButton'

import styles from './CheckoutRegisterStep.module.css'
import { pluralize } from 'lib/pluralize'
import { Registration } from 'lib/types'
import { useSendRegister } from 'lib/hooks/useSendRegister'

interface CheckoutRegisterStepProps {
  registration: Registration
}

export const CheckoutRegisterStep = ({ registration }: CheckoutRegisterStepProps) => {
  const useSendRegisterHook = registration.names.length === 1 ? useSendRegister : useSendRegisterBulk
  const { write, status, error } = useSendRegisterHook()

  const onRegisterClick = useCallback(() => {
    write?.()
  }, [write])

  const notify = useNotifier()

  useChange(error?.message, (current) => {
    if (current) {
      notify(current, { status: 'error', title: 'Error sending transaction' })
    }
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Complete Registration</h1>

      <p className={styles.description}>
        Your {pluralize('name', registration.names.length, true)} is ready to be registered. Confirm
        the last transaction to finish the registration.
      </p>

      <div className={styles.buttons}>
        <div className={styles.sendTransaction}>
          <TransactionButton size="cta" onClick={onRegisterClick} status={status}>
            Complete Registration →
          </TransactionButton>
        </div>
      </div>
    </div>
  )
}
