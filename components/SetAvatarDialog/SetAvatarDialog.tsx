import { useAccount } from 'wagmi'

import { TransactionButton } from 'components/TransactionButton/TransactionButton'
import { Navigation } from './Navigation'
import { Button } from 'components/ui/Button/Button'
import { Gallery } from './Gallery'
import { Dialog, DialogExternalProps } from 'components/ui/Dialog/Dialog'

import { closeDialog } from 'lib/dialogs'
import { useSendSetAvatar } from 'lib/hooks/useSendSetAvatar'
import { useNotifier } from 'lib/hooks/useNotifier'

import styles from './SetAvatarDialog.module.css'
import { NFTToken } from 'lib/types'
import { useState } from 'react'

export interface SetAvatarDialogProps extends DialogExternalProps {}

export const SetAvatarDialog = ({ ...rest }: SetAvatarDialogProps) => {
  const notify = useNotifier()
  const { address } = useAccount()

  const [selectedAvatar, setSelectedAvatar] = useState<NFTToken | null>(null)
  const domain = 'capitalgang.eth' /* TODO */

  const { sendSetAvatar, status: transactionStatus } = useSendSetAvatar({
    domain,
    avatar: selectedAvatar,
    onSuccess: () => {
      closeDialog()
    },
    onError: (error) => {
      notify(error.message, { status: 'error' })
    }
  })

  // can't close when there is a pending transaction
  const canCloseDialog = transactionStatus === 'idle'

  return (
    <Dialog
      {...rest}
      size={'lg'}
      canCloseDialog={canCloseDialog}
      footer={
        <>
          <div className={styles.footer}>
            <Button size={'regular'} variant={'ghost'} onClick={() => closeDialog()}>
              Cancel
            </Button>

            <TransactionButton
              className={styles.buttonSend}
              status={transactionStatus}
              size={'medium'}
              disabled={!Boolean(selectedAvatar)}
              onClick={() => sendSetAvatar?.()}
            >
              Set Avatar
            </TransactionButton>
          </div>
        </>
      }
    >
      <Header />

      <div className={styles.nav}>
        <Navigation tab="nft" />
      </div>

      <Gallery currentNFTAvatar={null} onSelectNFT={(nft) => setSelectedAvatar(nft)} />
    </Dialog>
  )
}

// Modal dialog header
const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.titleAndText}>
        <div className={styles.title}>Set your ENS Avatar</div>
        <div className={styles.text}>
          Choose an avatar that will be displayed next to your ENS name in Web3 apps
        </div>
      </div>
    </div>
  )
}
