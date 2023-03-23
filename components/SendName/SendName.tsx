import React, { ComponentProps, useState } from 'react'
import styles from './SendName.module.css'
import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import { AddressInput } from 'components/ui/AddressInput/AddressInput'
import { useSendName } from 'lib/hooks/useSendName'
import { Domain } from 'lib/types'
import { useNotifier } from 'lib/hooks/useNotifier'
import { useDomainInfo } from 'lib/hooks/useDomainInfo'

export interface SendNameProps extends ComponentProps<'div'> {
  domain: Domain
  onClose?: () => void
}

export const SendName = ({ domain, onClose, className, ...rest }: SendNameProps) => {
  const notify = useNotifier()
  const [address, setAddress] = useState<string>()

  // fetch name's token id
  const domainInfo = useDomainInfo(domain)

  // transaction to send name
  const { write: sendTransaction, isLoading: isSending } = useSendName({
    tokenId: domainInfo?.tokenId,
    toAddress: address,
    onError: (error) => notify(error.message, { status: 'error' }),
    onSuccess: () => {
      notify(`${domain} has been sent!`, { status: 'info' })
      onClose?.()
    }
  })
  const sendName = () => {
    // TODO: show input error if address is not set
    // TODO: track analytics event
    sendTransaction?.()
  }

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
          disabled={isSending}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className={styles.hint}>
          {
            "Sending a name won't change it's public profile or a manager. Name will still be linked to the same address. But a new owner can change that."
          }
        </div>
      </div>
      <div className={styles.footer}>
        <Button size={'regular'} variant={'ghost'} disabled={isSending} onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button
          className={styles.buttonSend}
          isLoading={isSending}
          size={'regular'}
          onClick={sendName}
        >
          Send&nbsp;&nbsp;→
        </Button>
      </div>
    </div>
  )
}
