import { ReactNode } from 'react'
import { Dialog as HeadlessDialog } from '@headlessui/react'
import { type DialogProps as HeadlessDialogProps } from '@headlessui/react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

import styles from './Dialog.module.css'

type HeadlDialogProps = HeadlessDialogProps<React.ElementType<'div'>>

// The props that the component built on top of Dialog should accept
export type DialogExternalProps = Pick<HeadlDialogProps, 'open' | 'onClose'> & {
  closeDialog: (success?: boolean) => void
  closeDialogWithSuccess: () => void
  params: { [key: string]: any }
}

export type DialogProps = {
  size: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children: ReactNode
  footer?: ReactNode
  open?: HeadlDialogProps['open']
  onClose: HeadlDialogProps['onClose']
  canCloseDialog?: boolean
}

export const Dialog = ({
  size = 'md',
  className,
  children,
  footer,
  open,
  onClose,
  canCloseDialog = true
}: DialogProps) => {
  // prevent dialog from closing
  const handleClose: typeof onClose = (...args) => {
    if (canCloseDialog) onClose?.(...args)
  }

  return (
    <HeadlessDialog
      as={motion.div}
      static
      className={styles.container}
      open={open}
      onClose={handleClose}
      variants={containerAnimationVariants}
    >
      {/* Full-screen container to center the panel */}
      <motion.div
        variants={backdropAnimationVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={styles.backdrop}
      >
        <HeadlessDialog.Panel
          className={clsx(styles.panel, styles[`panel_${size}`], className)}
          as={motion.div}
          variants={panelAnimationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </HeadlessDialog.Panel>
      </motion.div>
    </HeadlessDialog>
  )
}

/**
 * Animation states for backdrop and the dialog
 */
const containerAnimationVariants = {
  visible: {},
  hidden: {},
  exit: {}
}

const backdropAnimationVariants = {
  visible: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(2px)',
    transition: {
      duration: 0.2
    }
  },

  hidden: {
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.2,
      delay: 0.2
    }
  }
}

const panelAnimationVariants = {
  visible: {
    scale: 1.0,
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 0.4,
      bounce: 0.4
    }
  },

  hidden: {
    scale: 0.9
  },

  exit: {
    opacity: 0,
    scale: 1.05,
    translateY: -20,
    filter: 'blur(8px)',
    transition: {
      duration: 0.15
    }
  }
}
