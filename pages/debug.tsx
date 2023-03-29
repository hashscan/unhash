import styles from './debug.module.css'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { useRegistration } from 'lib/hooks/useRegistration'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatAddress } from 'lib/utils'
import clsx from 'clsx'
import { useEtherscanURL } from 'lib/hooks/useEtherscanURL'

const TxLink = ({ txHash, isFailed }: { txHash: string; isFailed?: boolean }) => {
  const link = useEtherscanURL('txn', txHash)

  return (
    <Link
      className={clsx(styles.tx, { [styles.txFailed]: isFailed === true })}
      href={link}
      target="_blank"
    >
      {formatAddress(txHash, 4)}
    </Link>
  )
}

const Debug: PageWithLayout = () => {
  const [initialized, setInitialized] = useState(false)
  useEffect(() => setInitialized(true), []) // fixes react hydration issue

  const { address } = useAccount()
  const { registration } = useRegistration()

  const registrations = registration ? [registration] : []

  const addressLink = useEtherscanURL('address', address!)

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
        <Link className={styles.link} href={addressLink} target="_blank">
          {address}
        </Link>
      </div>

      <table className={styles.registrations}>
        <thead>
          <tr className={styles.head}>
            <th>#</th>
            <th>Domain</th>
            <th>Status</th>
            <th>Commit Tx Hash</th>
            <th>Register Tx Hash</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg, i) => (
            <tr key={reg.names.join(',')} className={styles.registration}>
              <td className={styles.number}>{i + 1}</td>
              <td>
                <Link className={styles.domain} href={`/${reg.names}/register`} target="_blank">
                  {reg.names}
                </Link>
              </td>
              <td className={styles.status}>{reg.status}</td>
              <td>
                {reg.commitTxHash ? (
                  <TxLink txHash={reg.commitTxHash} />
                ) : reg.status === 'created' && reg.errorTxHash ? (
                  <TxLink txHash={reg.errorTxHash} isFailed={true} />
                ) : (
                  '—'
                )}
              </td>
              <td>
                {reg.registerTxHash ? (
                  <TxLink txHash={reg.registerTxHash} />
                ) : reg.status === 'committed' && reg.errorTxHash ? (
                  <TxLink txHash={reg.errorTxHash} isFailed={true} />
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.divider} />
    </div>
  )
}

Debug.layout = <ContainerLayout verticalPadding={false} />

export default Debug
