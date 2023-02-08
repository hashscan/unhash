import { useSendRegister } from 'lib/hooks/useSendRegister'
import React from 'react'
import styles from './CheckoutRegisterStep.module.css'
import { LoadingButton } from 'components/LoadingButton/LoadingButton'
import { Gas } from 'components/icons'
import { formatNetworkFee } from 'lib/format'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { REGISTER_AVERAGE_GAS } from 'lib/constants'

interface CheckoutRegisterStepProps {
  domain: string
  name: string
}

export const CheckoutRegisterStep = ({ name }: CheckoutRegisterStepProps) => {
  const { gasLimit, write, isLoading, error } = useSendRegister(name)
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
        <LoadingButton
          className={styles.registerButton}
          onClick={() => !isLoading && onRegisterClick()}
          isLoading={isLoading}
          text="Complete registration"
        />
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
