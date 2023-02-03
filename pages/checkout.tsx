import { CheckoutCommitStep } from 'components/CheckoutCommitStep'
import { CheckoutOrder } from 'components/CheckoutOrder'
import { CheckoutWait } from 'components/CheckoutWait'
import { Domain } from 'lib/types'
import { validateDomain } from 'lib/utils'
import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import styles from 'styles/checkout.module.css'
import ui from 'styles/ui.module.css'

interface CheckoutProps {
  domain: Domain
}

type CheckoutStep = 'commit' | 'wait' | 'register'

const Checkout: NextPage<CheckoutProps> = (props: CheckoutProps) => {
  const [step, setStep] = useState<CheckoutStep>('commit')

  const onPrevClick = () => {
    if (step === 'wait') setStep('commit')
    if (step === 'register') setStep('wait')
  }

  const onNextClick = () => {
    if (step === 'commit') setStep('wait')
    if (step === 'wait') setStep('register')
  }

  return (
    <div className={styles.checkout}>
      <main className={styles.main}>
        {/* left content */}
        <div className={styles.header}>
          {/* hidden for now */}
          {/* <div className={styles.back}><BackIcon /></div> */}
          <span className={styles.title}>ENS domain registration</span>
        </div>
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

        {step === 'commit' &&
          <CheckoutCommitStep domain={props.domain} />
        }
        {step === 'wait' &&
          // TODO: pass actual commit tx timestamp or manage state from this component
          <CheckoutWait value={20} />
        }
        {step === 'register' &&
          <div >Register page</div>
        }

        <div className={styles.buttons}>
          <button
            className={ui.button}
            onClick={() => onPrevClick()}
            style={{ visibility: step === 'commit' ? 'hidden' : 'visible' }}
          >
            {step === 'wait' ? 'Back' : 'Cancel'}
          </button>
          {step !== 'register' && (
            <button className={ui.button} onClick={() => onNextClick()}>
              {step === 'commit' ? 'Start registration' : 'Complete registration'}
            </button>
          )}
        </div>
      </main>

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

export default Checkout
