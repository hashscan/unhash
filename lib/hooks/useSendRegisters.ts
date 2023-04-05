import { BigNumber } from 'ethers'
import { YEAR_IN_SECONDS, XENS_ADDRESS, XENS_ABI } from 'lib/constants'
import { toNetwork } from 'lib/types'
import { getDomainName, loadingToStatus } from 'lib/utils'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useOrderPrice } from './useOrderPrice'
import { useRegistration } from './useRegistration'
import { useRouterNavigate } from './useRouterNavigate'

// TODO: rename
// TODO: use useState and useMemo
// TODO: calculate gas
// TODO: support fees
export const useSendRegisters = () => {
  const chainId = useChainId()
  const navigate = useRouterNavigate()
  const { registration, setRegistering, clearRegistration } = useRegistration()
  if (!registration) throw new Error('registration should exist')

  // fetch prices
  const orderPrice = useOrderPrice(registration.names, registration?.duration)
  const totalPrice = orderPrice?.total?.wei

  // TODO: set gas limit based on number of names; 1_000_000 enough for 5-10 names
  const gasLimit = 1_000_000

  // args
  const count = registration.names.length
  const names = registration.names.map(getDomainName)
  const owners: string[] = new Array(count).fill(registration?.owner!)
  const durations: number[] = new Array(count).fill(registration?.duration || YEAR_IN_SECONDS)
  const secrets: string[] = new Array(count).fill(registration?.secret!)
  const prices = orderPrice
    ? registration.names.map((name) => orderPrice.names[name]?.wei ?? 0)
    : undefined

  const { config } = usePrepareContractWrite({
    address: XENS_ADDRESS.get(toNetwork(chainId)),
    abi: XENS_ABI,
    functionName: 'register',
    args: [names, owners, durations, secrets, prices],
    enabled: Boolean(totalPrice) && Boolean(registration?.owner) && Boolean(prices),
    overrides: {
      gasLimit: BigNumber.from(gasLimit),
      value: BigNumber.from(totalPrice ?? 0)
    }
  })

  const {
    write,
    data,
    isLoading: isWriteLoading,
    error: sendError
  } = useContractWrite({
    ...config,
    // update registration status when transaction is sent
    onSuccess: (data) => setRegistering(data.hash)
  })

  const { isLoading: isWaitLoading, error: waitError } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      const params = new URLSearchParams(registration.names.map((name) => ['names', name]))
      if (registration.registerTxHash) params.append('txHash', registration.registerTxHash)

      navigate(`/success?${params.toString()}`, '/success').finally(() => {
        clearRegistration()
      })
    }
  })

  return {
    gasLimit: config?.request?.gasLimit,
    write,
    status: loadingToStatus(isWriteLoading, isWaitLoading),
    error: sendError || waitError
  }
}

export type useSendRegistersType = typeof useSendRegisters
