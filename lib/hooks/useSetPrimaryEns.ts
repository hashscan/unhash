import { ETH_REVERSE_REGISTRAR_ABI, ETH_REVERSE_REGISTRAR_ADDRESS } from 'lib/constants'
import { Domain, toNetwork } from 'lib/types'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export const useSetPrimaryEns = ({ domain }: { domain: Domain | null }) => {
  const chainId = useChainId()

  const { config } = usePrepareContractWrite({
    address: ETH_REVERSE_REGISTRAR_ADDRESS.get(toNetwork(chainId)),
    abi: ETH_REVERSE_REGISTRAR_ABI,
    functionName: 'setName',
    args: [domain],
    enabled: Boolean(domain)
  })

  const { write, data } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => location.reload()
  })

  return { data, isLoading, write, config, isSuccess }
}
