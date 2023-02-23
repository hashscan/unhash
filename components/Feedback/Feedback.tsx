import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import { ComponentProps } from 'react'
import styles from './Feedback.module.css'
import { Input } from 'components/ui/Input/Input'
import { FEEDBACK_TELEGRAM, FEEDBACK_TWITTER } from 'lib/constants'

interface FeedbackProps extends ComponentProps<'div'> {
  onCancel?: () => void
}

export const Feedback = ({ onCancel, className, ...rest }: FeedbackProps) => {
  const onSend = () => {
    alert('Ты больше не лох')
  }
  return (
    <div className={clsx(className, styles.feedback)} {...rest}>
      <div className={styles.content}>
        <div className={styles.header}>{'📟 Your Feedback'}</div>
        <div className={styles.subheader}>
          Please share your thoughts on this beta app. Feel free to text us directly on{' '}
          <a href={FEEDBACK_TWITTER} target="_blank" rel="noreferrer">
            Twitter
          </a>{' '}
          or{' '}
          <a href={FEEDBACK_TELEGRAM} target="_blank" rel="noreferrer">
            Telegram
          </a>
          . Thank you!
        </div>
        <Input
          className={styles.twitter}
          label="Your Twitter / Telegram"
          placeholder="@mastodon (Optional)"
        />
        <div className={styles.label}>Message</div>
        <textarea
          className={styles.form}
          placeholder={
            'Did you like the app? Share your ideas on what we should support and improve.'
          }
        />
      </div>
      <div className={styles.buttons}>
        {/* <Button
          className={styles.buttonCancel}
          disabled={false}
          isLoading={false}
          as={'button'}
          size={'regular'}
          onClick={onCancel}
        >
          Cancel
        </Button> */}
        <Button
          className={styles.buttonSend}
          disabled={false}
          isLoading={false}
          size={'regular'}
          onClick={onSend}
        >
          Send Feedback
        </Button>
      </div>
    </div>
  )
}
