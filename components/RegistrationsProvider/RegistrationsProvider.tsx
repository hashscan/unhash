import { useRegistrations } from 'lib/hooks/useRegistrations'
import { PropsWithChildren, useMemo } from 'react'
import { Domain } from 'lib/types'
import { useProvider, useWaitForTransaction } from 'wagmi'
import { useRegistration } from 'lib/hooks/useRegistration'

/*
 * A component that waits for register tx to get confirmed
 * and updates domain's Registration status to 'registered'.
 */
export const WaitForRegisterTx = ({
  domain,
  registerTxHash
}: {
  domain: Domain
  registerTxHash: `0x${string}`
}) => {
  const { setRegistered, setRegisterFailed } = useRegistration(domain)

  useWaitForTransaction({
    hash: registerTxHash,
    // update registration status when transaction is confirmed or failed
    onSuccess: () => setRegistered(),
    onError: (e) => setRegisterFailed(registerTxHash, e.message)
  })

  return null
}

/*
 * A component that waits for commit tx to get confirmed
 * and updates domain's Registration status to 'commited'.
 */
export const WaitForCommitTx = ({
  domain,
  commitTxHash
}: {
  domain: Domain
  commitTxHash: `0x${string}`
}) => {
  const provider = useProvider()
  const { setCommited, setCommitFailed } = useRegistration(domain)

  useWaitForTransaction({
    hash: commitTxHash,
    onSuccess: async (data) => {
      // get timestamp from block
      const commitBlock = await provider.getBlock(data.blockNumber)
      const commitTimestamp = commitBlock.timestamp * 1000
      // update registration status
      setCommited(data.blockNumber, commitTimestamp)
    },
    onError: (e) => setCommitFailed(commitTxHash, e.message)
  })

  return null
}

/**
 * Stateful component to track and update pending Registration transactions.
 *
 * It tracks all Registration with status 'commitPending' and 'registerPending',
 * and waits for their transactions to get confirmed. Once confirmed, it updates
 * Registration status to 'commited' or 'registered' respectively.
 */
export const RegistrationsProvider = (props: PropsWithChildren<{}>) => {
  const regs = useRegistrations()
  const commitPendingRegs = useMemo(
    () => regs.filter((reg) => reg.status === 'commitPending'),
    [regs]
  )
  const registerPendingRegs = useMemo(
    () => regs.filter((reg) => reg.status === 'registerPending'),
    [regs]
  )

  return (
    <>
      {commitPendingRegs.map((reg) => (
        <WaitForCommitTx
          key={reg.domain}
          domain={reg.domain}
          commitTxHash={reg.commitTxHash! as `0x${string}`}
        />
      ))}
      {registerPendingRegs.map((reg) => (
        <WaitForRegisterTx
          key={reg.domain}
          domain={reg.domain}
          registerTxHash={reg.registerTxHash! as `0x${string}`}
        />
      ))}
      {props.children}
    </>
  )
}
