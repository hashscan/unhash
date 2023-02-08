import { Domain, toNetwork } from 'lib/types'
import React from 'react'
import styles from './CheckoutCommitStep.module.css'
import ui from 'styles/ui.module.css'
import { EthereumIcon } from 'components/icons'
import clsx from 'clsx'
import { formatYears } from 'lib/format'
import { useMakeCommitment } from 'lib/hooks/useMakeCommitment'
import { useAccount, useChainId } from 'wagmi'
import { YEAR_IN_SECONDS } from 'lib/constants'
import { useSendCommit } from 'lib/hooks/useSendCommit'
import { LoadingButton } from 'components/LoadingButton/LoadingButton'

const YEAR_BUTTONS = [1, 2, 3, 4]

interface CheckoutCommitStepProps {
  domain: Domain
  name: string
  durationYears: number
  onDurationChanged?: (year: number) => void
}

export const CheckoutCommitStep = (props: CheckoutCommitStepProps) => {
  // TODO: handle no network and no account
  const chainId = useChainId()
  const { address } = useAccount() // can be undefined

  // TODO: fix ReferenceError: crypto is not defined
  // const secret = useMemo(() => "1349404", [])
  const secret = '0xf9502d93b2a556e997ee7d177d3f3c620a00b02426100d91941a5915f6d5ad45'

  const { commitmentHash } = useMakeCommitment(props.name, address, secret, toNetwork(chainId))

  const { write, isLoading, error } = useSendCommit({
    commitmentHash,
    chainId: chainId,
    owner: address!,
    name: props.name,
    duration: props.durationYears * YEAR_IN_SECONDS,
    secret: secret,
    fields: {}
  })

  console.log(
    `name: ${props.name}, address: ${address}, secret: ${secret}, network: ${toNetwork(chainId)}`
  )
  console.log(`commitmentHash: ${commitmentHash}`)

  const onStartClick = () => {
    if (typeof write === 'undefined') return

    // TODO: generate random secret
    write()
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
              [styles.yearButtonSelected]: year === props.durationYears
            })}
            onClick={() => props.onDurationChanged?.(year)}
          >
            {formatYears(year)}
          </div>
        ))}
      </div>

      <div className={styles.header}>Domain Ownership</div>
      <div className={styles.subheader}>Optionally buy this domain on another wallet</div>

      <div className={styles.inputContainer}>
        <div className={styles.inputIcon}>
          <EthereumIcon />
        </div>
        <input
          name="owner"
          placeholder="0x01234...F0A0 (Optional)"
          autoComplete="off"
          className={`${styles.owner} ${ui.input}`}
        />
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

      <LoadingButton
        className={styles.commitButton}
        onClick={() => !isLoading && onStartClick()}
        isLoading={isLoading}
        text="Start registration"
      />

      {/* TODO: remove temp error solution */}
      {error && <div className={styles.error}>{error.message}</div>}
    </div>
  )
}
