import React, { ComponentProps, useState } from 'react'
import styles from './SendName.module.css'
import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import { TransactionButton } from 'components/TransactionButton/TransactionButton'
import { AddressInput } from 'components/ui/AddressInput/AddressInput'
import { useSendName } from 'lib/hooks/useSendName'
import { Domain } from 'lib/types'
import { useNotifier } from 'lib/hooks/useNotifier'
import { useDomainInfo } from 'lib/hooks/useDomainInfo'
import { SendNameSuccess } from './SendNameSuccess'

export interface SendNameProps extends ComponentProps<'div'> {
  domain: Domain
  onClose?: () => void
  onSuccess?: () => void
}

export const SendName = ({ domain, onClose, onSuccess, className, ...rest }: SendNameProps) => {
  const notify = useNotifier()
  const [address, setAddress] = useState<string>()

  // fetch name's token id
  const domainInfo = useDomainInfo(domain)

  // transaction to send name
  const {
    write: sendTransaction,
    status,
    txHash,
    isSuccess
  } = useSendName({
    tokenId: domainInfo?.tokenId,
    toAddress: address,
    onError: (error) => notify(error.message, { status: 'error' }),
    onSuccess: () => onSuccess?.()
  })
  const sendName = () => {
    // TODO: show input error if address is not set
    // TODO: track analytics event
    sendTransaction?.()
  }

  const isControlsDisabled = status !== 'idle'

  return (
    <div {...rest} className={clsx(className, styles.modal)}>
      <div className={styles.body}>
        <div className={styles.title}>Send name</div>
        <div className={styles.text}>
          By sending the <b>{domain}</b> name, you transfer to the recipient a full control over it.
        </div>

        <AddressInput
          labelClassName={styles.addressLabel}
          label="Send to"
          placeholder="Enter address or ENS name..."
          disabled={isControlsDisabled}
          value={address}
          onAddressChange={(a) => setAddress(a || undefined)}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className={styles.hint}>
          {
            "Sending a name won't change it's public profile or a manager. Name will still be linked to the same address. But a new owner can change that."
          }
        </div>
      </div>
      <div className={styles.footer}>
        <Button
          size={'regular'}
          variant={'ghost'}
          disabled={isControlsDisabled}
          onClick={() => onClose?.()}
        >
          Cancel
        </Button>
        <TransactionButton status={status} size={'regular'} onClick={sendName}>
          Send&nbsp;&nbsp;→
        </TransactionButton>
      </div>
      {isSuccess && (
        <SendNameSuccess
          className={styles.success}
          domain={domain}
          txHash={txHash ?? ''}
          onClose={() => onClose?.()}
        />
      )}
    </div>
  )
}
