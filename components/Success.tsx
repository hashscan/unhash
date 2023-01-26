import { useSendSetFields } from 'lib/hooks/useSendSetFields'
import ui from 'styles/ui.module.css'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import type { useFeeData } from 'wagmi'
import { ProgressBar } from './icons'
import { useRegistration } from 'lib/hooks/storage'

export const Success = ({
  name,
  address,
  feeData,
  domain
}: {
  name: string
  address: string
  feeData?: ReturnType<typeof useFeeData>['data']
  domain: string
}) => {
  const { registration } = useRegistration(name)
  const { config, isLoading, isRemoteError, isWriteError, writeError, write } = useSendSetFields({
    fields: registration?.fields || {},
    domain
  })

  const txPrice = useTxPrice({ config, feeData })

  return (
    <div>
      success! {name}.eth is resolved to {address}
      <p>you need to complete profile</p>
      <button
        disabled={isLoading}
        className={ui.button}
        onClick={() => {
          write?.()
        }}
      >
        {isLoading ? <ProgressBar color="var(--text-primary)" /> : 'Confirm'}
      </button>
      <div>
        {isWriteError && <div className={ui.error}>{writeError?.message}</div>}
        {isRemoteError && <div className={ui.error}>Transaction error</div>}
        {txPrice && <>fields tx cost: ${txPrice}</>}
      </div>
    </div>
  )
}
