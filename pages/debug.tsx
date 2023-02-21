import styles from './debug.module.css'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { useRegistrations } from 'lib/hooks/useRegistrations'
import { useAccount, useChainId } from 'wagmi'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { formatAddress } from 'lib/utils'

const Debug: PageWithLayout = () => {
  const [initialized, setInitialized] = useState(false)
  useEffect(() => setInitialized(true), []) // fixes react hydration issue

  const chainId = useChainId()
  const { address } = useAccount()
  const allRegistrations = useRegistrations()

  const registrations = useMemo(
    () =>
      [...allRegistrations].sort((r1, r2) => {
        // sort in the following order of status: 'commitPending', 'committed', 'registerPending', 'registered'
        if (r1.status === r2.status) return 0
        if (r1.status === 'commitPending') return -1
        if (r2.status === 'commitPending') return 1
        if (r1.status === 'committed') return -1
        if (r2.status === 'committed') return 1
        if (r1.status === 'registerPending') return -1
        if (r2.status === 'registerPending') return 1
        return 0
      }),
    [allRegistrations]
  )

  // loader
  if (!initialized || !address) {
    return null
  }

  return (
    <div className={styles.main}>
      <div className={styles.title}>Debug</div>

      <div className={styles.header}>Registrations</div>
      <div className={styles.subheader}>
        Showing all registrations for{' '}
        <Link
          className={styles.link}
          href={`https://${chainId === 5 ? 'goerli.' : ''}etherscan.io/address/${address}`}
          target="_blank"
        >
          {address}
        </Link>
      </div>

      <div className={styles.registrations}>
        <tr className={styles.head}>
          <th>#</th>
          <th>Domain</th>
          <th>Status</th>
          <th>Commit Tx Hash</th>
          <th>Register Tx Hash</th>
        </tr>
        {registrations.map((reg, i) => (
          <tr key={reg.domain} className={styles.registration}>
            <td className={styles.number}>{i + 1}</td>
            <td>
              <Link className={styles.domain} href={`/${reg.domain}/register`} target="_blank">
                {reg.domain}
              </Link>
            </td>
            <td className={styles.status}>{reg.status}</td>
            <td>
              {reg.commitTxHash ? (
                <Link
                  className={styles.tx}
                  href={`https://${chainId === 5 ? 'goerli.' : ''}etherscan.io/tx/${
                    reg.commitTxHash
                  }`}
                  target="_blank"
                >
                  {formatAddress(reg.commitTxHash, 4)}
                </Link>
              ) : (
                '—'
              )}
            </td>
            <td>
              {reg.registerTxHash ? (
                <Link
                  className={styles.tx}
                  href={`https://${chainId === 5 ? 'goerli.' : ''}etherscan.io/tx/${
                    reg.registerTxHash
                  }`}
                  target="_blank"
                >
                  {formatAddress(reg.registerTxHash, 4)}
                </Link>
              ) : (
                '—'
              )}
            </td>
          </tr>
        ))}
      </div>

      <div className={styles.divider} />
    </div>
  )
}

Debug.layout = <ContainerLayout verticalPadding={false} />

export default Debug
