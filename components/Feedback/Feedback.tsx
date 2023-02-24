import clsx from 'clsx'
import { Chat } from 'components/icons'
import { ComponentProps, useState } from 'react'
import styles from './Feedback.module.css'
import { FeedbackForm } from './FeedbackForm'

export const Feedback = ({ className, ...rest }: ComponentProps<'div'>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  if (!isOpen)
    return (
      <div
        className={clsx(className, styles.feedback, styles.menu)}
        onClick={() => setIsOpen(true)}
      >
        <Chat />
      </div>
    )
  return <FeedbackForm className={clsx(className, styles.feedback)} {...rest} />
}
