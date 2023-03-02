import { useEffect, useReducer, useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useTimeout } from 'usehooks-ts'
import { useBeforeUnload } from 'react-use'

import { CheckoutCommitStep } from 'components/CheckoutCommitStep/CheckoutCommitStep'
import { CheckoutOrder } from 'components/CheckoutOrder/CheckoutOrder'
import { CheckoutProgress } from 'components/CheckoutProgress/CheckoutProgress'
import { CheckoutSuccessStep } from 'components/CheckoutSuccessStep/CheckoutSuccessStep'
import { CheckoutWaitStep } from 'components/CheckoutWaitStep/CheckoutWaitStep'
import { CheckoutRegisterStep } from 'components/CheckoutRegisterStep/CheckoutRegisterStep'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { COMMIT_WAIT_MS } from 'lib/constants'
import { useRegistration } from 'lib/hooks/useRegistration'
import { Domain, Registration, RegistrationOrder, currentNetwork } from 'lib/types'
import { parseDomainName } from 'lib/utils'
import api from 'lib/api'

import styles from './register.module.css'

interface RegisterProps {
  domain: Domain
}

// exported to be used by CheckoutProgress
export type RegisterStep = 'initializing' | 'commit' | 'wait' | 'register' | 'success'

// this is actually a reducer
function calculateStep(_: RegisterStep, reg: Registration | undefined): RegisterStep {
  const status = reg?.status

  if (!status || status === 'created' || status === 'commitPending') return 'commit'
  if (status === 'committed') {
    const commitTimestamp = reg?.commitTimestamp!
    return commitTimestamp + COMMIT_WAIT_MS > Date.now() ? 'wait' : 'register'
  }
  if (status === 'registerPending') return 'register'
  if (status === 'registered') return 'success'

  return 'initializing' // eslint asks to add this
}

const Register: PageWithLayout<RegisterProps> = ({ domain }: RegisterProps) => {
  // get registration and calculate step
  const { registration: reg } = useRegistration(domain)

  // reducer to update step on registration changes and timeout
  const [step, dispatchStep] = useReducer(calculateStep, 'initializing')
  useEffect(() => dispatchStep(reg), [reg])

  const [order, updateOrder] = useState<RegistrationOrder>(() => {
    return { domain, durationInYears: 1, ownerAddress: undefined }
  })

  // set timeout to trigger step update
  const waitTimeout =
    reg?.status === 'committed' && reg?.commitTimestamp
      ? Math.max(0, reg.commitTimestamp + COMMIT_WAIT_MS - Date.now())
      : 0
  useTimeout(() => dispatchStep(reg), waitTimeout)

  // Display warning when user tries to close tab
  const displayWarningOnClose = Boolean(reg && reg.status !== 'registered')
  useBeforeUnload(
    displayWarningOnClose,
    'If you close the browser tab, you may interrupt the registration process.'
  )

  return (
    <>
      <Head>
        <title>{`${domain} / ENS Domain Registration`}</title>
      </Head>

      <div className={styles.register}>
        <main className={styles.main}>
          <CheckoutProgress className={styles.progress} step={step} domain={domain} />

          {step === 'initializing' && <div></div>}
          {step === 'commit' && <CheckoutCommitStep order={order} updateOrder={updateOrder} />}
          {step === 'wait' && reg && <CheckoutWaitStep registration={reg} />}
          {step === 'register' && reg && <CheckoutRegisterStep registration={reg} />}
          {step === 'success' && reg && <CheckoutSuccessStep domain={domain} registration={reg} />}
        </main>

        {step === 'commit' && (
          <div className={styles.order}>
            <CheckoutOrder order={order} />
          </div>
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const domain = query.domain as string
  const network = currentNetwork()

  const { isValid, isAvailable } = await api.checkDomain(domain, network)

  if (!isValid) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  if (!isAvailable) {
    return {
      redirect: {
        destination: `/${domain}`,
        permanent: false
      }
    }
  }

  return {
    props: {
      domain: domain,
      name: parseDomainName(domain)
    }
  }
}

Register.layout = <ContainerLayout verticalPadding={false} />

export default Register
