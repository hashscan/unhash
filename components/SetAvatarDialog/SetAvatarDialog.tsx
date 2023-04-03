import { useEffect, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'

import { TransactionButton } from 'components/TransactionButton/TransactionButton'
import { Navigation } from './Navigation'
import { Button } from 'components/ui/Button/Button'
import { Gallery } from './Gallery'
import { Dialog, DialogExternalProps } from 'components/ui/Dialog/Dialog'

import { useSendSetAvatar } from 'lib/hooks/useSendSetAvatar'
import { useNotifier } from 'lib/hooks/useNotifier'
import { NFTToken, toNetwork, UserInfo } from 'lib/types'
import api from 'lib/api'
import { Domain } from 'lib/types'

import styles from './SetAvatarDialog.module.css'

export interface SetAvatarDialogProps extends DialogExternalProps {}

export const SetAvatarDialog = ({
  closeDialog,
  closeDialogWithSuccess,
  ...rest
}: SetAvatarDialogProps) => {
  const notify = useNotifier()
  const { address } = useAccount()
  const network = toNetwork(useChainId())

  const [user, setUser] = useState<UserInfo>()
  const domain: Domain = user?.primaryName?.name!
  const [selectedAvatar, setSelectedAvatar] = useState<NFTToken | null>(null)

  const { sendSetAvatar, status: transactionStatus } = useSendSetAvatar({
    domain,
    avatar: selectedAvatar,
    onSuccess: () => {
      closeDialogWithSuccess()
    },
    onError: (error) => {
      notify(error.message, { status: 'error' })
    }
  })

  useEffect(() => {
    ;(async () => {
      const user = await api.userInfo(address!, network)
      setUser(user)
    })()
  }, [])

  // can't close when there is a pending transaction
  const canCloseDialog = transactionStatus === 'idle'
  const buttonEnabled = Boolean(selectedAvatar && user)

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
              disabled={!buttonEnabled}
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

      <Gallery
        currentAvatarRecord={user?.primaryName?.avatar}
        onSelectNFT={(nft) => setSelectedAvatar(nft)}
      />
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
