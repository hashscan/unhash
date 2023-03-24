import React, { ComponentProps, useState } from 'react'
import styles from './SendName.module.css'
import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import { Domain } from 'lib/types'
import { useNotifier } from 'lib/hooks/useNotifier'
import { useDomainInfo } from 'lib/hooks/useDomainInfo'
import { RenewNameSuccess } from './RenewNameSuccess'

export interface RenewNameProps extends ComponentProps<'div'> {
  domain: Domain
  onClose?: () => void
  onSuccess?: () => void
}

export const SendName = ({ domain, onClose, onSuccess, className, ...rest }: RenewNameProps) => {
  const notify = useNotifier()
  const [address, setAddress] = useState<string>()

  // fetch name's token id
  const domainInfo = useDomainInfo(domain)

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
          By renewing the <b>{domain}</b> name, you transfer to the recipient a full control over
          it.
        </div>

        {/* TODO: add selector */}
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
          domain={domain}
          txHash={txHash ?? ''}
          onClose={() => onClose?.()}
        />
      )}
    </div>
  )
}
