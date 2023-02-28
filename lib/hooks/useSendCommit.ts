import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS } from 'lib/constants'
import { Domain, Network } from 'lib/types'
import { getDomainName } from 'lib/utils'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useMakeCommitment } from './useMakeCommitment'
import { useRegistration } from './useRegistration'

/**
 * Hook for sending commit transaction.
 * Generates commitment, sends a commit transaction by user,
 * and waits for transaction to get confirmed.
 *
 * Creates new Registration in LocalStorage when transaction is sent.
 * Note: Registration status will be updated to `commited` by WatchPendingRegistrations.
 */
export const useSendCommit = ({
  domain,
  network,
  duration,
  owner
}: {
  domain: Domain
  network: Network
  duration: number
  owner: string | undefined
}) => {
  const { address: sender } = useAccount()
  const { setCommitting } = useRegistration(domain)

  // generate secret and commitment
  const name = getDomainName(domain)
  const { secret, commitment, error: commitmentError } = useMakeCommitment(name, network, owner)

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
    // create new Registartion when transaction is sent
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
    isLoading: isWriteLoading || isWaitLoading,
    error: commitmentError ?? writeError ?? waitError
  }
}
