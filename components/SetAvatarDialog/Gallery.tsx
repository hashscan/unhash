import React, { ComponentProps, useEffect, useState } from 'react'
import loadImages from 'image-promise'
import clsx from 'clsx'

import useInfiniteScroll from 'react-infinite-scroll-hook'

import { ContinuationToken, fetchAvatarTokens, NFTAvatarOption } from './data'

import styles from './Gallery.module.css'

const IMAGE_LOAD_TIMEOUT = 5000
const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject('Timeout!'), ms))

interface Props extends ComponentProps<'div'> {
  onSelectNFT: (nft: NFTAvatarOption) => void
  address: string
}

export const Gallery = ({ className, onSelectNFT, address, ...rest }: Props) => {
  const [selectedNftId, setSelectedNftId] = useState<string>()
  const [isLoadingNfts, setIsLoadingNfts] = useState(true)

  const [NFTs, setNFTs] = useState<NFTAvatarOption[]>([])
  const [continuationToken, setContinuationToken] = useState<ContinuationToken>()

  const canLoadMore = Boolean(continuationToken) || NFTs.length === 0

  const loadMore = async () => {
    setIsLoadingNfts(true)

    const { nfts: batch, continuation } = await fetchAvatarTokens({
      address,
      limit: 12,
      continuation: continuationToken
    })

    try {
      // preload images to avoid flickering
      const images = batch.map((n) => n.image)
      await Promise.race([loadImages(images), timeout(IMAGE_LOAD_TIMEOUT)])

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
    <div className={clsx(styles.grid, className)} {...rest}>
      {Array(displayedCells)
        .fill(0)
        .map((_, i) => {
          if (isLoadingNfts || i >= nftsCount)
            return (
              <div key={i} className={clsx(styles.cell, { [styles.cellLoading]: isLoadingNfts })} />
            )

          if (i < nftsCount) {
            const nft = NFTs[i]

            return (
              <div className={clsx(styles.cell)} key={i}>
                <NFTPreview
                  nft={nft}
                  index={i}
                  onClick={() => {
                    onSelectNFT(nft)
                    setSelectedNftId(nft.id)
                  }}
                  isSelected={nft.id === selectedNftId}
                />
              </div>
            )
          }
        })}

      <div className={styles.loadMore} ref={sentryRef}></div>
    </div>
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