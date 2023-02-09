import { Domain, toNetwork } from 'lib/types'
import React, { useEffect, useState } from 'react'
import styles from './CheckoutCommitStep.module.css'
import ui from 'styles/ui.module.css'
import { EthereumIcon, Gas } from 'components/icons'
import clsx from 'clsx'
import { formatNetworkFee } from 'lib/format'
import { pluralize } from 'lib/pluralize'
import { useAccount, useChainId } from 'wagmi'
import { YEAR_IN_SECONDS } from 'lib/constants'
import { useSendCommit } from 'lib/hooks/useSendCommit'
import { LoadingButton } from 'components/LoadingButton/LoadingButton'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { isValidAddress } from 'lib/utils'

const YEAR_BUTTONS = [1, 2, 3, 4]

interface CheckoutCommitStepProps {
  domain: Domain
  name: string
  durationYears: number
  onDurationChanged?: (year: number) => void
}

export const CheckoutCommitStep = ({
  name,
  durationYears,
  onDurationChanged
}: CheckoutCommitStepProps) => {
  const chainId = useChainId()
  // TODO: handle no network and no account
  const { address } = useAccount()

  // TODO: move owner input to separate component
  const [ownerInputRaw, setOwnerInputRaw] = useState<string>('')
  const [showOwnerError, setShowOwnerError] = useState<boolean>(false)
  const onOwnerInputBlur = () => {
    setShowOwnerError(owner === null)
  }

  const [owner, setOwner] = useState<string | null>('') // empty string - not set, null - invalid input
  useEffect(() => {
    setShowOwnerError(false)
    setOwner(ownerInputRaw === '' || isValidAddress(ownerInputRaw) ? ownerInputRaw : null)
  }, [ownerInputRaw])

  const { gasLimit, sendCommit, isLoading, error } = useSendCommit({
    name: name,
    network: toNetwork(chainId),
    duration: durationYears * YEAR_IN_SECONDS,
    // TODO:
    // 1) properly handle lack of 'address'
    // 2) make code easier to understand
    owner: owner === '' ? address! : owner ?? undefined
  })
  const networkFee = useTxPrice(gasLimit)

  const onStartClick = () => {
    if (typeof sendCommit === 'undefined') return

    // handle invalid owner input
    if (owner === null) {
      setShowOwnerError(true)
      return
    }

    sendCommit()
  }

  // TODO: show connect wallet button if not connected
  return (
    <div className={styles.container}>
      <div className={styles.header}>Registration period</div>
      <div className={styles.subheader}>Buy more years now to save on fees</div>
      <div className={styles.years}>
        {YEAR_BUTTONS.map((year) => (
          <div
            key={year}
            className={clsx(styles.yearButton, {
              [styles.yearButtonSelected]: year === durationYears
            })}
            onClick={() => onDurationChanged?.(year)}
          >
            {pluralize('year', year)}
          </div>
        ))}
      </div>

      <div className={styles.header}>Domain Ownership</div>
      <div className={styles.subheader}>Optionally buy this domain on another wallet</div>

      {/* TODO: create input component with validation */}
      <div className={styles.inputContainer}>
        <div className={styles.inputIcon}>
          <EthereumIcon />
        </div>
        <input
          onChange={(e) => setOwnerInputRaw(e.target.value)}
          onBlur={() => onOwnerInputBlur()}
          placeholder="0x01234...F0A0 (Optional)"
          autoComplete="off"
          className={`${styles.owner} ${ui.input}`}
        />
        {showOwnerError && <div>Invalid address!</div>}
      </div>

      <div className={styles.header}>ENS Profile</div>
      <div className={styles.subheader}>
        Configure public ENS profile for this domain if you are setting it for your wallet. You can
        skip it or complete after registration
      </div>
      <input
        name="name"
        placeholder="Add a display name"
        autoComplete="off"
        className={clsx(styles.profileInput, ui.input)}
      />
      <input
        name="description"
        placeholder="Add a bio to your profile"
        autoComplete="off"
        className={clsx(styles.profileInput, ui.input)}
      />
      <input
        name="url"
        placeholder="Add your website"
        autoComplete="off"
        className={clsx(styles.profileInput, ui.input)}
      />
      <input
        name="email"
        placeholder="Personal email"
        autoComplete="off"
        className={clsx(styles.profileInput, ui.input)}
      />
      <input
        name="twitter"
        placeholder="@username"
        autoComplete="off"
        className={clsx(styles.profileInput, ui.input, styles.profileInputLast)}
      />

      <div className={styles.buttonContainer}>
        <LoadingButton
          className={styles.commitButton}
          onClick={() => !isLoading && onStartClick()}
          isLoading={isLoading}
          text="Start registration"
        />
        {networkFee && (
          <div className={styles.txFee}>
            <div className={styles.txFeeLabel}>
              <Gas />
              Network fee
            </div>
            <div className={styles.txFeeValue} title={gasLimit && `${gasLimit} gas`}>
              {formatNetworkFee(networkFee)}
            </div>
          </div>
        )}
      </div>

      {/* TODO: remove temp error solution */}
      {error && <div className={styles.error}>{error.message}</div>}
    </div>
  )
}
