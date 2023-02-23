import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import { ComponentProps } from 'react'
import styles from './Feedback.module.css'
import { Input } from 'components/ui/Input/Input'

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
        <div className={styles.header}>Your Feedback</div>
        <div className={styles.subheader}>
          Please share any thoughts about this beta app. Also feel free to text us directly on{' '}
          <a>Twitter</a> or <a>Telegram</a>.
        </div>
        <Input
          className={styles.twitter}
          label="Your Twitter / Telegram"
          placeholder="@mastodon (Optional)"
        />
        <div className={styles.label}>Message</div>
        <textarea
          className={styles.form}
          placeholder={'Your message'}
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
