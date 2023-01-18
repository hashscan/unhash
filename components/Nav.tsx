import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RefObject, useRef, useState } from 'react'
import styles from 'styles/Nav.module.css'
import ui from 'styles/ui.module.css'
import { useDisconnect } from 'wagmi'
import { useOnClickOutside } from 'usehooks-ts'
import Image from 'next/image'
import { formatAddress } from 'lib/utils'
import { LogoutIcon, ProfileIcon } from './icons'
import Link from 'next/link'

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
      <Link href="/" className={styles.title}>
        ENS
      </Link>

      <ConnectButton.Custom>
        {({ account, openConnectModal, authenticationStatus, mounted, openChainModal, chain }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading'
          const connected =
            chain && ready && account && (!authenticationStatus || authenticationStatus === 'authenticated')

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none'
                }
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button onClick={openConnectModal} className={`${ui.button} ${styles.connect}`} type="button">
                      Connect wallet
                    </button>
                  )
                }
                if (chain.unsupported) {
                  return (
                    <button className={styles.chains} onClick={openChainModal} type="button">
                      Wrong network
                    </button>
                  )
                }

                return (
                  <div className={styles.buttons}>
                    <button onClick={openChainModal} className={styles.chains} type="button">
                      {chain.iconUrl && (
                        <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} height={24} width={24} />
                      )}
                      {chain.name}
                    </button>
                    <button className={`${styles.account}`} onClick={() => setOpen(!isOpen)}>
                      <div className={`${styles.accountIcon} ${!account.ensAvatar && styles.accountIconPlaceholder}`}>
                        {account.ensAvatar ? (
                          <img
                            width={28}
                            height={28}
                            alt="avatar"
                            src={account.ensAvatar.replace('gateway.ipfs.io', 'ipfs.eth.aragon.network')}
                          />
                        ) : (
                          <ProfileIcon color="var(--text-secondary)" />
                        )}
                      </div>
                      <div className={styles.accountName}>
                        {account.ensName ? account.ensName : formatAddress(account.address)}
                      </div>
                    </button>
                  </div>
                )
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>
      <div className={ui.modal} style={{ visibility: isOpen ? 'visible' : 'hidden', opacity: isOpen ? 1 : 0 }}>
        <div className={ui.menu} onClick={logoutClick}>
          <div className={ui.menuIcon} style={{ height: '24px', width: '24px', marginLeft: '-4px' }}>
            <LogoutIcon />
          </div>
          <span className={ui.menuText}>Log out</span>
        </div>
      </div>
    </nav>
  )
}
