import React, { useCallback } from 'react'
import useChange from '@react-hook/change'

import type { useSendRegistersType } from 'lib/hooks/useSendRegisters'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { useNotifier } from 'lib/hooks/useNotifier'
import { formatNetworkFee } from 'lib/format'
import { REGISTER_AVERAGE_GAS } from 'lib/constants'
import { Gas } from 'components/icons'
import { TransactionButton } from 'components/TransactionButton/TransactionButton'

import styles from './CheckoutRegisterStep.module.css'
import { pluralize } from 'lib/pluralize'
import { Registration } from 'lib/types'

interface CheckoutRegisterStepProps {
  registration: Registration
  useSendRegisterHook: useSendRegistersType
}

export const CheckoutRegisterStep = ({
  registration,
  useSendRegisterHook
}: CheckoutRegisterStepProps) => {
  const { gasLimit, write, status, error } = useSendRegisterHook()
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
        Your {pluralize('name', registration.names.length, true)} is ready to be registered. Confirm
        the last transaction to finish the registration.
      </p>

      <div className={styles.buttons}>
        <div className={styles.sendTransaction}>
          <TransactionButton size="cta" onClick={onRegisterClick} status={status}>
            Complete Registration →
          </TransactionButton>

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
