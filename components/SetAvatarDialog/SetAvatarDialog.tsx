import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { TransactionButton } from 'components/TransactionButton/TransactionButton'
import { Navigation } from './Navigation'
import { Button } from 'components/ui/Button/Button'
import { Dialog, DialogExternalProps } from 'components/ui/Dialog/Dialog'

import { useSendSetAvatar } from 'lib/hooks/useSendSetAvatar'
import { useNotifier } from 'lib/hooks/useNotifier'
import { NFTToken, UserInfo } from 'lib/types'
import api from 'lib/api'
import { Domain } from 'lib/types'

import { Gallery } from './Gallery'
import { Preview } from './Preview'
import styles from './SetAvatarDialog.module.css'
import useEvent from 'react-use-event-hook'
import { trackGoal } from 'lib/analytics'

export interface SetAvatarDialogProps extends DialogExternalProps {
  params: {}
}

export const SetAvatarDialog = ({
  closeDialog,
  closeDialogWithSuccess,
  ...rest
}: SetAvatarDialogProps) => {
  const notify = useNotifier()
  const { address } = useAccount()
  useEffect(() => trackGoal('OpenSetAvatarDialog'), [])

  const [user, setUser] = useState<UserInfo>()
  const domain: Domain = user?.primaryName?.name!
  const [selectedAvatar, setSelectedAvatar] = useState<NFTToken | null>(null)
  const nameResolver = useMemo<string | undefined>(() => {
    const name = user?.primaryName?.name
    if (!name) return undefined
    return user.domains.find((d) => d.name === name)?.resolver
  }, [user])

  const { sendSetAvatar, status: transactionStatus } = useSendSetAvatar({
    domain,
    resolver: nameResolver,
    avatar: selectedAvatar,
    onSuccess: () => {
      closeDialogWithSuccess()
    },
    onError: (error) => {
      notify(error.message, { status: 'error' })
    }
  })

  const loadUser = useEvent(async () => {
    const user = await api.userInfo(address!)
    setUser(user)
  })

  useEffect(() => {
    loadUser()
  }, [loadUser])

  // can't close when there is a pending transaction
  const canCloseDialog = transactionStatus === 'idle'
  const isPreviewVisible = transactionStatus !== 'idle'
  const buttonEnabled = Boolean(selectedAvatar && user)

  return (
    <Dialog
      {...rest}
      size={'lg'}
      canCloseDialog={canCloseDialog}
      footer={
        <>
          <div className={styles.footer}>
            <Button
              size={'regular'}
              variant={'ghost'}
              onClick={() => canCloseDialog && closeDialog()}
            >
              Cancel
            </Button>

            <TransactionButton
              className={styles.buttonSend}
              status={transactionStatus}
              size={'medium'}
              disabled={!buttonEnabled}
              onClick={() => {
                if (sendSetAvatar) {
                  trackGoal('SaveAvatarClick')
                }
                sendSetAvatar?.()
              }}
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

      <div className={styles.galleryWithPreview}>
        <Gallery
          currentAvatarRecord={user?.primaryName?.avatar}
          onSelectNFT={(nft) => setSelectedAvatar(nft)}
          hideFailedToLoadItems
        />

        <Preview
          visible={isPreviewVisible}
          address={address}
          name={user?.primaryName?.name}
          avatarImg={selectedAvatar?.image}
        />
      </div>
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
