import clsx from 'clsx'
import { Button } from 'components/ui/Button/Button'
import { ComponentProps, useState } from 'react'
import styles from './FeedbackForm.module.css'
import { Input } from 'components/ui/Input/Input'
import { FEEDBACK_TELEGRAM, FEEDBACK_TWITTER } from 'lib/constants'
import api from 'lib/api'
import { useNotifier } from 'lib/hooks/useNotifier'

interface FeedbackFormProps extends ComponentProps<'div'> {
  onCancel?: () => void
  onSuccess?: () => void
}

export const FeedbackForm = ({ onCancel, onSuccess, className, ...rest }: FeedbackFormProps) => {
  const notify = useNotifier()
  const [author, setAuthor] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [success, setSuccess] = useState<boolean>(false)

  const onSend = async () => {
    if (isLoading) return
    try {
      setIsLoading(true)
      await api.saveFeedback(author, message)
      onSuccess?.()
      // setSuccess(true)
    } catch (e) {
      notify('Failed to send feedback', { status: 'error' })
    } finally {
      setIsLoading(false)
    }
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
          onChange={(e) => setAuthor(e.target.value)}
        />
        <div className={styles.label}>Message</div>
        <textarea
          className={styles.form}
          placeholder={
            'Did you like the app? Share your ideas on what we should support and improve.'
          }
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className={styles.buttons}>
        <Button
          className={styles.buttonCancel}
          disabled={false}
          isLoading={false}
          size={'regular'}
          variant={'ghost'}
          onClick={() => onCancel?.()}
        >
          Cancel
        </Button>
        <Button
          className={styles.buttonSend}
          disabled={message.length === 0}
          isLoading={isLoading}
          size={'regular'}
          onClick={onSend}
        >
          Send Feedback
        </Button>
      </div>
    </div>
  )
}
