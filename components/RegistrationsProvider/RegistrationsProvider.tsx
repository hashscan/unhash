import { PropsWithChildren } from 'react'
import { useProvider, useWaitForTransaction } from 'wagmi'
import { useRegistration } from 'lib/hooks/useRegistration'

/*
 * A component that waits for register tx to get confirmed
 * and updates domain's Registration status to 'registered'.
 */
export const WaitForRegisterTx = () => {
  const { registration, setRegistered, setRegisterFailed } = useRegistration()

  const hash = registration?.registerTxHash as `0x${string}`

  useWaitForTransaction({
    enabled: Boolean(registration) && Boolean(hash),
    hash,
    // update registration status when transaction is confirmed or failed
    onSuccess: () => setRegistered(),
    onError: (e) => setRegisterFailed(hash, e.message)
  })

  return null
}

/*
 * A component that waits for commit tx to get confirmed
 * and updates domain's Registration status to 'committed'.
 */
export const WaitForCommitTx = () => {
  const provider = useProvider()
  const { registration, setCommitted: setCommitted, setCommitFailed } = useRegistration()

  const hash = registration?.commitTxHash as `0x${string}`

  useWaitForTransaction({
    hash: hash,
    enabled: Boolean(registration) && Boolean(hash),
    onSuccess: async (data) => {
      // get timestamp from block
      const commitBlock = await provider.getBlock(data.blockNumber)
      const commitTimestamp = commitBlock.timestamp * 1000
      // update registration status
      setCommitted(data.blockNumber, commitTimestamp)
    },
    onError: (e) => setCommitFailed(hash, e.message)
  })

  return null
}

/**
 * Stateful component to track and update pending Registration transactions.
 *
 * It tracks all Registration with status 'commitPending' and 'registerPending',
 * and waits for their transactions to get confirmed. Once confirmed, it updates
 * Registration status to 'committed' or 'registered' respectively.
 */
export const RegistrationsProvider = (props: PropsWithChildren<{}>) => {
  return (
    <>
      <WaitForCommitTx />

      <WaitForRegisterTx />

      {props.children}
    </>
  )
}
