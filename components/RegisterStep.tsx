import { useFeeData } from 'wagmi'
import { useSendRegister } from 'lib/hooks/useSendRegister'
import { ProgressBar } from './icons'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import ui from 'styles/ui.module.css'
import { useRegistrationRead } from 'lib/hooks/storage'

export const RegisterStep = ({ feeData, name }: { feeData: ReturnType<typeof useFeeData>['data']; name: string }) => {
  const { config, write, isLoading, isSuccess, isSendError, isRemoteError, sendError } = useSendRegister({
    name
  })

  const registration = useRegistrationRead(name)

  const txPrice = useTxPrice({ config, feeData })

  return (
    <>
      <div>
        {registration?.fields &&
          Object.entries(registration?.fields).map(
            ([k, v]) =>
              v && (
                <div key={`${k}-${v}`}>
                  <span>{k}</span>: <span>{v}</span>
                </div>
              )
          )}
      </div>
      <button
        className={ui.button}
        disabled={isLoading}
        onClick={async () => {
          write?.()
        }}
      >
        {isLoading ? <ProgressBar color="var(--text-primary)" /> : 'Confirm'}
      </button>
      {txPrice && <>register tx cost: ${txPrice}</>}
      <div>
        {isSuccess && 'success!'}
        {isSendError && <div className={ui.error}>{sendError?.message}</div>}
        {isRemoteError && <div className={ui.error}>Transaction error</div>}
      </div>
    </>
  )
}
