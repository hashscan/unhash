import { TransactionButton } from 'components/TransactionButton/TransactionButton'
import { Navigation } from './Navigation'
import { Button } from 'components/ui/Button/Button'
import { Gallery } from './Gallery'
import { Dialog, DialogExternalProps } from 'components/ui/Dialog/Dialog'

import { closeDialog } from 'lib/dialogs'
import { useSendSetAvatar } from 'lib/hooks/useSendSetAvatar'
import { useNotifier } from 'lib/hooks/useNotifier'

import styles from './SetAvatarDialog.module.css'

export interface SetAvatarDialogProps extends DialogExternalProps {}

export const SetAvatarDialog = ({ ...rest }: SetAvatarDialogProps) => {
  const notify = useNotifier()

  /* TODO */
  const selectedAvatar = {
    contract: '0xf4910C763eD4e47A585E2D34baA9A4b611aE448C',
    name: '59857614512082825327428480450306278281310723451016971068357972524612578182120',
    kind: 'erc1155'
  } as const

  const address = '0xd6959D3940BfcfA451726F897c0DB5864F6F8fc9'
  const domain = 'capitalgang.eth'
  /* /TODO */

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

      <Gallery address={address} onSelectNFT={() => {}} />
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
