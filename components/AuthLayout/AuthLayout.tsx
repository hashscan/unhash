import WrapBalancer from 'react-wrap-balancer'
import styles from './AuthLayout.module.css'
import { Button } from 'components/ui/Button/Button'

export const AuthLayout = () => {
  const onClick = () => {
    // TODO: call wagmi connect
  }

  return (
    <div className={styles.layout}>
      <div className={styles.header}>Connect your wallet</div>
      <div className={styles.subheader}>
        <WrapBalancer>
          Sign in with Metamask or Wallet&nbsp;Connect to view and edit your ENS profile
        </WrapBalancer>
      </div>
      <Button className={styles.button} size={'medium'} onClick={onClick}>
        Connect Wallet
      </Button>
    </div>
  )
}
