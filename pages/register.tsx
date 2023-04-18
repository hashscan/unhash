import { useEffect, useReducer, useState } from 'react'
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
import { Registration, RegistrationOrder, RegisterStep } from 'lib/types'

import styles from './register.module.css'
import { useRouter } from 'next/router'
import { useNames } from 'lib/hooks/useNames'

interface RegisterProps {}

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

// use local registration object from local state on final state
const usePatchedRegistration = () => {
  const [, setNames] = useNames()
  const result = useRegistration()
  const [localState, updateLocalState] = useState<
    Pick<ReturnType<typeof useRegistration>, 'registration'> | undefined
  >(undefined)

  useEffect(() => {
    if (result.registration?.status === 'registered') {
      updateLocalState({ registration: result.registration })
      result.clearRegistration()
      // drop names from local storage on success
      setNames([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.registration])

  return localState ?? result
}

const Register: PageWithLayout<RegisterProps> = () => {
  const [names] = useNames()
  // get registration
  const { registration: reg } = usePatchedRegistration()
  // use names from registration object first
  const namesForRegistration = reg?.names ?? names

  const router = useRouter()
  useEffect(() => {
    // redirect to main page if no registration
    if (namesForRegistration.length === 0) {
      router.push('/')
    }
  }, [namesForRegistration.length, router])

  // reducer to update step on registration changes and timeout
  const [step, dispatchStep] = useReducer(calculateStep, 'initializing')
  useEffect(() => dispatchStep(reg), [reg])

  const [order, updateOrder] = useState<RegistrationOrder>(() => {
    return { names: namesForRegistration, durationInYears: 1, ownerAddress: undefined }
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

  if (namesForRegistration == null) return null

  return (
    <>
      <Head>
        {/* TODO: better title */}
        <title>{`${namesForRegistration.join(', ')} / ENS Domain Registration`}</title>
      </Head>

      <div className={styles.register}>
        <main className={styles.main}>
          <CheckoutProgress className={styles.progress} step={step} names={namesForRegistration} />

          {step === 'initializing' && <div></div>}
          {step === 'commit' && <CheckoutCommitStep order={order} updateOrder={updateOrder} />}
          {step === 'wait' && reg && <CheckoutWaitStep registration={reg} />}
          {step === 'register' && reg && <CheckoutRegisterStep registration={reg} />}
          {step === 'success' && reg && <CheckoutSuccessStep registration={reg} />}
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

Register.layout = <ContainerLayout verticalPadding={false} />

export default Register
