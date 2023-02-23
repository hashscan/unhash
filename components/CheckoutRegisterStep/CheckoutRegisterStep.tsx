import React, { useCallback } from 'react'
import useChange from '@react-hook/change'

import { useSendRegister } from 'lib/hooks/useSendRegister'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { useNotifier } from 'lib/hooks/useNotifier'
import { Registration } from 'lib/types'
import { formatNetworkFee } from 'lib/format'
import { REGISTER_AVERAGE_GAS } from 'lib/constants'
import { Gas } from 'components/icons'
import { Button } from 'components/ui/Button/Button'

import styles from './CheckoutRegisterStep.module.css'

interface CheckoutRegisterStepProps {
  registration: Registration
}

export const CheckoutRegisterStep = ({ registration }: CheckoutRegisterStepProps) => {
  const { gasLimit, write, isLoading, error } = useSendRegister(registration.domain)
  const networkFee = useTxPrice(REGISTER_AVERAGE_GAS) // show average not gas limit

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
        You&apos;re only one click away from obtaining your new domain name! Confirm the last
        transaction to finish the registration.
      </p>

      <div className={styles.buttons}>
        <div className={styles.sendTransaction}>
          <Button
            className={styles.registerButton}
            size="cta"
            onClick={onRegisterClick}
            isLoading={isLoading}
          >
            Complete Registration →
          </Button>

          {networkFee && (
            <div className={styles.transactionStatus}>
              <div className={styles.txFeeLabel}>
                <Gas />
                Network fee
              </div>
              <div className={styles.txFeeValue} title={gasLimit && `${gasLimit} gas`}>
                {formatNetworkFee(networkFee)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
