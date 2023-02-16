import clsx from 'clsx'
import { motion, AnimatePresence, AnimatePresenceProps } from 'framer-motion'
import { ComponentProps, ReactNode } from 'react'

import styles from './SlideFlap.module.css'

export interface SlideFlapProps extends ComponentProps<'div'> {
  children: ReactNode
  flipKey: string
  slotClassName?: string
  presenceParams?: AnimatePresenceProps
}

export const SlideFlap = ({
  children,
  flipKey,
  className,
  slotClassName,
  presenceParams = {},
  ...rest
}: SlideFlapProps) => {
  return (
    <div {...rest} className={clsx(styles.slideFlap, className)}>
      <AnimatePresence initial={false} {...presenceParams}>
        <motion.div
          key={flipKey}
          className={clsx(styles.slot, slotClassName)}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', position: 'absolute' }}
          transition={{
            y: { type: 'spring', stiffness: 200, damping: 18 },
            opacity: { duration: 0.3 }
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
