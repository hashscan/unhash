import { useRegistrations } from 'lib/hooks/useRegistrations'
import { ComponentProps, useMemo } from 'react'
import { Domain } from 'lib/types'
import { useProvider, useWaitForTransaction } from 'wagmi'
import { useRegistration } from 'lib/hooks/useRegistration'

// TODO: @molefrog, I'm not sure what's the best way to implement this, please advise:
// --------------------------------
// 1. What do you think about the TxUpdates being used in _app.tsx?
// 2. What props type TxUpdates component should use if it doesn't draw any UI but still passes children?
// 3. The transaction wait implementation is done in child components here vs hooks. Is this ok?
// --------------------------------

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
  const { setRegistered } = useRegistration(domain)

  useWaitForTransaction({
    hash: registerTxHash,
    // update registration status when transaction is confirmed
    onSuccess: () => setRegistered()
  })

  return <></>
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
  const { setCommited } = useRegistration(domain)

  useWaitForTransaction({
    hash: commitTxHash,
    onSuccess: async (data) => {
      // get timestamp from block
      const commitBlock = await provider.getBlock(data.blockNumber)
      const commitTimestamp = commitBlock.timestamp * 1000
      // update registration status
      setCommited(data.blockNumber, commitTimestamp)
    }
  })

  return <></>
}

/**
 * Stateful component to track and update pending Registration transactions.
 * 
 * It tracks all Registration with status 'commitPending' and 'registerPending',
 * and waits for their transactions to get confirmed. Once confirmed, it updates
 * Registration status to 'commited' or 'registered' respectively.
 */
export const WatchPendingRegistrations = (props: ComponentProps<'div'>) => {
  const regs = useRegistrations()
  const commitPendingRegs = useMemo(
    () => regs.filter((reg) => reg.status === 'commitPending'),
    [regs]
  )
  const registerPendingRegs = useMemo(
    () => regs.filter((reg) => reg.status === 'registerPending'),
    [regs]
  )

  // // TODO: remove logs
  // useEffect(() => {
  //   console.log('[tx-updates] all registrations:', JSON.stringify(regs, null, 2))
  //   console.log(
  //     `[tx-updates] found ${pendingTxRegs.length} pending registration transactions: ${pendingTxRegs
  //       .map((reg) => reg.domain)
  //       .join(', ')}`
  //   )
  // }, [pendingTxRegs])

  return (
    <div>
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
    </div>
  )
}
