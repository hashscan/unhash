import { BigNumber, BigNumberish, ethers } from 'ethers'

import { useMemo } from 'react'
import { useEthPrice } from './useEthPrice'

export const useTxPrice = ({
  config,
  feeData
}: {
  config: {
    request?: ethers.providers.TransactionRequest & {
      to: `0x${string}`
      gasLimit: NonNullable<BigNumberish>
    }
  }
  feeData?: ethers.providers.FeeData
}) => {
  const ethPrice = useEthPrice()
  const txPrice = useMemo(
    () =>
      config.request
        ? (
            parseFloat(
              ethers.utils.formatEther(
                BigNumber.from(config.request.gasLimit).mul(
                  feeData!.lastBaseFeePerGas!.add(feeData?.maxPriorityFeePerGas!)
                )
              )
            ) * ethPrice
          ).toPrecision(5)
        : '',
    [feeData, config]
  )
  return txPrice
}
