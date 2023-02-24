import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import { ComponentProps } from 'react'
import styles from './FeedbackFormSuccess.module.css'

interface FeedbackFormSuccessProps extends ComponentProps<'div'> {
  onClose?: () => void
}

export const FeedbackFormSuccess = ({ onClose, className, ...rest }: FeedbackFormSuccessProps) => {
  return (
    <div className={clsx(className, styles.container)} {...rest}>
      <div className={styles.content}>
        <div className={styles.icon}>👌</div>
        <div className={styles.header}>Thank you!</div>
        <div className={styles.subheader}>{'We will reach out to you if you had issues.'}</div>
      </div>
      <Button
        className={styles.close}
        disabled={false}
        isLoading={false}
        size={'regular'}
        onClick={() => onClose?.()}
      >
        Close
      </Button>
    </div>
  )
}
