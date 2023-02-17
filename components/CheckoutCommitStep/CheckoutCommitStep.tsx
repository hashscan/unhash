import { Domain, toNetwork } from 'lib/types'
import React, { useCallback, useState } from 'react'
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
import { AddressInput } from 'components/ui/AddressInput/AddressInput'

import { Chevron } from 'components/icons'

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

  const [showAdvanced, setShowAdvanced] = useState(false)

  // TODO: show connect wallet button if not connected
  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
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
      </div>

      <div className={clsx(styles.additional, { [styles.additionalExpanded]: showAdvanced })}>
        <div className={styles.additionalHeader} onClick={() => setShowAdvanced((t) => !t)}>
          Advanced Settings
          <div className={styles.chevronButton}>
            <Chevron className={styles.chevron} />
          </div>
        </div>

        {showAdvanced && (
          <div className={styles.additionalContent}>
            <div className={styles.subheader}>
              You can specify a wallet address of the <b>domain owner</b>. For example, if you are
              buying this domain for another person.
            </div>

            <AddressInput
              icon={<EthereumIcon />}
              className={styles.ownerInput}
              placeholder="0xd07d...54aB"
              autoComplete="off"
              onAddressChange={(address) => setOwner(address)}
            />
          </div>
        )}
      </div>

      {/* TODO: Profile */}
      {/* <div>
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
      </div> */}

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
