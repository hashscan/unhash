import { PropsWithChildren } from 'react'
import { useProvider, useWaitForTransaction } from 'wagmi'
import { useRegistration } from 'lib/hooks/useRegistration'

/**
 * Stateful component to track and update pending Registration transactions.
 *
 * It tracks Registration with status 'commitPending' and 'registerPending',
 * and waits for their transactions to get confirmed. Once confirmed, it updates
 * Registration status to 'committed' or 'registered' respectively.
 */
export const RegistrationsProvider = (props: PropsWithChildren<{}>) => {
  const { registration, setCommitted, setCommitFailed } =
    useRegistration()
  const provider = useProvider()
  const commitHash = registration?.commitTxHash as `0x${string}`

  useWaitForTransaction({
    hash: commitHash,
    enabled: !!registration && registration.status === 'commitPending' && Boolean(commitHash),
    onSuccess: async (data) => {
      // get timestamp from block
      const commitBlock = await provider.getBlock(data.blockNumber)
      const commitTimestamp = commitBlock.timestamp * 1000
      // update registration status
      setCommitted(data.blockNumber, commitTimestamp)
    },
    onError: (e) => setCommitFailed(commitHash, e.message)
  })

  return <>{props.children}</>
}
