import { CheckoutCommitStep } from 'components/CheckoutCommitStep'
import { CheckoutOrder } from 'components/CheckoutOrder'
import { CheckoutRegisterStep } from 'components/CheckoutRegisterStep'
import { CheckoutSuccessStep } from 'components/CheckoutSuccessStep'
import { CheckoutWaitStep } from 'components/CheckoutWaitStep/CheckoutWaitStep'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { COMMIT_WAIT_MS } from 'lib/constants'
import { useRegistration } from 'lib/hooks/useRegistration'
import { Domain, Registration, RegistrationStatus } from 'lib/types'
import { clamp, parseDomainName, validateDomain } from 'lib/utils'
import { GetServerSideProps } from 'next'
import { useEffect, useReducer, useState } from 'react'
import styles from 'styles/checkout.module.css'
import { useTimeout } from 'usehooks-ts'

interface CheckoutProps {
  domain: Domain
  name: string
}

type CheckoutStep = 'initializing' | 'commit' | 'wait' | 'register' | 'success'

// this is actually a reducer
function calculateStep(_: CheckoutStep, reg: Registration | undefined): CheckoutStep {
  const status = reg?.status

  if (!status || status === 'commitPending') return 'commit'
  if (status === 'committed') {
    const commitTimestamp = reg?.commitTimestamp!
    return commitTimestamp + COMMIT_WAIT_MS > Date.now() ? 'wait' : 'register'
  }
  if (status === 'registerPending') return 'register'
  if (status === 'registered') return 'success'

  return 'initializing' // eslint asks to add this
}

const Checkout: PageWithLayout<CheckoutProps> = (props: CheckoutProps) => {
  const [durationYears, setDurationYears] = useState<number>(2)

  // get registration and calculate step
  const { registration: reg } = useRegistration(props.name)
  const status: RegistrationStatus | undefined = reg?.status

  // reducer to update step on registration changes and timeout
  const [step, dispatchStep] = useReducer(calculateStep, 'initializing')
  useEffect(() => dispatchStep(reg), [reg])

  // set timeout to trigger step update
  const waitTimeout =
    reg?.status === 'committed' && reg?.commitTimestamp
      ? Math.max(0, reg.commitTimestamp + COMMIT_WAIT_MS - Date.now())
      : 0
  useTimeout(() => dispatchStep(reg), waitTimeout) // TODO: dispatchStep callback called twice; not a problem but why?

  const onDurationChanged = (year: number) => {
    setDurationYears(clamp(year, 1, 4))
  }

  // TODO: remove after PR review
  console.log(
    `[checkout] ${props.domain}: status = ${status}, step = ${step}, waitTimeout = ${Math.ceil(
      waitTimeout / 1000
    )}s`
  )

  return (
    <div className={styles.checkout}>
      {/* left content */}
      <main className={styles.main}>
        <span className={styles.title}>ENS domain registration</span>
        {step === 'initializing' && <div></div>}
        {step === 'commit' && (
          <CheckoutCommitStep
            domain={props.domain}
            name={props.name}
            durationYears={durationYears}
            onDurationChanged={onDurationChanged}
          />
        )}
        {step === 'wait' && reg?.commitTimestamp && (
          <CheckoutWaitStep commitTimestamp={reg?.commitTimestamp!} />
        )}
        {step === 'register' && <CheckoutRegisterStep domain={props.domain} name={props.name} />}
        {step === 'success' && <CheckoutSuccessStep domain={props.domain} />}
      </main>

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
      name: parseDomainName(domain)
    }
  }
}

Checkout.layout = <ContainerLayout verticalPadding={false} />

export default Checkout
