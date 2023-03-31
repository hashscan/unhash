import {
  forwardRef,
  useState,
  useImperativeHandle,
  useCallback,
  FormEventHandler,
  useEffect
} from 'react'
import clsx from 'clsx'

import styles from './DomainSearchBar.module.css'
import { SearchStatus } from './types'
import { useSearch } from './useSearch'
import { useRouterNavigate } from 'lib/hooks/useRouterNavigate'
import { normalizeDotETH, findSuffix, statusToLEDColor } from './utils'
import { trackGoal } from 'lib/analytics'

import { StatusBadge } from 'components/ui/StatusBadge/StatusBadge'
import { SearchButton } from './SearchButton'
import { BuyBadge } from 'components/ui/BuyBadge/BuyBadge'
import { notNull } from 'lib/utils'

// allow parent components to imperatively update search string using ref
export interface SearchBarHandle {
  setSearch: (val: string) => void
}

export const DomainSearchBar = forwardRef<SearchBarHandle, {}>(function SearchBarWithRef(
  _props,
  ref
) {
  const [isBulkEnabled, set] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    set(params.has('bulk') || params.has('bulk_registration') || params.has('batch'))
  }, [])

  const [searchQuery, setSearchQueryRaw] = useState('')
  const [names, setNames] = useState<string[]>([])
  const [, setIsFocused] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const setSearchQuery = useCallback((val: string) => {
    setSearchQueryRaw(normalizeDotETH(val))
  }, [])

  const suffix = findSuffix(searchQuery)
  const normalized = searchQuery.length ? normalizeDotETH(searchQuery + suffix) : ''

  const { status, validationMessage, errorMessage } = useSearch(normalized, false, names)
  const { listing } = useSearch(normalized, true) // run parallel search for listing
  const navigate = useRouterNavigate()

  const registerDomain = useCallback(() => {
    if (!names.length && (isNavigating || status !== SearchStatus.Available)) return

    const finalNamesForRegistration = names.concat(normalized).filter(notNull)

    trackGoal('SearchRegisterClick', { props: { names: finalNamesForRegistration.join(',') } })
    setIsNavigating(true)

    const params = new URLSearchParams(
      finalNamesForRegistration.map((name) => ['names', name])
    ).toString()

    navigate(`/register?${params}`).finally(() => {
      setIsNavigating(false)
    })
  }, [isNavigating, names, navigate, normalized, status])

  const handleSubmit: FormEventHandler = useCallback(
    (e) => {
      e.preventDefault()
      registerDomain()
    },
    [registerDomain]
  )

  useImperativeHandle(ref, () => ({
    setSearch(value: string) {
      setSearchQuery(value)
    }
  }))

  return (
    <>
      <div className={styles.searchBar}>
        <div className={styles.inputWithSuffix}>
          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
              spellCheck="false"
              placeholder="Search for .eth domain..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
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
            isBucketEmpty={!names.length}
            onBulk={() => {
              setNames((names) => [...names, normalized])
              setSearchQuery('')
            }}
            isNavigating={isNavigating}
            onClick={registerDomain}
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
          {status === SearchStatus.NotAvailable && (
            <>
              <b>{normalized}</b> is not available
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
        {listing && <BuyBadge listing={listing} />}
      </div>

      {!!names.length && (
        <div>
          selected for registration <strong>{names.join(', ')}</strong>
        </div>
      )}
    </>
  )
})
