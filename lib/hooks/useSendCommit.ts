import {
  useAccount,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'

import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS, ETH_RESOLVER_ADDRESS } from 'lib/constants'
import { Domain, toNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { useRegistration } from './useRegistration'
import { useMakeCommitment } from './useMakeCommitment'

/**
 * Hook for sending commit transaction.
 * Generates commitment, sends a commit transaction by user,
 * and waits for transaction to get confirmed.
 *
 * Creates new Registration in LocalStorage when transaction is sent.
 * Note: Registration status will be updated to `committed` by WatchPendingRegistrations.
 */
export const useSendCommit = ({
  domain,
  duration,
  owner,
  addr,
  setDefaultResolver = true
}: {
  domain: Domain
  duration: number
  owner: string | undefined // required; hooks is disabled unless it's set
  addr?: string // optional eth address to set in resolver
  setDefaultResolver?: boolean
}) => {
  const chainId = useChainId()
  const network = toNetwork(chainId)
  const { address: sender } = useAccount()
  const { setCommitting } = useRegistration(domain)

  // generate secret and commitment
  const { secret, commitment } = useMakeCommitment({
    name: domain,
    owner: owner,
    resolver: setDefaultResolver ? ETH_RESOLVER_ADDRESS.get(network) : undefined,
    addr: setDefaultResolver ? addr : undefined
  })

  // prepare commit transaction
  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(network),
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
        domain,
        sender: sender!, // the more correct way would be saving sender at the moment of write() call vs onSuccess callback
        owner: owner,
        duration,
        secret: secret!, // TODO: fix?
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
