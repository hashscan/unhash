import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS } from 'lib/constants'
import { Fields, toNetwork } from 'lib/types'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { usePendingRegistrations, useRegistration } from './storage'

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
  const { pendingRegistrations, setPendingRegistrations } = usePendingRegistrations()
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
      setPendingRegistrations([...pendingRegistrations, reg])
      setRegistration({
        ...base,
        ...reg,
        fields,
        status: 'commitPending',
        commitTxHash: data.hash
      })
    }
  })

  const {
    isLoading,
    isSuccess,
    isError: isRemoteError,
    error: remoteError
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      const reg = registration!
      setRegistration({
        ...reg,
        fields,
        status: 'committed',
        commitBlock: data.blockNumber
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
