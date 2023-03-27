import React, { ComponentProps, useEffect, useState } from 'react'
import styles from './SetAvatarDialog.module.css'

import loadImages from 'image-promise'

import clsx from 'clsx'

import { Button } from 'components/ui/Button/Button'
import { Navigation } from './Navigation'

export interface SetAvatarDialogProps extends ComponentProps<'div'> {}

interface NFT {
  id: string
  image: string
  name: string
  collectionName: string
}

const NFTs: NFT[] = Array.from({ length: 6 }).map((_, i) => ({
  id: 'nft' + i,
  image: `https://loremflickr.com/640/640/graffiti?random=${i}`,
  name: 'The Heretical Dictum #389',
  collectionName: 'The Heretical Dictum'
}))

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject('Timeout!'), ms))

export const SetAvatarDialog = ({ className, ...rest }: SetAvatarDialogProps) => {
  const nftsCount = NFTs.length
  const displayedCells = Math.max(8, 4 * Math.ceil(nftsCount / 4))

  const [selectedNftId, setSelectedNftId] = useState<string>()
  const [isLoadingNfts, setIsLoadingNfts] = useState(true)

  useEffect(() => {
    ;(async () => {
      const LOAD_TIMEOUT = 5000
      await delay(1000) // TODO: remove

      try {
        await Promise.race([loadImages(NFTs.map((n) => n.image)), timeout(LOAD_TIMEOUT)])

        // all images loaded
        setIsLoadingNfts(false)
      } catch (e) {
        // wait time is too long or some images failed to load, just show it anyway
        setIsLoadingNfts(false)
      }
    })()
  }, [])

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
                    const nft = NFTs[i]

                    return (
                      <div className={clsx(styles.cell)} key={i}>
                        <NFTPreview
                          nft={nft}
                          index={i}
                          onClick={() => setSelectedNftId(nft.id)}
                          isSelected={nft.id === selectedNftId}
                        />
                      </div>
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
              disabled={!selectedNftId}
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
  nft: NFT
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
