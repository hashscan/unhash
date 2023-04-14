import { useMemo } from 'react'
import { BigNumber } from 'ethers'
import { YEAR_IN_SECONDS, UNHASH_ADDRESS, UNHASH_ABI } from 'lib/constants'
import { getDomainName, loadingToStatus } from 'lib/utils'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useOrderPrice } from './useOrderPrice'
import { useRegistration } from './useRegistration'
import { currentNetwork } from 'lib/network'
import { registerGasLimit } from 'lib/ensUtils'

export const useSendRegisterBulk = () => {
  const { registration, setRegistering } = useRegistration()
  if (!registration) throw new Error('registration should exist')

  // fetch prices
  const orderPrice = useOrderPrice(registration.names, registration?.duration)
  const totalPrice = orderPrice?.total?.wei
  // manually estimated: 200k + 140k per following name
  const gasLimit = registerGasLimit(registration.names.length)

  // args
  const args = useMemo(() => {
    const count = registration.names.length
    const names = registration.names.map(getDomainName)
    const owners: string[] = new Array(count).fill(registration?.owner!)
    const durations: number[] = new Array(count).fill(registration?.duration || YEAR_IN_SECONDS)
    const secrets: string[] = new Array(count).fill(registration?.secret!)
    const prices = orderPrice
      ? registration.names.map((name) => orderPrice.names[name]?.wei ?? 0)
      : undefined

    return [names, owners, durations, secrets, prices] as const
  }, [
    orderPrice,
    registration?.duration,
    registration.names,
    registration?.owner,
    registration?.secret
  ])

  const { config } = usePrepareContractWrite({
    address: UNHASH_ADDRESS.get(currentNetwork()),
    abi: UNHASH_ABI,
    functionName: 'register',
    args,
    enabled: Boolean(totalPrice) && Boolean(registration?.owner),
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
    hash: data?.hash
    // success state will get updated in RegistrationProvider
  })

  return {
    gasLimit: config?.request?.gasLimit,
    write,
    status: loadingToStatus(isWriteLoading, isWaitLoading),
    error: sendError || waitError
  }
}

export type useSendRegisterBulkType = typeof useSendRegisterBulk
