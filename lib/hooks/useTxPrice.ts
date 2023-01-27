import { BigNumber, BigNumberish, utils, providers } from 'ethers'
import { useMemo } from 'react'
import { Address } from 'wagmi'
import { useEthPrice } from './useEthPrice'

export const useTxPrice = ({
  config,
  feeData
}: {
  config: {
    request?: providers.TransactionRequest & {
      to: Address
      gasLimit: NonNullable<BigNumberish>
    }
  }
  feeData?: providers.FeeData
}) => {
  const ethPrice = useEthPrice()
  const txPrice = useMemo(
    () =>
      config.request && feeData
        ? (
            parseFloat(
              utils.formatEther(
                BigNumber.from(config.request.gasLimit).mul(
                  feeData!.lastBaseFeePerGas!.add(feeData?.maxPriorityFeePerGas!)
                )
              )
            ) * ethPrice
          ).toPrecision(5)
        : '',
    [config.request, feeData, ethPrice]
  )
  return txPrice
}
