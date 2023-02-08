import clsx from 'clsx'
import React, { MouseEventHandler } from 'react'
import styles from './LoadingButton.module.css'
import ui from 'styles/ui.module.css'
import { ProgressBar } from 'components/icons'

type LoadingButtonProps = {
  text?: string
  isLoading?: boolean
  onClick?: MouseEventHandler
  className?: string | undefined
}

// Regular button with loader at the middle and disabled state while loading.
export const LoadingButton = ({ text, isLoading, onClick, className }: LoadingButtonProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      <button className={clsx(ui.button, { [styles.buttonLoading]: isLoading })} onClick={onClick}>
        {text}
      </button>
      {isLoading && (
        <ProgressBar
          className={styles.loader}
          color="var(--color-slate-f)"
          width={'28px'}
          height={'28px'}
        />
      )}
    </div>
  )
}
