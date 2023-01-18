import { ethers } from 'ethers'
import { useEthPrice } from 'lib/hooks/useEthPrice'
import { RegistrationStep } from 'lib/types'
import { useEffect } from 'react'
import { useReadLocalStorage } from 'usehooks-ts'
import { useSigner, useProvider, useFeeData, useAccount, useEnsAddress } from 'wagmi'
import { CommitmentForm } from './CommitmentForm'
import { RegisterStep } from './RegisterStep'
import { WaitMinute } from './WaitMinute'

export const Step = ({ domain }: { domain: string }) => {
  const { data: signer } = useSigner()
  const provider = useProvider<ethers.providers.JsonRpcProvider>()

  const { data: feeData } = useFeeData()
  const ethPrice = useEthPrice()
  const { address } = useAccount()

  const step = useReadLocalStorage<RegistrationStep>('step')

  if (address && signer) {
    switch (step) {
      case 'commit':
      default:
        return <CommitmentForm {...{ signer, provider, feeData, ethPrice, domain }} accountAddress={address} />
      case 'wait':
        return <WaitMinute />
      case 'register':
        return <RegisterStep {...{ ethPrice, feeData, signer, domain, address }} />
      case 'success':
        return (
          <div>
            success! {domain} is resolved to {address}
          </div>
        )
    }
  } else return null
}
