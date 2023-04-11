/* eslint-disable @next/next/no-img-element */
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RefObject, useRef, useState } from 'react'
import ui from 'styles/ui.module.css'
import { useDisconnect } from 'wagmi'
import { useOnClickOutside } from 'usehooks-ts'
import { formatAddress } from 'lib/utils'
import { InfoCircle, Logout, Profile } from 'components/icons'
import { Links } from './Links'
import clsx from 'clsx'
import styles from './Nav.module.css'
import { toNetwork, currentNetwork, Domain } from 'lib/types'
import { Button } from 'components/ui/Button/Button'
import Link from 'next/link'
import { useEnsAvatar } from 'lib/hooks/useEnsAvatar'

import { UnhashLogo } from 'components/icons'

interface ChainProps {
  chainId?: number
  onClick?: () => void
}

const Chain = ({ chainId, onClick }: ChainProps) => {
  const isTestnet = currentNetwork() === 'goerli'
  const isUnsupported = chainId && toNetwork(chainId) !== currentNetwork()
  if (!isTestnet && !isUnsupported) return null

  return (
    <>
      <button onClick={onClick} className={styles.chainWarning} type="button">
        <InfoCircle className={styles.chainIcon} />

        <span>
          {isUnsupported && 'Switch Network'}
          {!isUnsupported && isTestnet && 'Testnet'}
        </span>
      </button>

      <span className={styles.sep}> | </span>
    </>
  )
}

export const Nav = () => {
  const [isOpen, setOpen] = useState(false)
  const { disconnect } = useDisconnect()

  const ref = useRef<HTMLElement>() as RefObject<HTMLElement>
  useOnClickOutside(ref, () => setOpen(false))

  const logoutClick = () => {
    setOpen(false)
    disconnect()
  }

  return (
    <nav className={styles.nav} ref={ref}>
      <div className={styles.sub}>
        <Link href="/" className={styles.brand}>
          <UnhashLogo className={styles.logo} />
          <div className={styles.name}>unhash</div>
        </Link>

        <Links className={styles.links} />

        <ConnectButton.Custom>
          {({
            account,
            openConnectModal,
            authenticationStatus,
            mounted,
            openChainModal,
            chain
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== 'loading'
            const connected =
              chain &&
              ready &&
              account &&
              (!authenticationStatus || authenticationStatus === 'authenticated')

            if (!mounted) return null
            if (!connected) {
              return (
                <div className={styles.buttons}>
                  <Chain />
                  <Button onClick={openConnectModal}>Connect wallet</Button>
                </div>
              )
            }

            return (
              <div
                className={clsx(styles.buttons, { [styles.buttonsLoading]: !ready })}
                aria-hidden={!ready}
              >
                <Chain chainId={chain?.id} onClick={openChainModal} />

                {account && (
                  <button className={styles.account} onClick={() => setOpen(!isOpen)}>
                    <div className={clsx(styles.accountAvatar, styles.acccountAvatarPlaceholder)}>
                      {account.ensName && <Avatar ensName={account.ensName as Domain} />}
                    </div>
                    <div
                      className={clsx(styles.accountName, {
                        [styles.accountNameAddress]: !account.ensName
                      })}
                    >
                      {account.ensName ? account.ensName : formatAddress(account.address)}
                    </div>
                  </button>
                )}
              </div>
            )
          }}
        </ConnectButton.Custom>
        <div
          className={ui.modal}
          style={{
            visibility: isOpen ? 'visible' : 'hidden',
            opacity: isOpen ? 1 : 0
          }}
        >
          <div className={ui.menu} onClick={logoutClick}>
            <div
              className={ui.menuIcon}
              style={{ height: '24px', width: '24px', marginLeft: '-4px' }}
            >
              <Logout />
            </div>
            <span className={ui.menuText}>Log out</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

const Avatar = ({ ensName }: { ensName: Domain }) => {
  const { data: avatar, isError } = useEnsAvatar(ensName)

  return avatar && !isError ? (
    <img className={styles.accountAvatarImg} alt={`ENS Avatar for ${ensName}`} src={avatar} />
  ) : (
    <Profile color="var(--color-slate-5)" />
  )
}
