import { BigNumber, BigNumberish, utils } from 'ethers'
import { useMemo } from 'react'
import { useFeeData } from 'wagmi'
import { useEthPrice } from './useEthPrice'

export const useTxPrice = (gasLimit?: BigNumberish): number | undefined => {
  const { data: feeData } = useFeeData()
  const ethPrice = useEthPrice()

  return useMemo(() => {
    if (!gasLimit || !feeData || !ethPrice) return undefined

    const priceEther = BigNumber.from(gasLimit).mul(
      feeData.lastBaseFeePerGas!.add(feeData.maxPriorityFeePerGas!)
    )
    return parseFloat(utils.formatEther(priceEther)) * ethPrice
  }, [gasLimit, feeData, ethPrice])
}
