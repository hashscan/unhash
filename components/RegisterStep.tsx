import { ENS } from '@ensdomains/ensjs'
import { BigNumber, ethers, PopulatedTransaction, providers } from 'ethers'
import { useEffect, useState } from 'react'
import { useFeeData } from 'wagmi'
import { useSendRegister } from 'lib/hooks/useSendRegister'
import { useReadLocalStorage } from 'usehooks-ts'
import { ProgressBar } from './icons'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { registerName } from 'lib/ens/registerName'
import { YEAR_IN_SECONDS } from 'lib/constants'
import styles from 'styles/CommitmentForm.module.css'
import ui from 'styles/ui.module.css'

export const RegisterStep = ({
  ens,
  feeData,
  address,
  signer,
  domain
}: {
  ens: ENS
  feeData: ReturnType<typeof useFeeData>['data']
  ethPrice: number
  signer: ethers.Signer
  domain: string
  address: string
}) => {
  const [registerTx, setRegisterTx] = useState<PopulatedTransaction>()
  const secret = useReadLocalStorage<string>('commit-secret')!
  const wrapperExpiry = useReadLocalStorage<string>('commit-wrapper-expiry')
  const cachedDuration = useReadLocalStorage<number>('duration')!
  const cachedOwner = useReadLocalStorage<string>('owner-address')!
  const { config, sendTransaction, isLoading, isSuccess, isSendError, isRemoteError, remoteError, sendError } =
    useSendRegister(registerTx)

  const txPrice = useTxPrice({ config, feeData })

  return (
    <>
      <button
        className={ui.button}
        disabled={isLoading}
        onClick={async () => {
          const tx = await registerName({
            ens,
            domain,
            duration: cachedDuration || YEAR_IN_SECONDS,
            signer: signer as providers.JsonRpcSigner,
            secret,
            owner: cachedOwner || address,
            wrapperExpiry: BigNumber.from(wrapperExpiry)
          })

          setRegisterTx(tx)
          sendTransaction?.()
        }}
      >
        {isLoading ? <ProgressBar color="var(--text-primary)" /> : 'Confirm'}
      </button>
      {txPrice && <>commit tx cost: ${txPrice}</>}
      <div>
        {isSuccess && 'success!'}
        {isSendError && <div className={styles.error}>{sendError?.message}</div>}
        {isRemoteError && <div className={styles.error}>Transaction error</div>}
      </div>
    </>
  )
}
