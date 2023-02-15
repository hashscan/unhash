/* eslint-disable @next/next/no-img-element */
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RefObject, useRef, useState } from 'react'
import ui from 'styles/ui.module.css'
import { useDisconnect } from 'wagmi'
import { useOnClickOutside } from 'usehooks-ts'
import { formatAddress } from 'lib/utils'
import { LogoutIcon, ProfileIcon } from 'components/icons'
import { Links } from './Links'

import clsx from 'clsx'

import styles from './Nav.module.css'
import { toNetwork } from 'lib/types'

interface ChainProps {
  chain: { id: number; unsupported?: boolean }
  onClick: () => void
}

const Chain = ({ chain, onClick }: ChainProps) => {
  const isTestnet = toNetwork(chain.id) === 'goerli'
  const shouldDisplayWarn = isTestnet || Boolean(chain.unsupported)

  if (!shouldDisplayWarn) return null

  return (
    <>
      <button onClick={onClick} className={styles.chainWarning} type="button">
        {isTestnet && 'Testnet'}
        {Boolean(chain.unsupported) && 'Unsupported Network'}
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
      <div className={styles.logo}>ens-wallets.com</div>

      <div className={styles.sub}>
        <Links />

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

            if (!connected) {
              return (
                <button
                  onClick={openConnectModal}
                  className={clsx(ui.button, styles.connect)}
                  type="button"
                >
                  Connect wallet
                </button>
              )
            }

            return (
              <div>
                <div
                  className={clsx(styles.buttons, { [styles.buttonsLoading]: !ready })}
                  aria-hidden={!ready}
                >
                  <Chain chain={chain} onClick={openChainModal} />

                  {account && (
                    <button className={styles.account} onClick={() => setOpen(!isOpen)}>
                      <div
                        className={clsx(styles.accountIcon, {
                          [styles.accountIconPlaceholder]: !account.ensAvatar
                        })}
                      >
                        {account.ensAvatar ? (
                          <img
                            width={24}
                            height={24}
                            alt="avatar"
                            src={account.ensAvatar.replace(
                              'gateway.ipfs.io',
                              'ipfs.eth.aragon.network'
                            )}
                          />
                        ) : (
                          <ProfileIcon color="var(--color-text-secondary)" />
                        )}
                      </div>
                      <div className={styles.accountName}>
                        {account.ensName ? account.ensName : formatAddress(account.address)}
                      </div>
                    </button>
                  )}
                </div>
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
              <LogoutIcon />
            </div>
            <span className={ui.menuText}>Log out</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
