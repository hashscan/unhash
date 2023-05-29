import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import {
  ETH_REGISTRAR_ABI,
  ETH_REGISTRAR_ADDRESS,
  ETH_RESOLVER_LEGACY_ADDRESS
} from 'lib/constants'
import { loadingToStatus } from 'lib/utils'
import { useRegistration } from './useRegistration'
import { useMakeCommitment } from './useMakeCommitment'

import type { useSendCommitBulkType } from './useSendCommitBulk'
import { currentNetwork } from 'lib/network'

/**
 * Hook for sending commit transaction.
 * Generates commitment, sends a commit transaction by user,
 * and waits for transaction to get confirmed.
 *
 * Creates new Registration in LocalStorage when transaction is sent.
 * Note: Registration status will be updated to `committed` by WatchPendingRegistrations.
 */
export const useSendCommit: useSendCommitBulkType = ({
  names,
  duration,
  owner, // must be non-null to enable commit transaction
  addr,
  setDefaultResolver = true
}) => {
  const { address: sender } = useAccount()
  const { setCommitting } = useRegistration()

  // generate secret and commitment
  const {
    secret,
    commitment,
    data: recordsData,
    resolver
  } = useMakeCommitment({
    name: names[0],
    owner: owner,
    duration: duration,
    resolver: setDefaultResolver ? ETH_RESOLVER_LEGACY_ADDRESS.get(currentNetwork()) : undefined,
    reverseRecord: false,
    addr: setDefaultResolver ? addr : undefined
  })

  // prepare commit transaction
  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(currentNetwork()),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'commit',
    enabled: Boolean(sender) && Boolean(owner) && Boolean(commitment),
    args: [commitment]
  })

  // hook for sending commit transaction
  const {
    write,
    data,
    isLoading: isWriteLoading,
    error: writeError
  } = useContractWrite({
    ...config,
    // create new Registration when transaction is sent
    onSuccess: (data) =>
      setCommitting({
        names: names,
        sender: sender!, // more correct way would be saving sender at the moment of write() call vs onSuccess callback
        owner: owner!,
        duration,
        secret: secret!,
        resolver: resolver,
        data: recordsData,
        reverseRecord: false,
        ownerControlledFuses: 0,
        commitTxHash: data.hash
      })
  })

  // wait for transaction success
  const { isLoading: isWaitLoading, error: waitError } = useWaitForTransaction({
    hash: data?.hash
  })

  return {
    gasLimit: config.request?.gasLimit,
    sendCommit: write,
    status: loadingToStatus(isWriteLoading, isWaitLoading),
    error: writeError ?? waitError
  }
}
