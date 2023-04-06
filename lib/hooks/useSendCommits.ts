import { XENS_ABI, XENS_ADDRESS } from 'lib/constants'
import { Domain, toNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import {
  useAccount,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { useMakeCommitments } from './useMakeCommitments'
import { useRegistration } from './useRegistration'

// TODO: support saving Registration with multiple names to LocalStorage

/**
 * Hook for sending multiple commits in a single transaction.
 * Works same as useSendCommit.
 * Note: make sure to use stable reference to 'names' to avoid extra renders
 */
export const useSendCommits = ({
  names, // make sure to use stable reference to 'names' to avoid extra renders
  duration,
  owner
}: {
  names: Domain[]
  duration: number
  owner: string | undefined // required; hook is disabled unless it's set
  // unify interface with useSendCommit
  setDefaultResolver?: boolean
  addr?: string
}) => {
  const chainId = useChainId()
  const network = toNetwork(chainId)
  const { address: sender } = useAccount()
  const { setCommitting } = useRegistration()

  // generate secrets and commitments for each name
  const { secret, commitments } = useMakeCommitments({
    names: names,
    owner: owner
  })

  const { config } = usePrepareContractWrite({
    address: XENS_ADDRESS.get(network),
    abi: XENS_ABI,
    functionName: 'commit',
    enabled: Boolean(sender) && Boolean(owner) && Boolean(commitments),
    args: [commitments]
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
    onSuccess: (data) => {
      setCommitting({
        names,
        sender: sender!, // the more correct way would be saving sender at the moment of write() call vs onSuccess callback
        owner: owner,
        duration,
        secret: secret!, // TODO: fix?
        commitTxHash: data.hash
      })
    }
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
