import React, { ComponentProps, useState } from 'react'
import styles from './RenewName.module.css'
import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import { useNotifier } from 'lib/hooks/useNotifier'
import { RenewNameSuccess } from './RenewNameSuccess'
import { UserDomain } from 'lib/types'
import { formatExpiresOn } from 'lib/format'
import { RenewYearSelect } from './RenewYearSelect'

export interface RenewNameProps extends ComponentProps<'div'> {
  domain: UserDomain
  onClose?: () => void
  onSuccess?: () => void
}

export const RenewName = ({ domain, onClose, onSuccess, className, ...rest }: RenewNameProps) => {
  const notify = useNotifier()
  const [address, setAddress] = useState<string>()

  // // fetch name's token id
  // const domainInfo = useDomainInfo(domain.name)

  // // transaction to send name
  // const {
  //   write: sendTransaction,
  //   isLoading: isSending,
  //   txHash,
  //   isSuccess
  // } = useSendName({
  //   tokenId: domainInfo?.tokenId,
  //   toAddress: address,
  //   onError: (error) => notify(error.message, { status: 'error' }),
  //   onSuccess: () => onSuccess?.()
  // })

  // mocked data
  const sendTransaction = () => {}
  const isLoading = false
  const txHash = undefined
  const isSuccess = false

  const renewName = () => {
    // TODO: show input error if address is not set
    // TODO: track analytics event
    sendTransaction?.()
  }

  return (
    <div {...rest} className={clsx(className, styles.modal)}>
      <div className={styles.body}>
        <div className={styles.title}>Renew name</div>
        <div className={styles.text}>
          The <b>{domain.name}</b> name expires on <b>{formatExpiresOn(domain.expiresAt!)}</b>.
          Expired domains are available for a public auction. Learn more.
        </div>

        <div className={styles.yearLabel}>Renew for</div>
        {/* TODO: add select */}
        <RenewYearSelect className={styles.yearSelect} />
        <div className={styles.hint}>{'Renewal will cost you ...'}</div>
      </div>
      <div className={styles.footer}>
        <Button size={'regular'} variant={'ghost'} disabled={isLoading} onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button
          className={styles.buttonRenew}
          isLoading={isLoading}
          size={'regular'}
          onClick={renewName}
        >
          Renew&nbsp;&nbsp;→
        </Button>
      </div>
      {isSuccess && (
        <RenewNameSuccess
          className={styles.success}
          domain={domain.name}
          txHash={txHash ?? ''}
          onClose={() => onClose?.()}
        />
      )}
    </div>
  )
}
