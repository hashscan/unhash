import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS } from 'lib/constants'
import { Fields, toNetwork } from 'lib/types'
import {
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
  useWaitForTransaction
} from 'wagmi'
import { useRegistration } from './useRegistration'

export const useSendCommit = ({
  commitmentHash,
  chainId,
  owner,
  name,
  duration,
  secret,
  fields // TODO: support storing fields in Registartion
}: {
  commitmentHash?: string
  chainId: number
  name: string
  owner: string
  duration: number
  secret: string
  fields: Fields
}) => {
  const { create, setCommited } = useRegistration(name)

  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'commit',
    args: [commitmentHash],
    enabled: Boolean(commitmentHash)
  })
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

  // ethers provider needed to get exact transaction timestamp
  const provider = useProvider()
  // wait for transaction success to update Registration status
  const {
    isLoading: isWaitLoading,
    isSuccess,
    error: waitError
  } = useWaitForTransaction({
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
    data,
    isLoading: isWriteLoading || isWaitLoading,
    write,
    config,
    isSuccess,
    error: writeError ? writeError : waitError
  }
}
