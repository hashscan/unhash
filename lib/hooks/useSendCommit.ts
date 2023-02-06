import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS } from 'lib/constants'
import { Fields, toNetwork } from 'lib/types'
import { useContractWrite, usePrepareContractWrite, useProvider, useWaitForTransaction } from 'wagmi'
import { useRegistration } from './storage'

export const useSendCommit = ({
  commitmentHash,
  chainId,
  owner,
  name,
  duration,
  secret,
  fields
}: {
  commitmentHash?: string
  chainId: number
  name: string
  owner: string
  duration: number
  secret: string
  fields: Fields
}) => {
  const { config } = usePrepareContractWrite({
    address: ETH_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_REGISTRAR_ABI,
    functionName: 'commit',
    args: [commitmentHash],
    enabled: Boolean(commitmentHash)
  })
  const { registration, setRegistration } = useRegistration(name)

  const base = { name, owner, duration, secret }

  const {
    write,
    data,
    error: writeError,
    isError: isWriteError
  } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      const reg = registration!

      setRegistration({
        ...base,
        ...reg,
        fields,
        status: 'commitPending',
        commitTxHash: data.hash
      })
    }
  })

  // ethers provider needed to get exact transaction timestamp
  const provider = useProvider()
  // wait for transaction success to update Registration status
  const {
    isLoading,
    isSuccess,
    isError: isRemoteError,
    error: remoteError
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async (data) => {
      // get timestamp from block
      const commitBlock = await provider.getBlock(data.blockNumber)
      const commitTimestamp = commitBlock.timestamp * 1000
      // TODO: replace by specific function to update reg status
      const reg = registration!
      setRegistration({
        ...reg,
        fields, // why do we need to set fields again?
        status: 'committed',
        commitBlock: data.blockNumber,
        commitTimestamp: commitTimestamp,
      })
    }
  })

  return {
    data,
    isLoading,
    write,
    config,
    isSuccess,
    writeError,
    remoteError,
    isWriteError,
    isRemoteError
  }
}
