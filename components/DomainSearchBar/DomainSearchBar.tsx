import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useCallback,
  FormEventHandler
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

// allow parent components to imperatively update search string using ref
export interface SearchBarHandle {
  setSearch: (val: string) => void
}

export const DomainSearchBar = forwardRef<SearchBarHandle, {}>(function SearchBarWithRef(
  _props,
  ref
) {
  const [searchQuery, setSearchQueryRaw] = useState('')
  const [, setIsFocused] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const setSearchQuery = useCallback((val: string) => {
    setSearchQueryRaw(normalizeDotETH(val))
  }, [])

  const suffix = findSuffix(searchQuery)
  const normalized = searchQuery.length ? normalizeDotETH(searchQuery + suffix) : ''

  const { status, validationMessage, errorMessage } = useSearch(normalized)
  const navigate = useRouterNavigate()

  const registerDomain = useCallback(() => {
    if (isNavigating || status !== SearchStatus.Available) return

    trackGoal('SearchRegisterClick', { props: { domain: normalized } })
    setIsNavigating(true)

    navigate(`${normalized}/register`).finally(() => {
      setIsNavigating(false)
    })
  }, [isNavigating, navigate, normalized, status])

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
              placeholder="Look up .eth domain..."
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
          <SearchButton status={status} isNavigating={isNavigating} onClick={registerDomain} />
        </div>
      </div>

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
        {status === SearchStatus.Invalid && <>{validationMessage}</>}
        {status === SearchStatus.Error && <>{errorMessage}</>}
        {status === SearchStatus.Loading && <>Please wait...</>}
        {status === SearchStatus.Idle && <>Please wait...</>}
      </StatusBadge>
    </>
  )
})
