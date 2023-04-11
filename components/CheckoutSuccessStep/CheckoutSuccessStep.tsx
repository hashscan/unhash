import React from 'react'
import WrapBalancer from 'react-wrap-balancer'
import { Button } from 'components/ui/Button/Button'

import styles from './CheckoutSuccessStep.module.css'

import { NextSteps } from './NextSteps'
import { Registration } from 'lib/types'
import Link from 'next/link'
import { useEtherscanURL } from 'lib/hooks/useEtherscanURL'

interface CheckoutSuccessStepProps {
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
  const domain = props.registration?.names[0]
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
                set <b>{domain}</b> as a username
              </Link>{' '}
              for your wallet and create a public profile with NFT avatar.
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
    </div>
  )
}
