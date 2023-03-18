import { useAccount } from 'wagmi'
import styles from './profile.module.css'
import { ContainerLayout, PageWithLayout } from 'components/layouts'
import { AuthLayout } from 'components/AuthLayout/AuthLayout'
import { useCurrentUserInfo } from 'lib/hooks/useUserInfo'
import { useMemo, useState } from 'react'
import { LoaderSpinner } from 'components/icons'

const Names: PageWithLayout = () => {
  const { address, isDisconnected } = useAccount()

  const userInfo = useCurrentUserInfo()
  const userDomains = useMemo(() => userInfo?.domains.filter((d) => d.isValid) || [], [userInfo])

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

      <div className={styles.header}>All names</div>
      <div className={styles.subheader}>This is all names you own or control.</div>
    </main>
  )
}

Names.layout = <ContainerLayout verticalPadding={false} />

export default Names
