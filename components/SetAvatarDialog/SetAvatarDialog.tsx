import React, { ComponentProps, useEffect, useState } from 'react'
import loadImages from 'image-promise'
import clsx from 'clsx'

import { Button } from 'components/ui/Button/Button'
import { Navigation } from './Navigation'
import { LoaderSpinner } from 'components/icons'
import { ContinuationToken, fetchAvatarTokens, NFTAvatarOption } from './data'

import styles from './SetAvatarDialog.module.css'
import useInfiniteScroll from 'react-infinite-scroll-hook'

export interface SetAvatarDialogProps extends ComponentProps<'div'> {}

const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject('Timeout!'), ms))

export const SetAvatarDialog = ({ className, ...rest }: SetAvatarDialogProps) => {
  const [selectedNftId, setSelectedNftId] = useState<string>()
  const [isLoadingNfts, setIsLoadingNfts] = useState(true)

  const [NFTs, setNFTs] = useState<NFTAvatarOption[]>([])
  const [continuationToken, setContinuationToken] = useState<ContinuationToken>()

  const canLoadMore = Boolean(continuationToken) || NFTs.length === 0

  const loadMore = async () => {
    // if (isLoadingNfts) return
    const LOAD_TIMEOUT = 5000
    setIsLoadingNfts(true)

    const { nfts: batch, continuation } = await fetchAvatarTokens({
      address: 'TODO',
      limit: 12,
      continuation: continuationToken
    })

    try {
      // preload images to avoid flickering
      const images = batch.map((n) => n.image)
      await Promise.race([loadImages(images), timeout(LOAD_TIMEOUT)])

      // all images loaded
    } catch (e) {
      // wait time is too long or some images failed to load, just show it anyway
    }

    setNFTs((nfts) => [...nfts, ...batch])
    setContinuationToken(continuation)
    setIsLoadingNfts(false)
  }

  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingNfts,
    hasNextPage: canLoadMore,
    onLoadMore: loadMore
  })

  useEffect(() => {
    loadMore()
  }, [])

  const nftsCount = NFTs.length
  const displayedCells = Math.max(8, 4 * Math.ceil(nftsCount / 4))

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

              <div className={styles.loadMore} ref={sentryRef}></div>
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
