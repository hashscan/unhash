import { useAccount } from 'wagmi'
import styles from './names.module.css'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { AuthLayout } from 'components/AuthLayout/AuthLayout'
import { useCurrentUserInfo } from 'lib/hooks/useUserInfo'
import { useMemo, useState } from 'react'
import { LoaderSpinner, Menu, Search } from 'components/icons'
import clsx from 'clsx'
import Link from 'next/link'
import { formatExpiresIn } from 'lib/format'
import Checkbox from 'components/ui/Checkbox/Checkbox'

const Names: PageWithLayout = () => {
  const { isDisconnected } = useAccount()

  const userInfo = useCurrentUserInfo()

  const [filter, setFilter] = useState('')
  const [selectedNames, setSelectedNames] = useState<string[]>([])

  const onCheckChange = (name: string, checked: boolean) => {
    if (checked) {
      setSelectedNames([...selectedNames, name])
    } else {
      setSelectedNames(selectedNames.filter((n) => n !== name))
    }
  }

  // get owned and controlled domains
  const domains = useMemo(
    () =>
      userInfo?.domains
        .filter(
          (d) =>
            d.isValid &&
            (d.controlled || d.owned) &&
            d.name.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name)) || [],
    [userInfo, filter]
  )

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
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr className={clsx(styles.row)}>
            <th className={clsx(styles.cell, styles.headCell, styles.selectCell)}>
              <div className={styles.checkboxContainer}>
                <div className={styles.checkbox} />
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
          {domains.map((domain) => (
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
                <Link className={styles.domain} href={`/${domain.name}/`} target="_blank">
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
                <div className={styles.menuContainer}>
                  <Menu />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

Names.layout = <ContainerLayout verticalPadding={false} />

export default Names
