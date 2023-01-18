import { ENS } from '@ensdomains/ensjs'
import { ethers, BigNumber, PopulatedTransaction, providers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useFeeData } from 'wagmi'
import { useSendRegister } from 'lib/hooks/useSendRegister'
import { useReadLocalStorage } from 'usehooks-ts'
import { ProgressBar } from './icons'
import { useTxPrice } from 'lib/hooks/useTxPrice'

export const RegisterStep = ({
  ens,
  feeData,
  ethPrice,
  provider,
  domain
}: {
  ens: ENS
  feeData: ReturnType<typeof useFeeData>['data']
  ethPrice: number
  provider: providers.BaseProvider
  domain: string
}) => {
  const [registerTx, setRegisterTx] = useState<PopulatedTransaction>()
  const secret = useReadLocalStorage<string>('commit-secret')!
  const wrapperExpiry = useReadLocalStorage<string>('commit-wrapper-expiry')
  const duration = useReadLocalStorage<number>('duration')!
  const owner = useReadLocalStorage<string>('owner-address')!
  const { config, sendTransaction, isError, isLoading, isSuccess } = useSendRegister(registerTx)

  const txPrice = useTxPrice({ config, feeData })

  useEffect(() => {
    // get tx data for commitment
    const fn = async () => {
      const controller = await ens.contracts!.getEthRegistrarController()!
      const [price] = await controller.rentPrice(domain, duration!)

      const { customData, ...commitPopTx } = await ens
        .withProvider(provider as ethers.providers.JsonRpcProvider)
        .registerName.populateTransaction(domain, {
          secret,
          owner,
          duration,
          value: price
        })

      setRegisterTx(commitPopTx)
    }
    if (duration && secret && owner) fn()
  }, [duration, secret, owner])

  return (
    <>
      {isSuccess && 'success!'}
      {isError && 'error :('}
      {txPrice && <>commit tx cost: ${txPrice}</>}
      <button disabled={isLoading} onClick={() => sendTransaction?.()}>
        {isLoading ? <ProgressBar color="var(--text-primary)" /> : 'Confirm'}
      </button>
    </>
  )
}
