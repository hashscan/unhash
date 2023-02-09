import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS } from 'lib/constants'
import { Network } from 'lib/types'
import {
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
  useWaitForTransaction
} from 'wagmi'
import { useMakeCommitment } from './useMakeCommitment'
import { useRegistration } from './useRegistration'

/**
 * Hook for sending commit transaction.
 * Generates commitment, sends a commit transaction by user,
 * and waits for transaction to get confirmed.
 *
 * Creates new Registration in LocalStorage when transaction is sent.
 * Note: Registration won't be created if parent component is unmounted.
 */
export const useSendCommit = ({
  name,
  network,
  duration,
  owner
}: {
  name: string
  network: Network
  duration: number
  owner: string
}) => {
  // ethers provider needed to get exact transaction timestamp
  const provider = useProvider()
  const { create, setCommited } = useRegistration(name)

  // generate secret and commitment
  const { secret, commitment, error: commitmentError } = useMakeCommitment(name, network, owner)

  // prepare commit transaction
  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(network),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'commit',
    enabled: Boolean(owner) && Boolean(commitment),
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
      create({
        name,
        owner,
        duration,
        secret,
        commitTxHash: data.hash
      })
  })

  // wait for transaction success to update Registration status
  const { isLoading: isWaitLoading, error: waitError } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async (data) => {
      // get timestamp from block
      const commitBlock = await provider.getBlock(data.blockNumber)
      const commitTimestamp = commitBlock.timestamp * 1000
      // update registration status
      setCommited(data.blockNumber, commitTimestamp)
    }
  })

  return {
    gasLimit: config.request?.gasLimit,
    sendCommit: write,
    isLoading: isWriteLoading || isWaitLoading,
    error: commitmentError ?? writeError ?? waitError
  }
}
