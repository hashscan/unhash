import React, { ComponentProps, useEffect, useState } from 'react'
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

const NFTs = Array.from({ length: 6 }).map((_, i) => ({
  id: 'nft' + i,
  img: `https://loremflickr.com/640/640/graffiti?random=${i}`
}))

export const SetAvatarDialog = ({ className, ...rest }: SetAvatarDialogProps) => {
  const nftsCount = NFTs.length
  const displayedCells = Math.max(8, 4 * Math.ceil(nftsCount / 4))

  const [isLoadingNfts, setIsLoadingNfts] = useState(true)

  useEffect(() => {
    setIsLoadingNfts(true)
    setTimeout(() => {
      setIsLoadingNfts(false)
    }, 1000)
  }, [])

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
              {Array(displayedCells)
                .fill(0)
                .map((_, i) => {
                  if (isLoadingNfts || i >= nftsCount)
                    return (
                      <div
                        key={i}
                        className={clsx(styles.cell, { [styles.cellLoading]: isLoadingNfts })}
                      />
                    )

                  if (i < nftsCount) {
                    return (
                      <div
                        className={clsx(styles.cell, { [styles.cellSelected]: i === 1 })}
                        key={i}
                        style={{ backgroundImage: `url(${NFTs[i].img})` }}
                      ></div>
                    )
                  }
                })}
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
