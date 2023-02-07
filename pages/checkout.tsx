import { CheckoutCommitStep } from 'components/CheckoutCommitStep'
import { CheckoutOrder } from 'components/CheckoutOrder'
import { CheckoutRegisterStep } from 'components/CheckoutRegisterStep'
import { CheckoutSuccessStep } from 'components/CheckoutSuccessStep'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { useRegistration } from 'lib/hooks/useRegistration'
import { Domain, RegistrationStatus } from 'lib/types'
import { clamp, parseDomainName, validateDomain } from 'lib/utils'
import { GetServerSideProps } from 'next'
import { useMemo, useState } from 'react'
import styles from 'styles/checkout.module.css'

interface CheckoutProps {
  domain: Domain
  name: string
}

type CheckoutStep = 'commit' | 'register' | 'success'

const Checkout: PageWithLayout<CheckoutProps> = (props: CheckoutProps) => {
  const [durationYears, setDurationYears] = useState<number>(2)

  // subscribe to registration status updates
  const { registration: reg } = useRegistration(props.name)
  const status: RegistrationStatus | undefined = reg?.status
  const step: CheckoutStep = useMemo(() => {
    if (status === 'registered') return 'success'
    if (status === 'registerPending') return 'register'
    if (status === 'committed') return 'register'
    if (status === 'commitPending') return 'commit'
    return 'commit' // 'if (!commit)' not working
  }, [status])

  console.log(`[checkout] ${props.domain} status: ${status}, step: ${step}`)


  // TODO: override actual step for testing UI
  // const onPrevClick = () => {
  //   if (step === 'register') setStep('commit')
  //   if (step === 'success') setStep('register')
  // }
  // const onNextClick = () => {
  //   if (step === 'commit') setStep('register')
  //   if (step === 'register') setStep('success')
  // }

  const onDurationChanged = (year: number) => {
    setDurationYears(clamp(year, 1, 4))
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
          <CheckoutCommitStep
            domain={props.domain}
            name={props.name}
            durationYears={durationYears}
            onDurationChanged={onDurationChanged}
          />
        )}
        {step === 'register' &&
          <CheckoutRegisterStep domain={props.domain} name={props.name} />
        }
        {step === 'success' &&
          <CheckoutSuccessStep domain={props.domain} />
        }

        {/* 
        <div className={styles.buttons}>
          {step !== 'commit' &&
            <button className={clsx(ui.button, styles.buttonPrev)} onClick={() => onPrevClick()}>
              {'<'}
            </button>
          }

          <div className={styles.buttonSpace}></div>
          {step !== 'success' && (
            <button
              className={clsx(ui.button, styles.buttonNext)}
              onClick={() => onNextClick()}
            >
              {'>'}
            </button>
          )}
        </div> */}

      </main >

      {/* right as a side bar */}
      <div className={styles.right}>
        <CheckoutOrder domain={props.domain} durationYears={durationYears} />
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
      domain: domain,
      name: parseDomainName(domain),
    }
  }
}

Checkout.layout = <ContainerLayout verticalPadding={false} />

export default Checkout
