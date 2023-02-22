import WrapBalancer from 'react-wrap-balancer'
import styles from './AuthLayout.module.css'
import { Button } from 'components/ui/Button/Button'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export const AuthLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>Connect your wallet</div>
      <div className={styles.subheader}>
        <WrapBalancer>
          Sign in with Metamask or Wallet&nbsp;Connect to view and edit your ENS profile
        </WrapBalancer>
      </div>

      <ConnectButton.Custom>
        {({ openConnectModal }) => {
          return (
            <Button className={styles.button} size={'medium'} onClick={openConnectModal}>
              Connect Wallet
            </Button>
          )
        }}
      </ConnectButton.Custom>
    </div>
  )
}
