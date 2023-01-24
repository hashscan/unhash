import { useSendSetFields } from 'lib/hooks/useSendSetFields'
import ui from 'styles/ui.module.css'
import styles from 'styles/CommitmentForm.module.css'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import type { useFeeData } from 'wagmi'
import { ProgressBar } from './icons'

export const Success = ({
  name,
  address,
  feeData
}: {
  name: string
  address: string
  feeData?: ReturnType<typeof useFeeData>['data']
}) => {
  const { config, isLoading, isRemoteError, isWriteError, writeError, write } = useSendSetFields({ name })

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
        {isWriteError && <div className={styles.error}>{writeError?.message}</div>}
        {isRemoteError && <div className={styles.error}>Transaction error</div>}
        {txPrice && <>fields tx cost: ${txPrice}</>}
      </div>
    </div>
  )
}
