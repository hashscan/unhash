import { ENS_NFT_ADDRESS, ENS_NFT_ABI } from 'lib/constants'
import { currentNetwork } from 'lib/types'
import { loadingToStatus } from 'lib/utils'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export const useSendName = ({
  tokenId, // pass domain's NFT token id; name itself not needed
  toAddress,
  onError,
  onSuccess
}: {
  tokenId?: string
  toAddress?: string
  onError?: (e: Error) => void
  onSuccess?: () => void
}) => {
  const { address: fromAddress } = useAccount()

  const { config } = usePrepareContractWrite({
    address: ENS_NFT_ADDRESS.get(currentNetwork()),
    abi: ENS_NFT_ABI,
    functionName: 'safeTransferFrom',
    args: [fromAddress, toAddress, tokenId],
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
