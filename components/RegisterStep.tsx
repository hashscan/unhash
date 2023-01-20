import { useFeeData } from 'wagmi'
import { useSendRegister } from 'lib/hooks/useSendRegister'
import { ProgressBar } from './icons'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import styles from 'styles/CommitmentForm.module.css'
import ui from 'styles/ui.module.css'

export const RegisterStep = ({ feeData, name }: { feeData: ReturnType<typeof useFeeData>['data']; name: string }) => {
  const { config, sendTransaction, isLoading, isSuccess, isSendError, isRemoteError, sendError } = useSendRegister({
    name
  })

  const txPrice = useTxPrice({ config, feeData })

  return (
    <>
      <button
        className={ui.button}
        disabled={isLoading}
        onClick={async () => {
          sendTransaction?.()
        }}
      >
        {isLoading ? <ProgressBar color="var(--text-primary)" /> : 'Confirm'}
      </button>
      {txPrice && <>register tx cost: ${txPrice}</>}
      <div>
        {isSuccess && 'success!'}
        {isSendError && <div className={styles.error}>{sendError?.message}</div>}
        {isRemoteError && <div className={styles.error}>Transaction error</div>}
      </div>
    </>
  )
}
