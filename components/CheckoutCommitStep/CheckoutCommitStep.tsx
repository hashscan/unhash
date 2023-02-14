import { Domain, toNetwork } from 'lib/types'
import React, { useCallback, useEffect, useState } from 'react'
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
import { Input } from 'components/ui/Input/Input'
import { AddressInput } from 'components/ui/AddressInput/AddressInput'

const YEAR_BUTTONS = [1, 2, 3, 4]

interface CheckoutCommitStepProps {
  domain: Domain
  durationYears: number
  onDurationChanged?: (year: number) => void
}

export const CheckoutCommitStep = ({
  domain,
  durationYears,
  onDurationChanged
}: CheckoutCommitStepProps) => {
  const chainId = useChainId()
  // TODO: handle no network and no account
  const { address } = useAccount()

  const [owner, setOwner] = useState<string | null>('') // empty string - not set, null - invalid input

  const { gasLimit, sendCommit, isLoading, error } = useSendCommit({
    domain: domain,
    network: toNetwork(chainId),
    duration: durationYears * YEAR_IN_SECONDS,
    // TODO:
    // 1) properly handle lack of 'address'
    // 2) make code easier to understand
    owner: owner === '' ? address! : owner ?? undefined
  })
  const networkFee = useTxPrice(gasLimit)

  const onStartClick = useCallback(() => {
    // can't send transaction for any reason (e.g. wallet not connected, alchemy down, etc.)
    if (typeof sendCommit === 'undefined') return
    // invalid owner input
    if (owner === null) return

    sendCommit()
  }, [sendCommit, owner])

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
      <AddressInput
        icon={<EthereumIcon />}
        className={styles.ownerInput}
        placeholder="0xd07d...54aB"
        autoComplete="off"
        onAddressChange={(address) => setOwner(address)}
      />

      <div className={clsx(styles.header, styles.headerProfile)}>ENS Profile</div>
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
