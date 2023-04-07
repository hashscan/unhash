import { ComponentProps, useEffect, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import loadImages from 'image-promise'
import clsx from 'clsx'
import useEvent from 'react-use-event-hook'

import { NFTToken } from 'lib/types'
import { nftToAvatarRecord } from 'lib/utils'
import { useFetchNFTs } from './useFetchNFTs'
import styles from './Gallery.module.css'

const IMAGE_LOAD_TIMEOUT = 10_000

const ITEMS_PER_PAGE = 16

const timeout = (ms: number) =>
  new Promise((_, reject) => setTimeout(() => reject({ timeout: true }), ms))

interface Props extends ComponentProps<'div'> {
  onSelectNFT: (nft: NFTToken) => void
  currentAvatarRecord: string | undefined
  hideFailedToLoadItems?: boolean
}

export const Gallery = ({
  className,
  onSelectNFT,
  currentAvatarRecord,
  hideFailedToLoadItems = false,
  ...rest
}: Props) => {
  const [selectedNFTId, setSelectedNFTId] = useState<string>()
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true)

  const [NFTs, setNFTs] = useState<NFTToken[]>([])
  const [continuationToken, setContinuationToken] = useState<string>()

  const fetchNFts = useFetchNFTs(ITEMS_PER_PAGE, continuationToken)
  const canLoadMore = Boolean(continuationToken)

  const loadMore = useEvent(async () => {
    setIsLoadingNFTs(true)
    const { tokens: batch, continuation } = await fetchNFts()

    const itemsToLoad = batch.filter((n) => Boolean(n.image))
    let loadedBatch: NFTToken[] = [] // items to be added to the list

    try {
      // preload images to avoid flickering
      const images = itemsToLoad.map((n) => n.image)
      await Promise.race([loadImages(images), timeout(IMAGE_LOAD_TIMEOUT)])

      // all images loaded
      loadedBatch = itemsToLoad
    } catch (e: any) {
      if (hideFailedToLoadItems && Array.isArray(e?.errored)) {
        // only show items that loaded successfully
        const failedToLoad = (e.errored as HTMLImageElement[]).map((i) => i.src)
        loadedBatch = itemsToLoad.filter((n) => !failedToLoad.includes(n.image))
      } else {
        // wait time is too long, just show it anyway
        loadedBatch = itemsToLoad
      }
    }

    setNFTs((nfts) => [...nfts, ...loadedBatch])
    setContinuationToken(continuation)
    setIsLoadingNFTs(false)
  })

  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingNFTs,
    hasNextPage: canLoadMore,
    onLoadMore: loadMore
  })

  useEffect(() => {
    loadMore()
  }, [loadMore])

  const nftsCount = NFTs.length
  const cellsToDisplay = Math.max(4 * 3, nftsCount)

  return (
    <div className={clsx(styles.container, className)} {...rest}>
      <div className={styles.grid}>
        {Array(cellsToDisplay)
          .fill(0)
          .map((_, i) => {
            if (i < nftsCount) {
              const nft = NFTs[i]

              // When nothing is selected we fall back to the currently used avatar
              const isSelected = selectedNFTId
                ? nft.id === selectedNFTId
                : nftToAvatarRecord(nft) === currentAvatarRecord

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
