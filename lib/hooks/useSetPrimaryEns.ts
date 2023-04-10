import { ETH_REVERSE_REGISTRAR_ABI, ETH_REVERSE_REGISTRAR_ADDRESS } from 'lib/constants'
import { Domain, currentNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export const useSetPrimaryEns = ({
  domain,
  onSuccess
}: {
  domain?: Domain
  onSuccess?: () => void
}) => {
  const { config } = usePrepareContractWrite({
    address: ETH_REVERSE_REGISTRAR_ADDRESS.get(currentNetwork()),
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
