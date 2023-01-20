import { useRegisterStatus, useRegistrationRead } from 'lib/hooks/storage'
import { diffDates } from 'lib/utils'
import { useEffect, useState } from 'react'
import { useSigner, useFeeData, useAccount, useProvider } from 'wagmi'
import { CommitmentForm } from './CommitmentForm'
import { RegisterStep } from './RegisterStep'
import { Success } from './Success'
import { WaitMinute } from './WaitMinute'

export const Step = ({ domain, name }: { domain: string; name: string }) => {
  const { data: signer } = useSigner()

  const { data: feeData } = useFeeData()
  const { address } = useAccount()

  const { status } = useRegisterStatus()
  const provider = useProvider()
  const reg = useRegistrationRead(name)
  const [isMounted, setMounted] = useState(false)
  const [timestamp, setTimestamp] = useState(0)
  useEffect(() => {
    if (provider && reg?.commitBlock)
      provider.getBlock(reg?.commitBlock!).then((block) => {
        setTimestamp(block.timestamp)

        setMounted(true)
      })
  }, [provider, reg])

  if (!(address && signer)) return <div>loading</div>

  if (status === 'start' || status === 'commitPending')
    return <CommitmentForm {...{ name, feeData }} accountAddress={address} />

  if (status === 'committed' && isMounted && diffDates(new Date(), new Date(timestamp * 1000)) < 1)
    return <WaitMinute {...{ timestamp }} />

  if (status === 'committed' || status === 'registerPending') {
    // TODO: pass register tx hash
    return <RegisterStep {...{ feeData, name }} />
  }

  if (status === 'registered') {
    return <Success {...{ name, address }} />
  }

  return <div>loading</div>
}
