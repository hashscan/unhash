import { ethers } from 'ethers'
import { useENSInstance } from 'lib/hooks/useENSInstance'
import { useEthPrice } from 'lib/hooks/useEthPrice'
import { RegistrationStep } from 'lib/types'
import { useReadLocalStorage } from 'usehooks-ts'
import { useSigner, useProvider, useFeeData, useAccount } from 'wagmi'
import { CommitmentForm } from './CommitmentForm'
import { RegisterStep } from './RegisterStep'
import { WaitMinute } from './WaitMinute'

export const Step = ({ domain }: { domain: string }) => {
  const { data: signer } = useSigner()
  const provider = useProvider<ethers.providers.JsonRpcProvider>()

  const { ens, isReady } = useENSInstance(provider)
  const { data: feeData } = useFeeData()
  const ethPrice = useEthPrice()
  const { address } = useAccount()

  const step = useReadLocalStorage<RegistrationStep>('step')

  if (address && isReady && signer) {
    switch (step) {
      case 'commit':
      default:
        return <CommitmentForm {...{ ens, signer, provider, feeData, ethPrice, domain }} accountAddress={address} />
      case 'wait':
        return <WaitMinute />
      case 'register':
        return <RegisterStep {...{ ens, ethPrice, feeData, signer, domain, address }} />
    }
  } else return null
}
