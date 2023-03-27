import { ETH_REVERSE_REGISTRAR_ABI, ETH_REVERSE_REGISTRAR_ADDRESS } from 'lib/constants'
import { Domain, toNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export const useSetPrimaryEns = ({
  domain,
  onSuccess
}: {
  domain?: Domain
  onSuccess?: () => void
}) => {
  const chainId = useChainId()

  const { config } = usePrepareContractWrite({
    address: ETH_REVERSE_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_REVERSE_REGISTRAR_ABI,
    functionName: 'setName',
    args: [domain],
    enabled: Boolean(domain)
  })

  const { write, data, isLoading: isWriteLoading } = useContractWrite(config)

  const { isLoading: isWaitLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess
  })

  return {
    data,
    status: loadingToStatus(isWriteLoading, isWaitLoading),
    write,
    gasLimit: config.request?.gasLimit,
    isSuccess
  }
}
