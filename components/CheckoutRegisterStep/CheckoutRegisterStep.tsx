import { useSendRegister } from 'lib/hooks/useSendRegister'
import React from 'react'
import styles from './CheckoutRegisterStep.module.css'
import { Button } from 'components/ui/Button/Button'
import { Gas } from 'components/icons'
import { formatNetworkFee } from 'lib/format'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { REGISTER_AVERAGE_GAS } from 'lib/constants'
import { Domain } from 'lib/types'

interface CheckoutRegisterStepProps {
  domain: Domain
}

export const CheckoutRegisterStep = ({ domain }: CheckoutRegisterStepProps) => {
  const { gasLimit, write, isLoading, error } = useSendRegister(domain)
  const networkFee = useTxPrice(REGISTER_AVERAGE_GAS) // show average not gas limit

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

      <div className={styles.buttonContainer}>
        <Button
          className={styles.registerButton}
          onClick={() => !isLoading && onRegisterClick()}
          isLoading={isLoading}
        >
          Complete Registration
        </Button>
        {networkFee && (
          <div className={styles.txFee}>
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

      {/* TODO: remove temp error solution */}
      {error && <div className={styles.error}>{error.message}</div>}
    </div>
  )
}
