/* eslint-disable @next/next/no-img-element */
import React, { ComponentProps, useState } from 'react'
import styles from './SendName.module.css'
import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import { AddressInput } from 'components/ui/AddressInput/AddressInput'

export interface SendNameProps extends ComponentProps<'div'> {
  domain: string
  onClose?: () => void
}

export const SendName = ({ domain, onClose, className, ...rest }: SendNameProps) => {
  const [address, setAddress] = useState<string>('')
  const onSend = () => {
    console.log('send')
  }
  const isLoading = false

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
          disabled={isLoading}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className={styles.hint}>
          This address will be a new owner this name. Controller and profile settings won’t be
          changed now, but can be changed by a new owner later.
        </div>
      </div>
      <div className={styles.footer}>
        <Button size={'regular'} variant={'ghost'} onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button
          className={styles.buttonSend}
          isLoading={isLoading}
          size={'regular'}
          onClick={onSend}
        >
          Send&nbsp;&nbsp;→
        </Button>
      </div>
    </div>
  )
}
