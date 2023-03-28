import { ETH_RESOLVER_ADDRESS, XENS_ABI, XENS_ADDRESS } from 'lib/constants'
import { Domain, toNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { useMemo } from 'react'
import {
  useAccount,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi'
import { useMakeCommitments } from './useMakeCommitments'

// TODO: support saving Registration with multiple names to LocalStorage

/**
 * Hook for sending multiple commits in a single transaction.
 * Works same as useSendCommit.
 * Note: make sure to use stable reference to 'names' to avoid extra renders
 */
export const useSendCommits = ({
  names, // make sure to use stable reference to 'names' to avoid extra renders
  duration,
  owner,
  addr,
  setDefaultResolver = true
}: {
  names: Domain[]
  duration: number
  owner: string | undefined // required; hooks is disabled unless it's set
  addr?: string // optional eth address to set in resolver
  setDefaultResolver?: boolean
}) => {
  const chainId = useChainId()
  const network = toNetwork(chainId)
  const { address: sender } = useAccount()

  // generate secrets and commitments for each name
  const commitmentItems = useMakeCommitments({
    names: names,
    owner: owner,
    resolver: setDefaultResolver ? ETH_RESOLVER_ADDRESS.get(network) : undefined,
    addr: setDefaultResolver ? addr : undefined
  })

  // prepare commit transaction
  const commitments = useMemo(
    () => commitmentItems?.map((item) => item.commitment),
    [commitmentItems]
  )

  const { config } = usePrepareContractWrite({
    address: XENS_ADDRESS.get(network),
    abi: XENS_ABI,
    functionName: 'bulkCommit',
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
      // TODO: save as in useSendCommit once local storage supports list of names
      console.log(`onSuccess: tx = ${data.hash}, items = ${JSON.stringify(commitmentItems)}`)
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
