import { Domain } from 'domain'
import { validateDomain } from 'lib/utils'
import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import styles from 'styles/checkout.module.css'

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
    <main className={styles.main}>
      <div className={styles.left}>
        <span className={styles.title}>ENS domain registration</span>
        {/* TODO: make component for steps and keep updated */}
        <div>
          <span style={{ fontWeight: '400' }}>Commit&nbsp;&nbsp;&nbsp;</span>{'>'}
          <span style={{ color: 'var(--text-secondary)' }}>&nbsp;&nbsp;&nbsp;Wait&nbsp;&nbsp;&nbsp;{'>'}</span>
          <span style={{ color: 'var(--text-secondary)' }}>&nbsp;&nbsp;&nbsp;Register</span>
        </div>
        {/* TODO: add step components based on step */}
        <div style={{margin: '200px 0px 200px 0px'}}>{step}</div>
        {/* TODO: move buttons to step components */}
        {step !== 'commit' && <button onClick={() => onPrevClick()} >Prev</button>}
        {step !== 'register' && <button onClick={() => onNextClick()}>Next</button>}
      </div>
      <div className={styles.right}>
        <>{props.domain}</>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const domain = query.domain as string

  const e = validateDomain(domain)
  if (e) return {
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
