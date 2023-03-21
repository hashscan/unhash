import { useAccount } from 'wagmi'
import styles from './names.module.css'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { AuthLayout } from 'components/AuthLayout/AuthLayout'
import { useCurrentUserInfo } from 'lib/hooks/useUserInfo'
import { useCallback, useMemo, useState } from 'react'
import { LoaderSpinner, Menu as MenuIcon, Search } from 'components/icons'
import clsx from 'clsx'
import Link from 'next/link'
import { formatExpiresIn } from 'lib/format'
import Checkbox from 'components/ui/Checkbox/Checkbox'
import { Menu } from 'components/ui/Menu/Menu'
import { UserDomain } from 'lib/types'
import { useRouter } from 'next/router'

const Names: PageWithLayout = () => {
  const router = useRouter()
  const { isDisconnected } = useAccount()

  // search input filter
  const [filter, setFilter] = useState('')
  const onFilterChange = (input: string) => {
    setFilter(input)
    setSelectedNames([]) // clear selection for simplicity
  }

  // domain list
  const userInfo = useCurrentUserInfo()
  const allDomains = useMemo(
    () =>
      userInfo?.domains
        .filter((d) => d.isValid && (d.controlled || d.owned))
        .sort((a, b) => a.name.localeCompare(b.name)) || [],
    [userInfo]
  )

  const filteredDomains = useMemo(
    () => allDomains.filter((d) => d.name.toLowerCase().includes(filter.toLowerCase())) || [],
    [allDomains, filter]
  )

  // checkbox selection
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const onCheckChange = useCallback(
    (name: string, checked: boolean) => {
      if (checked) {
        setSelectedNames([...selectedNames, name])
      } else {
        setSelectedNames(selectedNames.filter((n) => n !== name))
      }
    },
    [selectedNames, setSelectedNames]
  )

  const allSelected = selectedNames.length === filteredDomains.length
  const onCheckAllChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedNames(filteredDomains.map((d) => d.name))
      } else {
        setSelectedNames([])
      }
    },
    [filteredDomains, setSelectedNames]
  )

  // menu
  const [openMenu, setOpenMenu] = useState<string | undefined>(undefined)
  const onViewDetailsClick = (domain: UserDomain) => {
    router.push(`/${domain.name}/`)
  }
  const onTransferClick = (domain: UserDomain) => {
    console.log('transfer', domain.name)
  }
  const onExtendClick = (domain: UserDomain) => {
    console.log('extend', domain.name)
  }

  // TODO: handle isConnecting state when metamask asked to log in
  if (isDisconnected)
    return <AuthLayout text="Sign in with your wallet to view and manage your ENS domains" />

  // loader
  if (!userInfo) {
    return (
      <div className={styles.loading}>
        <LoaderSpinner className={styles.loader} />
      </div>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.title}>My names</div>

      <div className={styles.searchContainer}>
        <div className={styles.searchIcon}>
          <Search />
        </div>
        <input
          className={styles.searchInput}
          type="search"
          spellCheck="false"
          autoCorrect="false"
          autoCapitalize="false"
          autoComplete="false"
          placeholder="Search..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>

      {/* empty search layout */}
      {filter.length > 0 && filteredDomains.length === 0 && (
        <div className={styles.emptySearch}>
          <div>
            <b>No names found</b>
            <br />
            {`You search for "${filter}" didn't match any name`}
          </div>
        </div>
      )}

      {/* domains table */}
      {filteredDomains.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr className={clsx(styles.row)}>
              <th className={clsx(styles.cell, styles.headCell, styles.selectCell)}>
                <div className={styles.checkboxContainer}>
                  <Checkbox
                    checked={allSelected}
                    onChange={(e) => onCheckAllChange(e.target.checked)}
                  />
                </div>
              </th>
              <th className={clsx(styles.cell, styles.headCell, styles.nameCell)}>Domain</th>
              <th className={clsx(styles.cell, styles.headCell, styles.rightsCell)}>Rights</th>
              <th className={clsx(styles.cell, styles.headCell, styles.expirationCell)}>
                Expiration
              </th>
              <th className={clsx(styles.cell, styles.headCell, styles.menuCell)} />
            </tr>
          </thead>
          <tbody>
            {filteredDomains.map((domain) => (
              <tr key={domain.name} className={styles.row}>
                <td className={clsx(styles.cell, styles.selectCell)}>
                  <div className={styles.checkboxContainer}>
                    <Checkbox
                      checked={selectedNames.includes(domain.name)}
                      onChange={(e) => onCheckChange(domain.name, e.target.checked)}
                    />
                  </div>
                </td>
                <td className={clsx(styles.cell, styles.nameCell)}>
                  <Link className={styles.domain} href={`/${domain.name}/`}>
                    {domain.name}
                  </Link>
                </td>
                <td className={clsx(styles.cell, styles.rightsCell)}>
                  <div className={styles.rights}>
                    {domain.owned && <div className={styles.right}>Owner</div>}
                    {domain.controlled && <div className={styles.right}>Controller</div>}
                  </div>
                </td>
                <td className={clsx(styles.cell, styles.expirationCell)}>
                  {domain.expiresAt ? formatExpiresIn(domain.expiresAt) : ''}
                </td>
                <td className={clsx(styles.cell, styles.menuCell)}>
                  <div className={styles.menuContainer} onClick={() => setOpenMenu(domain.name)}>
                    <MenuIcon />
                  </div>
                  {openMenu === domain.name && (
                    <Menu
                      className={styles.menu}
                      onClose={() => setOpenMenu(undefined)}
                      items={[
                        {
                          label: 'View details',
                          onClick: () => onViewDetailsClick(domain)
                        },
                        {
                          label: 'Transfer',
                          onClick: () => onTransferClick(domain)
                        },
                        {
                          label: 'Extend',
                          onClick: () => onExtendClick(domain)
                        }
                      ]}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

Names.layout = <ContainerLayout verticalPadding={false} />

export default Names
