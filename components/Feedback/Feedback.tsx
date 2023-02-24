import clsx from 'clsx'
import { ComponentProps, useState } from 'react'
import styles from './Feedback.module.css'
import { FeedbackForm } from './FeedbackForm'

export const Feedback = ({ className, ...rest }: ComponentProps<'div'>) => {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  if (!isOpen) return null
  return <FeedbackForm className={clsx(className, styles.feedback)} />
}
