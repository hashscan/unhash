import React from 'react'

import { Button } from 'components/ui/Button/Button'
import { Navigation } from './Navigation'
import { Gallery } from './Gallery'
import { Dialog, DialogExternalProps } from 'components/ui/Dialog/Dialog'

import styles from './SetAvatarDialog.module.css'
export interface SetAvatarDialogProps extends DialogExternalProps {}

export const SetAvatarDialog = ({ ...rest }: SetAvatarDialogProps) => {
  return (
    <Dialog
      {...rest}
      size={'lg'}
      footer={
        <>
          <div className={styles.footer}>
            <Button size={'regular'} variant={'ghost'}>
              Cancel
            </Button>

            <Button
              className={styles.buttonSend}
              isLoading={false}
              size={'regular'}
              disabled={false}
              onClick={() => {}}
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
