import clsx from 'clsx'
import { Chat } from 'components/icons'
import { ComponentProps, useEffect, useState } from 'react'
import styles from './Feedback.module.css'
import { FeedbackForm } from './FeedbackForm'

import { useCurrentRoute } from 'lib/hooks/useCurrentRoute'

export const Feedback = ({ className, ...rest }: ComponentProps<'div'>) => {
  const [isHidden, hide] = useState(true)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const route = useCurrentRoute()

  useEffect(() => {
    const SHOW_AFTER = 700
    if (route === '/') {
      const trackScroll = () => hide(window.scrollY < SHOW_AFTER)

      trackScroll()
      window.addEventListener('scroll', trackScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', trackScroll)
      }
    } else {
      hide(false)
    }
  }, [route])

  if (!isOpen)
    return (
      <div
        className={clsx(className, styles.feedback, styles.menu, isHidden && styles.hidden)}
        onClick={() => setIsOpen(true)}
      >
        <Chat />
      </div>
    )
  return (
    <FeedbackForm
      className={clsx(className, styles.feedback)}
      {...rest}
      onClose={() => setIsOpen(false)}
    />
  )
}
