import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react'
import * as Toast from '@radix-ui/react-toast'
import { nanoid } from 'nanoid'

import styles from './Notifier.module.css'

interface Notification {
  id: string
  status: 'info' | 'error'
  duration: 'infinite' | number
  message: string
  title?: string
}

type Notify = (message: string, options?: Partial<Notification>) => void

const NotifierContext = createContext<Notify>(() => {})

/*
 * components should use this hook to trigger notifications
 *
 * const notify = useNotifier()
 * notify('Unexpected error happened!', { status: 'error' })
 */
export const useNotifier = () => useContext(NotifierContext)

export const NotifierProvider = (props: PropsWithChildren<{}>) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const trigger = useCallback<Notify>((message, options = {}) => {
    const newNotification: Notification = {
      id: nanoid(),
      message,
      status: 'info', // defaults
      duration: 5000,
      ...options
    }

    setNotifications((n) => [...n, newNotification])
  }, [])

  const close = useCallback((id: string) => {
    setNotifications((collection) => collection.filter(({ id: id_ }) => id_ !== id))
  }, [])

  return (
    <NotifierContext.Provider value={trigger}>
      <Toast.Provider swipeDirection="right">
        {notifications.map((n) => {
          const duration = n.duration === 'infinite' ? Number.POSITIVE_INFINITY : n.duration

          return (
            <Toast.Root
              key={n.id}
              className={styles.toast}
              duration={duration}
              onOpenChange={(isOpen) => {
                if (!isOpen) close(n.id)
              }}
            >
              {n.title && <div className={styles.title}>{n.title}</div>}
              <div className={styles.description}>{n.message}</div>
            </Toast.Root>
          )
        })}

        <Toast.Viewport className={styles.viewport} />
      </Toast.Provider>

      {props.children}
    </NotifierContext.Provider>
  )
}
