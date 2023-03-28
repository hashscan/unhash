import React, { ComponentProps, useEffect, useState } from 'react'
import loadImages from 'image-promise'
import clsx from 'clsx'

import { Button } from 'components/ui/Button/Button'
import { Navigation } from './Navigation'
import { Gallery } from './Gallery'
import { LoaderSpinner } from 'components/icons'
import { ContinuationToken, fetchAvatarTokens, NFTAvatarOption } from './data'

import styles from './SetAvatarDialog.module.css'
import useInfiniteScroll from 'react-infinite-scroll-hook'

export interface SetAvatarDialogProps extends ComponentProps<'div'> {}

const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject('Timeout!'), ms))

export const SetAvatarDialog = ({ className, ...rest }: SetAvatarDialogProps) => {
  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles.overlay}>
        <div {...rest} className={clsx(className, styles.modal)}>
          <Header />

          <div className={styles.body}>
            <div className={styles.nav}>
              <Navigation tab="nft" />
            </div>

            <Gallery address="TODO" onSelectNFT={() => {}} />
          </div>

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
        </div>
      </div>
    </>
  )
}

const NFTPreview = ({
  nft,
  index,
  onClick,
  isSelected
}: {
  nft: NFTAvatarOption
  index: number
  onClick: () => void
  isSelected: boolean
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100) // toggle appear animation
  }, [])

  // staggered animation
  const transitionDelay = `${Math.min(index * 0.07, 1)}s`

  return (
    <div
      style={{ transitionDelay, backgroundImage: `url(${nft.image})` }}
      onClick={onClick}
      className={clsx(styles.nftPreview, {
        [styles.nftPreviewVisible]: isVisible,
        [styles.nftPreviewSelected]: isSelected
      })}
    />
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
//
