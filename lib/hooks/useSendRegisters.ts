import { BigNumber } from 'ethers'
import { YEAR_IN_SECONDS, XENS_ADDRESS, XENS_ABI } from 'lib/constants'
import { toNetwork } from 'lib/types'
import { getDomainName, loadingToStatus } from 'lib/utils'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useDomainPrices } from './useDomainPrices'
import { useRegistration } from './useRegistration'

// TODO: rename
// TODO: use useState and useMemo
// TODO: calculate gas
// TODO: support fees
export const useSendRegisters = () => {
  const chainId = useChainId()
  const { registration, setRegistering } = useRegistration()
  if (!registration) throw new Error('registration should exist')

  // fetch prices
  const price = useDomainPrices(registration.names, registration?.duration)
  const totalPrice = Object.values(price).reduce((acc, price) => {
    return acc.add(BigNumber.from(price?.wei ?? 0))
  }, BigNumber.from(0))

  // TODO: set gas limit based on number of names; 1_000_000 enough for 5-10 names
  const gasLimit = 1_000_000

  // args
  const count = registration.names.length
  const names = registration.names.map(getDomainName)
  const owners: string[] = new Array(count).fill(registration?.owner!)
  const durations: number[] = new Array(count).fill(registration?.duration || YEAR_IN_SECONDS)
  const secrets: string[] = new Array(count).fill(registration?.secret!)
  const prices = registration.names.map((name) => price[name]?.wei ?? 0)

  console.log('--------')
  console.log('names', names)
  console.log('owners', owners)
  console.log('durations', durations)
  console.log('secrets', secrets)
  console.log('prices', prices)

  const { config } = usePrepareContractWrite({
    address: XENS_ADDRESS.get(toNetwork(chainId)),
    abi: XENS_ABI,
    functionName: 'register',
    args: [names, owners, durations, secrets, prices],
    enabled: Boolean(totalPrice) && Boolean(registration?.owner) && Boolean(totalPrice),
    overrides: {
      gasLimit: BigNumber.from(gasLimit),
      value: totalPrice
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
    hash: data?.hash
    // sucess state will get updated in RegistrationProvider
  })

  return {
    gasLimit: config?.request?.gasLimit,
    write,
    status: loadingToStatus(isWriteLoading, isWaitLoading),
    error: sendError || waitError
  }
}
