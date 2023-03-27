import React, { ComponentProps, useState } from 'react'
import styles from './SetAvatarDialog.module.css'

import clsx from 'clsx'

import { Button } from 'components/ui/Button/Button'
import { Navigation } from './Navigation'

export interface SetAvatarDialogProps extends ComponentProps<'div'> {}

const Header = ({ onClose }: { onClose: () => void }) => {
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

export const SetAvatarDialog = ({ className, ...rest }: SetAvatarDialogProps) => {
  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles.overlay}>
        <div {...rest} className={clsx(className, styles.modal)}>
          <Header onClose={() => {}} />

          <div className={styles.body}>
            <div className={styles.nav}>
              <Navigation tab="nft" />
            </div>

            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div className={styles.item} key={i} />
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <Button size={'regular'} variant={'ghost'}>
              Cancel
            </Button>

            <Button
              className={styles.buttonSend}
              isLoading={false}
              size={'regular'}
              onClick={() => {}}
            >
              Set Avatar →
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
