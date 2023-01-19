import React, { MouseEventHandler } from 'react'
import styles from 'styles/ConnectWidget.module.css'
import ui from 'styles/ui.module.css'

type Props = {
  className?: string | undefined
  onClick: MouseEventHandler
}

export const ConnectWidget = ({ className, onClick }: Props) => {
  return (
    <li className={`${styles.layout} ${className ? className : ''}`}>
      <div className={styles.iconLayout}>
        <div
          className={styles.icon}
          style={{
            paddingTop: 0,
            paddingLeft: 0
          }}
        ></div>
      </div>
      <div className={styles.content}>
        <span className={styles.text}>You&apos;re not signed in</span>
        <span className={styles.description}>Start by connecting your wallet</span>
      </div>
      <button
        style={{ backgroundColor: 'var(--primary)' }}
        className={`${styles.start} ${ui.button} ${ui.buttonSmall}`}
        onClick={onClick}
      >
        <span>Connect Wallet</span>
      </button>
    </li>
  )
}
