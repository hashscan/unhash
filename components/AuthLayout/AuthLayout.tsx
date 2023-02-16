import WrapBalancer from 'react-wrap-balancer'
import styles from './AuthLayout.module.css'
import ui from 'styles/ui.module.css'
import clsx from 'clsx'

export const AuthLayout = () => {
  const onClick = () => {
    // TODO: call wagmi connect
  }

  return (
    <div className={styles.layout}>
      <div className={styles.header}>Connect your wallet</div>
      <div className={styles.subheader}>
        <WrapBalancer>
          Sign in with Metamask or Wallet Connect to view and edit ENS profile.
        </WrapBalancer>
      </div>
      <button className={clsx(ui.button, styles.button)} onClick={() => onClick}>
        Connect Wallet
      </button>
    </div>
  )
}
