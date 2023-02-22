import React, { useCallback, useMemo } from 'react'
import useChange from '@react-hook/change'
import { motion } from 'framer-motion'

import { COMMIT_WAIT_MS, REGISTER_AVERAGE_GAS } from 'lib/constants'
import { Registration } from 'lib/types'
import { Button } from 'components/ui/Button/Button'
import { RadialCountdown } from './RadialCountdown'
import { useSendRegister } from 'lib/hooks/useSendRegister'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { Gas } from 'components/icons'
import { formatNetworkFee } from 'lib/format'
import { useNotifier } from 'lib/hooks/useNotifier'

import styles from './CheckoutWaitStep.module.css'

interface CheckoutWaitStepProps {
  step: 'wait' | 'register'
  registration: Registration
}

export const CheckoutWaitStep = ({ registration, step }: CheckoutWaitStepProps) => {
  const endOfWaitPeriodTs = useMemo(() => {
    const ts = registration.commitTimestamp || new Date().getTime()
    return ts + COMMIT_WAIT_MS
  }, [registration.commitTimestamp])

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
      {step === 'wait' ? (
        <>
          <RadialCountdown className={styles.countdown} timestamp={endOfWaitPeriodTs} />
          <h1 className={styles.title}>Just a Minute, Please</h1>

          <p className={styles.description}>
            Your domain name has been reserved! Please wait <b>60&nbsp;seconds</b> before completing
            the registration.
          </p>

          <p className={styles.note}>
            This is an ENS protocol requirement, to ensure that no one else can obtain the domain
            before you.
          </p>
        </>
      ) : (
        <>
          <h1 className={styles.title}>Complete Registration</h1>

          <p className={styles.description}>
            You&apos;re only one click away from obtaining your new domain name! Confirm the last
            transaction to finish the registration.
          </p>

          <Button
            className={styles.registerButton}
            size="cta"
            onClick={onRegisterClick}
            isLoading={isLoading}
          >
            Complete Registration →
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
        </>
      )}
    </div>
  )
}
