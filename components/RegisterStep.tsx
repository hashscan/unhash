import { BigNumber, ethers, PopulatedTransaction, providers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useFeeData } from 'wagmi'
import { useSendRegister } from 'lib/hooks/useSendRegister'
import { useReadLocalStorage } from 'usehooks-ts'
import { ProgressBar } from './icons'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { YEAR_IN_SECONDS } from 'lib/constants'
import styles from 'styles/CommitmentForm.module.css'
import ui from 'styles/ui.module.css'

export const RegisterStep = ({
  feeData,
  address,
  signer,
  domain
}: {
  feeData: ReturnType<typeof useFeeData>['data']
  ethPrice: number
  signer: ethers.Signer
  domain: string
  address: string
}) => {
  const cachedOwner = useReadLocalStorage<string>('owner-address')

  const { config, sendTransaction, isLoading, isSuccess, isSendError, isRemoteError, sendError } = useSendRegister({
    name: domain,
    owner: cachedOwner || address
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
      {txPrice && <>commit tx cost: ${txPrice}</>}
      <div>
        {isSuccess && 'success!'}
        {isSendError && <div className={styles.error}>{sendError?.message}</div>}
        {isRemoteError && <div className={styles.error}>Transaction error</div>}
      </div>
    </>
  )
}
