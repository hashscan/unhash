import { ComponentProps, useEffect, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import loadImages from 'image-promise'
import clsx from 'clsx'

import { NFTToken } from 'lib/types'
import { useFetchNFTs } from './useFetchNFTs'
import styles from './Gallery.module.css'

const IMAGE_LOAD_TIMEOUT = 5000

const ITEMS_PER_PAGE = 16

const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject('Timeout!'), ms))

interface Props extends ComponentProps<'div'> {
  onSelectNFT: (nft: NFTToken) => void
  currentNFTAvatar: NFTToken | null
}

export const Gallery = ({ className, onSelectNFT, currentNFTAvatar, ...rest }: Props) => {
  const [selectedNFTId, setSelectedNFTId] = useState<string>()
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true)

  const [NFTs, setNFTs] = useState<NFTToken[]>([])
  const [continuationToken, setContinuationToken] = useState<string>()

  const fetchNFts = useFetchNFTs(ITEMS_PER_PAGE, continuationToken)
  const canLoadMore = Boolean(continuationToken)

  const loadMore = async () => {
    setIsLoadingNFTs(true)
    const { tokens: batch, continuation } = await fetchNFts()

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
    setIsLoadingNFTs(false)
  }

  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingNFTs,
    hasNextPage: canLoadMore,
    onLoadMore: loadMore
  })

  useEffect(() => {
    loadMore()
  }, [])

  const nftsCount = NFTs.length

  const columns = 4

  const rowsWithItems = Math.ceil(nftsCount / columns) // how many rows does all items occupy
  const rowsToDisplay = Math.max(2, isLoadingNFTs ? rowsWithItems + 1 : rowsWithItems)

  // what item should be highlighted?
  const highlightedNFTId = selectedNFTId || currentNFTAvatar?.id

  return (
    <div className={clsx(styles.container, className)} {...rest}>
      <div className={styles.grid}>
        {Array(rowsToDisplay * columns)
          .fill(0)
          .map((_, i) => {
            if (i < nftsCount) {
              const nft = NFTs[i]
              const isSelected = nft.id === highlightedNFTId

              return (
                <div className={clsx(styles.cell, { [styles.cell_selected]: isSelected })} key={i}>
                  <NFTPreview
                    nft={nft}
                    indexWithinBatch={i % ITEMS_PER_PAGE}
                    onClick={() => {
                      onSelectNFT(nft)
                      setSelectedNFTId(nft.id)
                    }}
                    isSelected={isSelected}
                  />
                </div>
              )
            } else {
              // That is a placeholder cell

              return (
                <div
                  key={i}
                  className={clsx(styles.cell, { [styles.cell_loading]: isLoadingNFTs })}
                />
              )
            }
          })}

        <div className={styles.sentry} ref={sentryRef}></div>
      </div>
    </div>
  )
}

const NFTPreview = ({
  nft,
  onClick,
  isSelected,
  indexWithinBatch = 0
}: {
  nft: NFTToken
  onClick: () => void
  isSelected: boolean
  indexWithinBatch: number
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100) // toggle appear animation
  }, [])

  // staggered animation
  const transitionDelay = `${Math.min(indexWithinBatch * 0.07, 1)}s`

  return (
    <div
      className={clsx(styles.nftPreview, {
        [styles.nftPreview_selected]: isSelected
      })}
    >
      <div
        style={{ transitionDelay, backgroundImage: `url(${nft.image})` }}
        onClick={onClick}
        className={clsx(styles.nftPreviewImage, {
          [styles.nftPreviewImage_visible]: isVisible
        })}
      />
    </div>
  )
}
