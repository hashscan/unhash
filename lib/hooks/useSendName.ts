import { getNameContractABI, getNameContract } from 'lib/constants'
import { currentNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export const useSendName = ({
  isWrapped,
  tokenId,
  toAddress,
  onError,
  onSuccess
}: {
  isWrapped: boolean
  tokenId?: string
  toAddress?: string
  onError?: (e: Error) => void
  onSuccess?: () => void
}) => {
  const { address: fromAddress } = useAccount()

  const { config } = usePrepareContractWrite({
    address: getNameContract(currentNetwork(), isWrapped),
    abi: getNameContractABI(isWrapped),
    functionName: 'safeTransferFrom',
    args: isWrapped
      ? [fromAddress, toAddress, tokenId, 1, '0x']
      : [fromAddress, toAddress, tokenId],
    enabled: Boolean(tokenId) && Boolean(toAddress)
  })

  const { write, data, isLoading: isWriteLoading } = useContractWrite({ ...config, onError })

  const { isLoading: isWaitLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess,
    onError
  })

  return {
    data,
    txHash: data?.hash,
    status: loadingToStatus(isWriteLoading, isWaitLoading),
    write,
    gasLimit: config.request?.gasLimit,
    isSuccess
  }
}
