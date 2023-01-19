import { RegistrationStep } from 'lib/types'
import { useReadLocalStorage } from 'usehooks-ts'
import { useSigner, useFeeData, useAccount } from 'wagmi'
import { CommitmentForm } from './CommitmentForm'
import { RegisterStep } from './RegisterStep'
import { Success } from './Success'
import { WaitMinute } from './WaitMinute'

export const Step = ({
  domain,
  name,
}: {
  domain: string,
  name: string
}) => {
  const { data: signer } = useSigner()

  const { data: feeData } = useFeeData()
  const { address } = useAccount()

  const step = useReadLocalStorage<RegistrationStep>('step')

  if (address && signer) {
    switch (step) {
      case 'commit':
      default:
        return <CommitmentForm {...{ feeData, domain, name }} accountAddress={address} />
      case 'wait':
        return <WaitMinute />
      case 'register':
        return <RegisterStep {...{ feeData, address, name }} />
      case 'success':
        return <Success {...{ domain, address }} />
    }
  } else return null
}
