import clsx from 'clsx'
import { Chevron } from 'components/icons'
import { ReactElement, ReactNode, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import styles from './AdditionalInfo.module.css'

interface AdditionalInfoProps {
  header: string
  children: ReactNode
  icon?: ReactElement
  className?: string
}

export const AdditionalInfo = ({ header, children, icon, className }: AdditionalInfoProps) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={clsx(className, styles.additional, { [styles.expanded]: expanded })}>
      <div className={styles.header} onClick={() => setExpanded((t) => !t)}>
        {icon && <div className={styles.icon}>{icon}</div>}

        <span>{header}</span>

        <Chevron className={styles.chevron} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0 }}
            transition={{ duration: 0.4 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <div className={styles.content}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
