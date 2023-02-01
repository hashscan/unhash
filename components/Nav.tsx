/* eslint-disable @next/next/no-img-element */
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RefObject, useEffect, useMemo, useRef, useState } from 'react'
import styles from 'styles/Nav.module.css'
import ui from 'styles/ui.module.css'
import { useDisconnect, useProvider } from 'wagmi'
import { useOnClickOutside } from 'usehooks-ts'
import { formatAddress } from 'lib/utils'
import { LogoutIcon, ProfileIcon } from './icons'
import Link from 'next/link'
import { Registration } from 'lib/types'
import { getAllRegistrations } from 'lib/getAllRegistrations'
import { waitForPending } from 'lib/waitForPending'

const filterForUnique = (data: Registration[]) => {
  return data.reduce<Registration[]>((acc, x) => acc.concat(acc.find((y) => y.name === x.name) ? [] : [x]), [])
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

  const provider = useProvider()
  const txesCache = useMemo(() => new Map<string, Promise<void>>(), [])
  const [completed, setCompleted] = useState<Registration[]>([])
  const [failed, setFailed] = useState<Registration[]>([])
  const [pending, setPending] = useState<Registration[]>([])

  useEffect(() => {
    const regs = getAllRegistrations()
    setPending(regs)
    waitForPending({
      regs,
      provider,
      txesCache,
      onSuccess: (reg) => {
        setCompleted(filterForUnique([...completed, reg]))
        setPending(regs.filter((x) => x.name !== reg.name))
        localStorage.setItem(
          `ens.registration.${reg.name}`,
          JSON.stringify({
            ...reg,
            status: reg.status === 'registerPending' ? 'registered' : 'committed'
          } as Registration)
        )
        dispatchEvent(new Event('local-storage'))
      },
      onError: (reg) => {
        setPending(regs.filter((x) => x.name !== reg.name))
        setFailed(filterForUnique([...failed, reg]))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  console.log({ completed, failed })

  return (
    <nav className={styles.nav} ref={ref}>
      <div className={styles.sub}>
        <div className={styles.links}>
          <Link href="/" className={ui.link}>
            Get ENS Domain
          </Link>
          <Link href="/profile" className={ui.link}>
            Profile
          </Link>
          <Link href="/about" className={ui.link}>
            About
          </Link>
        </div>
        <div>some logo®️</div>
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
                        {chain.name}
                      </button>
                      {' | '}
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
          {failed.length ? (
            <div>
              <div>Failed:</div>
              {[...failed].map((reg) => {
                const pending = reg.status.indexOf('Pending')
                return (
                  <>
                    {reg.name}.eth - {reg.status.slice(0, pending === -1 ? reg.status.length : pending)}
                  </>
                )
              })}
            </div>
          ) : null}
          {completed.length ? (
            <div>
              <div>Completed:</div>
              {[...completed].map((reg) => {
                const pending = reg.status.indexOf('Pending')
                return (
                  <>
                    {reg.name}.eth - {reg.status.slice(0, pending === -1 ? reg.status.length : pending)}
                  </>
                )
              })}
            </div>
          ) : null}
          {pending.length ? (
            <div>
              <div>Pending:</div>
              {[...pending].map((reg) => {
                const pending = reg.status.indexOf('Pending')
                return (
                  <>
                    {reg.name}.eth - {reg.status.slice(0, pending === -1 ? reg.status.length : pending)}
                  </>
                )
              })}
            </div>
          ) : null}
          <div className={ui.menu} onClick={logoutClick}>
            <div className={ui.menuIcon} style={{ height: '24px', width: '24px', marginLeft: '-4px' }}>
              <LogoutIcon />
            </div>
            <span className={ui.menuText}>Log out</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
