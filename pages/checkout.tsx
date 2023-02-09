import { CheckoutCommitStep } from 'components/CheckoutCommitStep/CheckoutCommitStep'
import { CheckoutOrder } from 'components/CheckoutOrder/CheckoutOrder'
import { CheckoutProgress } from 'components/CheckoutProgress/CheckoutProgress'
import { CheckoutRegisterStep } from 'components/CheckoutRegisterStep/CheckoutRegisterStep'
import { CheckoutSuccessStep } from 'components/CheckoutSuccessStep/CheckoutSuccessStep'
import { CheckoutWaitStep } from 'components/CheckoutWaitStep/CheckoutWaitStep'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { COMMIT_WAIT_MS, YEAR_IN_SECONDS } from 'lib/constants'
import { useRegistration } from 'lib/hooks/useRegistration'
import { Domain, Registration } from 'lib/types'
import { clamp, parseDomainName, validateDomain } from 'lib/utils'
import { GetServerSideProps } from 'next'
import { useEffect, useReducer, useState } from 'react'
import styles from 'styles/checkout.module.css'
import { useTimeout } from 'usehooks-ts'

interface CheckoutProps {
  domain: Domain
  name: string
}

// exported to be used by CheckoutProgress
export type CheckoutStep = 'initializing' | 'commit' | 'wait' | 'register' | 'success'

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
  // get registration and calculate step
  const { registration: reg } = useRegistration(props.name)
  // reducer to update step on registration changes and timeout
  const [step, dispatchStep] = useReducer(calculateStep, 'initializing')
  useEffect(() => dispatchStep(reg), [reg])

  // durationYears is set from the UI and duration is from Registration
  const [durationYears, setDurationYears] = useState<number>(2)
  const [duration, setDuration] = useState<number>(durationYears * YEAR_IN_SECONDS)
  useEffect(() => {
    setDuration(reg?.duration ?? durationYears * YEAR_IN_SECONDS)
  }, [reg, durationYears])

  // set timeout to trigger step update
  const waitTimeout =
    reg?.status === 'committed' && reg?.commitTimestamp
      ? Math.max(0, reg.commitTimestamp + COMMIT_WAIT_MS - Date.now())
      : 0
  useTimeout(() => dispatchStep(reg), waitTimeout)

  const onDurationChanged = (year: number) => {
    setDurationYears(clamp(year, 1, 4))
  }

  return (
    <div className={styles.checkout}>
      {/* left content */}
      <main className={styles.main}>
        <span className={styles.title}>ENS domain registration</span>
        <CheckoutProgress className={styles.progress} step={step} />
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
        <CheckoutOrder domain={props.domain} duration={duration} />
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
