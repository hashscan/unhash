import React, { ReactNode } from 'react'
import { Dialog as HeadlessDialog } from '@headlessui/react'
import { type DialogProps as HeadlessDialogProps } from '@headlessui/react'
import clsx from 'clsx'

import styles from './Dialog.module.css'

type HeadlDialogProps = HeadlessDialogProps<React.ElementType<'div'>>

export type DialogProps = {
  size: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children: ReactNode
  footer?: ReactNode
  open?: HeadlDialogProps['open']
  onClose: HeadlDialogProps['onClose']
  canCloseDialog?: boolean
}

export type DialogExternalProps = Pick<HeadlDialogProps, 'open' | 'onClose'>

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
    <HeadlessDialog className={styles.container} open={open} onClose={handleClose}>
      {/* Full-screen container to center the panel */}
      <div className={styles.backdrop}>
        <HeadlessDialog.Panel className={clsx(styles.panel, styles[`panel_${size}`], className)}>
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  )
}
