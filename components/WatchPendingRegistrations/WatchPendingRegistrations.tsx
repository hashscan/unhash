import { useRegistrations } from 'lib/hooks/useRegistrations'
import { ComponentProps, useMemo } from 'react'
import { Domain } from 'lib/types'
import { useProvider, useWaitForTransaction } from 'wagmi'
import { useRegistration } from 'lib/hooks/useRegistration'

// TODO: @molefrog, I'm not sure what's the best way to implement this, please advise:
// --------------------------------
// 1. What do you think about the way WatchPendingRegistrations being used in _app.tsx, similar to Context?
// 2. What type of props WatchPendingRegistrations component should have if it doesn't draw any UI? (so we can remove <div>)
// 3. The transaction wait implemented in child components here vs hooks. Is this ok?
// 4. How is this working correctly with 2 tabs open in a browser? I guess 2 instances of this component will be created
// --------------------------------
// Note:
// What I don't like this now is how API for sending transactions is implicitly split
// between useSendRegister and WatchPendingRegistrations. In UI you send a transaction
// with useSendRegister, and you can actually wait for it to be confirmed with that hook.
// But a Registration status is updated only by WatchPendingRegistrations in background.
// Maybe we should abstract all the logic here, similar to useNotifier?
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
    onSuccess: (data) => setRegistered()
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
