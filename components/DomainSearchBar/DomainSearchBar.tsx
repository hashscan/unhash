import {
  forwardRef,
  useState,
  useImperativeHandle,
  useCallback,
  FormEventHandler,
  useRef
} from 'react'
import clsx from 'clsx'

import styles from './DomainSearchBar.module.css'
import { SearchStatus } from './types'
import { useSearch } from './useSearch'
import { useRouterNavigate } from 'lib/hooks/useRouterNavigate'
import { normalizeDotETH, findSuffix, statusToLEDColor } from './utils'
import { trackGoal } from 'lib/analytics'
import { useCart } from 'lib/hooks/useCart'

import { StatusBadge } from 'components/ui/StatusBadge/StatusBadge'
import { SearchButton } from './SearchButton'
import { MarketplaceListing } from 'components/MarketplaceListing/MarketplaceListing'
import { Button } from 'components/ui/Button/Button'
import { Basket } from 'components/icons'
import { Domain } from 'lib/types'
import { SlideFlap } from 'components/ui/SlideFlap/SlideFlap'
import { useMediaQuery } from '@react-hook/media-query'

// allow parent components to imperatively update search string using ref
export interface SearchBarHandle {
  setSearch: (val: string) => void
}

export const DomainSearchBar = forwardRef<SearchBarHandle, {}>(function SearchBarWithRef(
  _props,
  ref
) {
  const [, updateCart] = useCart()
  const [isBulkEnabled, set] = useState(false)
  const [searchQuery, setSearchQueryRaw] = useState('')
  const [names, setNames] = useState<Domain[]>([])
  const [isNavigating, setIsNavigating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const setSearchQuery = useCallback((val: string) => {
    setSearchQueryRaw(normalizeDotETH(val))
  }, [])

  const suffix = findSuffix(searchQuery)
  const normalized = searchQuery.length ? normalizeDotETH(searchQuery + suffix) : ''

  const { status, validationMessage, errorMessage } = useSearch(normalized, false, names)
  const { listing } = useSearch(normalized, true) // run parallel search for listing
  const navigate = useRouterNavigate()

  const registerDomain = useCallback(() => {
    if (isNavigating || (!names.length && status !== SearchStatus.Available)) return

    const namesForRegistration = isBulkEnabled ? names : ([normalized] as Domain[])

    trackGoal('SearchRegisterClick', { props: { names: namesForRegistration.join(',') } })
    setIsNavigating(true)
    updateCart({ names: namesForRegistration })

    navigate('/register').finally(() => {
      setIsNavigating(false)
    })
  }, [isBulkEnabled, isNavigating, names, navigate, normalized, updateCart, status])

  const addCurrentValueToCart = useCallback(() => {
    if (isNavigating || status !== SearchStatus.Available) return

    setNames((names) => [...names, normalized] as Domain[])
    setSearchQuery('')
    inputRef.current?.focus()
  }, [isNavigating, normalized, setSearchQuery, status])

  const handleSubmit: FormEventHandler = useCallback(
    (e) => {
      e.preventDefault()
      if (isBulkEnabled) {
        addCurrentValueToCart()
      } else {
        registerDomain()
      }
    },
    [addCurrentValueToCart, isBulkEnabled, registerDomain]
  )

  useImperativeHandle(ref, () => ({
    setSearch(value: string) {
      setSearchQuery(value)
      inputRef.current?.focus()
    }
  }))

  const isMobileViewport = useMediaQuery('(max-width: 768px)')
  const inputPlaceholder = isMobileViewport ? 'Type .eth name...' : 'Search for .eth domain...'

  return (
    <>
      <div className={styles.searchBar}>
        <div className={styles.inputWithSuffix}>
          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
              spellCheck="false"
              placeholder={inputPlaceholder}
            ></input>
          </form>

          <div
            className={clsx(styles.suffix, { [styles.suffixVisible]: searchQuery.length !== 0 })}
          >
            {searchQuery}
            <span>{suffix}</span>
          </div>
        </div>

        <div className={styles.action}>
          <SearchButton
            status={status}
            isBulkEnabled={isBulkEnabled}
            isNavigating={isNavigating}
            onClick={() => {
              if (isBulkEnabled) {
                addCurrentValueToCart()
              } else {
                registerDomain()
              }
            }}
          />
        </div>
      </div>

      <div className={styles.badges}>
        <StatusBadge
          className={clsx({
            [styles.availability]: true,
            [styles.availabilityVisible]: status !== SearchStatus.Idle
          })}
          led={statusToLEDColor(status)}
        >
          {status === SearchStatus.Available && (
            <>
              <b>{normalized}</b> is available!
            </>
          )}
          {status === SearchStatus.Taken && (
            <>
              <b>{normalized}</b> is taken
            </>
          )}
          {status === SearchStatus.Duplicate && (
            <>
              <b>{normalized}</b> already in order
            </>
          )}
          {status === SearchStatus.Invalid && <>{validationMessage}</>}
          {status === SearchStatus.Error && <>{errorMessage}</>}
          {status === SearchStatus.Loading && <>Please wait...</>}
          {status === SearchStatus.Idle && <>Please wait...</>}
        </StatusBadge>

        {!isBulkEnabled && status === SearchStatus.Available && (
          <Button
            className={styles.startBulk}
            size={'small'}
            title="Add to cart to register multiple names at once"
            onClick={() => {
              set(true)
              addCurrentValueToCart()
              trackGoal('BulkRegistrationClick')
            }}
          >
            <Basket />
          </Button>
        )}

        {isBulkEnabled && (
          <>
            <div className={styles.space}></div>
            <Button
              className={styles.bulkRegistration}
              size={'small'}
              onClick={() => {
                registerDomain()
              }}
            >
              <div className={styles.bulkRegistrationContent}>
                <span className={styles.namesCount}>
                  <SlideFlap flipKey={String(names.length)}>{names.length}</SlideFlap>
                </span>{' '}
                Register all&nbsp;&nbsp;→
              </div>
            </Button>
          </>
        )}
      </div>

      <div className={styles.buyCardContainer}>
        {listing && <MarketplaceListing name={normalized} listing={listing} />}
      </div>
    </>
  )
})
