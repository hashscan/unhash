import React from 'react'
import WrapBalancer from 'react-wrap-balancer'
import { Button } from 'components/ui/Button/Button'

import styles from './CheckoutSuccessStep.module.css'

import { NextSteps } from './NextSteps'
import { Registration } from 'lib/types'
import Link from 'next/link'
import { useEtherscanURL } from 'lib/hooks/useEtherscanURL'

interface CheckoutSuccessStepProps {
  domain: string
  registration: Registration | undefined
}

const EtherscanLink = ({ txn }: { txn: string }) => {
  return (
    <Link href={useEtherscanURL('txn', txn)} target="_blank" className={styles.inlineLink}>
      View on Ethescan ↗
    </Link>
  )
}

export const CheckoutSuccessStep = (props: CheckoutSuccessStepProps) => {
  const txnHash = props.registration?.registerTxHash

  return (
    <div className={styles.container}>
      <div className={styles.titles}>
        <h1 className={styles.title}>Congratulations on your purchase!</h1>
        <h2 className={styles.subtitle}></h2>

        <div className={styles.description}>
          <p>
            <WrapBalancer>
              You can now{' '}
              <Link href="/profile" className={styles.inlineLink}>
                point <b>{props.domain}</b> to your wallet
              </Link>
              , and create a public profile to use your username instead of a wallet address.
            </WrapBalancer>
          </p>

          <div className={styles.buttons}>
            <Link href="/profile" passHref legacyBehavior>
              <Button as="a" size="medium">
                Set up Profile&nbsp;→
              </Button>
            </Link>

            {txnHash && <EtherscanLink txn={txnHash} />}
          </div>
        </div>
      </div>

      <NextSteps domain={props.domain} />
    </div>
  )
}
