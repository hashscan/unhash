import React, { useEffect, useState } from 'react'
import styles from './SendName.module.css'
import { Button } from 'components/ui/Button/Button'
import { TransactionButton } from 'components/TransactionButton/TransactionButton'
import { AddressInput } from 'components/ui/AddressInput/AddressInput'
import { useSendName } from 'lib/hooks/useSendName'
import { Domain } from 'lib/types'
import { useNotifier } from 'lib/hooks/useNotifier'
import { useDomainInfo } from 'lib/hooks/useDomainInfo'
import { SendNameSuccess } from './SendNameSuccess'
import { DialogExternalProps } from 'components/ui/Dialog/Dialog'
import { Dialog } from 'components/ui/Dialog/Dialog'
import { trackGoal } from 'lib/analytics'

export interface SendNameProps extends DialogExternalProps {
  params: { domain: Domain }
}

export const SendName = ({
  params: { domain },
  closeDialog,
  closeDialogWithSuccess,
  ...rest
}: SendNameProps) => {
  const notify = useNotifier()
  const [address, setAddress] = useState<string | undefined>()
  useEffect(() => trackGoal('OpenSendNameDialog'), [])

  // fetch name's token id
  const domainInfo = useDomainInfo(domain)

  // transaction to send name
  const {
    write: sendTransaction,
    status,
    txHash,
    isSuccess
  } = useSendName({
    isWrapped: domainInfo?.isWrapped ?? false,
    tokenId: domainInfo?.tokenId,
    toAddress: address,
    onError: (error) => notify(error.message, { status: 'error' })
  })
  const sendName = () => {
    // TODO: show input error if address is not set
    if (sendTransaction) {
      trackGoal('SendNameClick')
    }
    sendTransaction?.()
  }

  const isControlsDisabled = status !== 'idle'

  return (
    <Dialog
      {...rest}
      size={'md'}
      footer={
        !isSuccess && (
          <div className={styles.footer}>
            <Button
              size={'regular'}
              variant={'ghost'}
              disabled={isControlsDisabled}
              onClick={() => closeDialog()}
            >
              Cancel
            </Button>
            <TransactionButton status={status} size={'regular'} onClick={sendName}>
              Send&nbsp;&nbsp;→
            </TransactionButton>
          </div>
        )
      }
    >
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
          defaultValue={address}
          onAddressChange={(value) => setAddress(value ?? undefined)}
        />
        <div className={styles.hint}>
          {
            "Sending a name won't change it's public profile or a manager. Name will still be linked to the same address. But a new owner can change that."
          }
        </div>

        {isSuccess && (
          <SendNameSuccess
            className={styles.success}
            domain={domain}
            txHash={txHash ?? ''}
            onClose={() => closeDialogWithSuccess()}
          />
        )}
      </div>
    </Dialog>
  )
}
