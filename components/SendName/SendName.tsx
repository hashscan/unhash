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
          By sending the <b>{domain}</b> name, you will give the new address full control over it.
        </div>

        <AddressInput
          labelClassName={styles.addressLabel}
          label="Send to"
          placeholder="Enter Ethereum address or name ENS..."
          disabled={isSending}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className={styles.hint}>
          This address will be a new owner this name. Controller and profile settings won’t be
          changed now, but can be changed by a new owner later.
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
