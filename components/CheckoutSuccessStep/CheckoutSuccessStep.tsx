import React from 'react'
import WrapBalancer from 'react-wrap-balancer'
import { Button } from 'components/ui/Button/Button'

import styles from './CheckoutSuccessStep.module.css'

import { NextSteps } from './NextSteps'

interface CheckoutSuccessStepProps {
  domain: string
}

export const CheckoutSuccessStep = (props: CheckoutSuccessStepProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.titles}>
        <h1 className={styles.title}>Congratulations on your purchase!</h1>
        <h2 className={styles.subtitle}></h2>

        <div className={styles.description}>
          <p>
            <WrapBalancer>
              You can now{' '}
              <a>
                point <b>{props.domain}</b> to your wallet
              </a>
              , and create a public profile to use your username instead of a wallet address.
            </WrapBalancer>
          </p>

          <div className={styles.buttons}>
            <Button size="medium">Set up Profile</Button>
            <a>View on Ethescan ↗</a>
          </div>
        </div>
      </div>

      <NextSteps domain={props.domain} />
    </div>
  )
}
