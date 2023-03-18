import WrapBalancer from 'react-wrap-balancer'
import styles from './AuthLayout.module.css'
import { Button } from 'components/ui/Button/Button'

import { ConnectButton } from '@rainbow-me/rainbowkit'

interface AuthLayoutProps {
  text: string
}

export const AuthLayout = ({ text }: AuthLayoutProps) => {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>Connect your wallet</div>
      <div className={styles.subheader}>
        <WrapBalancer>{text}</WrapBalancer>
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
