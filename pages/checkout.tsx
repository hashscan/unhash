import { CheckoutCommitStep } from 'components/CheckoutCommitStep'
import { CheckoutOrder } from 'components/CheckoutOrder'
import { CheckoutRegisterStep } from 'components/CheckoutRegisterStep'
import { CheckoutSuccessStep } from 'components/CheckoutSuccessStep'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { Domain } from 'lib/types'
import { validateDomain } from 'lib/utils'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import styles from 'styles/checkout.module.css'
import ui from 'styles/ui.module.css'

interface CheckoutProps {
  domain: Domain
}

type CheckoutStep = 'commit' | 'register' | 'success'

const Checkout: PageWithLayout<CheckoutProps> = (props: CheckoutProps) => {
  const [step, setStep] = useState<CheckoutStep>('commit')

  const onPrevClick = () => {
    if (step === 'register') setStep('commit')
    if (step === 'success') setStep('register')
  }

  const onNextClick = () => {
    if (step === 'commit') setStep('register')
    if (step === 'register') setStep('success')
  }

  return (
    <div className={styles.checkout}>
      <main className={styles.main}>
        {/* left content */}
        <span className={styles.title}>ENS domain registration</span>
        {/* TODO: make component for steps and keep updated */}
        <div className={styles.steps}>
          <span style={{ fontWeight: '400' }}>Commit&nbsp;&nbsp;&nbsp;</span>
          {'>'}
          <span style={{ color: 'var(--text-secondary)' }}>
            &nbsp;&nbsp;&nbsp;Wait&nbsp;&nbsp;&nbsp;{'>'}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            &nbsp;&nbsp;&nbsp;Register
          </span>
        </div>

        {step === 'commit' && (
          <CheckoutCommitStep domain={props.domain} />
        )}
        {step === 'register' &&
          <CheckoutRegisterStep domain={props.domain} />
        }
        {step === 'success' &&
          <CheckoutSuccessStep domain={props.domain} />
        }

        <div className={styles.buttons}>
          {step !== 'commit' &&
            <button className={`${ui.button} ${styles.buttonPrev}`} onClick={() => onPrevClick()}>
              Back
            </button>
          }
          {/* TODO: proper way to move button without extra div? */}
          <div className={styles.buttonSpace}></div>
          {step !== 'success' && (
            <button
              className={`${ui.button} ${styles.buttonNext}`}
              onClick={() => onNextClick()}
            >
              {step === 'commit'
                ? 'Start registration'
                : 'Complete registration'}
            </button>
          )}
        </div>
      </main >

      {/* right as a side bar */}
      <div className={styles.right}>
        <CheckoutOrder domain={props.domain} />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const domain = query.domain as string

  const e = validateDomain(domain)
  if (e)
    return {
      redirect: {
        permanent: true,
        destination: '/'
      }
    }

  return {
    props: {
      domain: domain
    }
  }
}

Checkout.layout = <ContainerLayout verticalPadding={false} />

export default Checkout
