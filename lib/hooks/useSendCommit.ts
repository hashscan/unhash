import { ETH_REGISTRAR_ABI, ETH_REGISTRAR_ADDRESS } from 'lib/constants'
import { Fields, toNetwork } from 'lib/types'
import { randomSecret } from 'lib/utils'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useRegisterStatus, useRegistration } from './storage'

export const useSendCommit = ({
  commitmentHash,
  chainId,
  owner,
  name,
  duration,
  secret
}: {
  commitmentHash?: string
  chainId: number
  name: string
  owner: string
  duration: number
  secret: string
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
      setRegistration({
        ...base,
        status: 'commitPending',
        commitTxHash: data.hash
      })
    }
  })

  const { setStatus } = useRegisterStatus()

  const {
    isLoading,
    isSuccess,
    isError: isRemoteError,
    error: remoteError
  } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (data) => {
      setStatus('committed')
      const reg = registration!
      setRegistration({
        ...reg,
        status: 'committed',
        commitBlock: data.blockNumber
      })
    }
  })

  const setFields = (fields: Fields) => {
    const reg = registration!
    setRegistration({ ...reg, fields })
  }

  return {
    data,
    isLoading,
    write,
    config,
    isSuccess,
    writeError,
    remoteError,
    isWriteError,
    isRemoteError,
    setFields
  }
}
