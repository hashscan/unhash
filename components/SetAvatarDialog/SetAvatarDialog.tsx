import React, { useState } from 'react'

import { Button } from 'components/ui/Button/Button'
import { Navigation } from './Navigation'
import { Gallery } from './Gallery'
import { Dialog, DialogExternalProps } from 'components/ui/Dialog/Dialog'

import { closeDialog } from 'lib/dialogs'

import styles from './SetAvatarDialog.module.css'
export interface SetAvatarDialogProps extends DialogExternalProps {}

export const SetAvatarDialog = ({ ...rest }: SetAvatarDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Dialog
      {...rest}
      size={'lg'}
      canCloseDialog={!isLoading} // can't close when there is a pending transaction
      footer={
        <>
          <div className={styles.footer}>
            <Button size={'regular'} variant={'ghost'} onClick={() => closeDialog()}>
              Cancel
            </Button>

            <Button
              className={styles.buttonSend}
              isLoading={isLoading}
              size={'regular'}
              disabled={false}
              onClick={handleClick}
            >
              Set Avatar →
            </Button>
          </div>
        </>
      }
    >
      <Header />

      <div className={styles.nav}>
        <Navigation tab="nft" />
      </div>

      <Gallery address="TODO" onSelectNFT={() => {}} />
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
