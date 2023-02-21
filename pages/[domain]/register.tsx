import { useEffect, useReducer, useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useTimeout } from 'usehooks-ts'

import { CheckoutCommitStep } from 'components/CheckoutCommitStep/CheckoutCommitStep'
import { CheckoutOrder } from 'components/CheckoutOrder/CheckoutOrder'
import { CheckoutProgress } from 'components/CheckoutProgress/CheckoutProgress'
import { CheckoutRegisterStep } from 'components/CheckoutRegisterStep/CheckoutRegisterStep'
import { CheckoutSuccessStep } from 'components/CheckoutSuccessStep/CheckoutSuccessStep'
import { CheckoutWaitStep } from 'components/CheckoutWaitStep/CheckoutWaitStep'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { COMMIT_WAIT_MS } from 'lib/constants'
import { useRegistration } from 'lib/hooks/useRegistration'
import { Domain, Registration, RegistrationOrder } from 'lib/types'
import { parseDomainName, validateDomain } from 'lib/utils'

import styles from 'styles/checkout.module.css'

interface CheckoutProps {
  domain: Domain
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

const Checkout: PageWithLayout<CheckoutProps> = ({ domain }: CheckoutProps) => {
  // get registration and calculate step
  const { registration: reg } = useRegistration(domain)

  // reducer to update step on registration changes and timeout
  const [step, dispatchStep] = useReducer(calculateStep, 'initializing')
  useEffect(() => dispatchStep(reg), [reg])

  const [order, updateOrder] = useState<RegistrationOrder>(() => {
    return { domain, durationInYears: 2, ownerAddress: undefined }
  })

  // set timeout to trigger step update
  const waitTimeout =
    reg?.status === 'committed' && reg?.commitTimestamp
      ? Math.max(0, reg.commitTimestamp + COMMIT_WAIT_MS - Date.now())
      : 0
  useTimeout(() => dispatchStep(reg), waitTimeout)

  return (
    <>
      <Head>
        <title>{`${domain} / ENS Domain Registration`}</title>
      </Head>

      <div className={styles.checkout}>
        {/* left content */}
        <main className={styles.main}>
          <CheckoutProgress className={styles.progress} step={step} domain={domain} />

          <div className={styles.content}>
            {step === 'initializing' && <div></div>}
            {step === 'commit' && <CheckoutCommitStep order={order} updateOrder={updateOrder} />}
            {step === 'wait' && reg?.commitTimestamp && (
              <CheckoutWaitStep commitTimestamp={reg?.commitTimestamp!} />
            )}
            {step === 'register' && <CheckoutRegisterStep domain={domain} />}
            {step === 'success' && <CheckoutSuccessStep domain={domain} />}
          </div>
        </main>

        {/* right as a side bar */}
        <div className={styles.right}>{step === 'commit' && <CheckoutOrder order={order} />}</div>
      </div>
    </>
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
