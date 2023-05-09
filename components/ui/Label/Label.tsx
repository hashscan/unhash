import { PropsWithChildren } from 'react'
import { Warning, Error } from 'components/icons'
import styles from './Label.module.css'
import clsx from 'clsx'

type Props = {
  type?: 'warning' | 'error'
  size?: 'lg' | 'md' | 'sm'
}

const icons = {
  warning: Warning,
  error: Error
} as const

export const Label = ({ type = 'warning', size = 'md', children }: PropsWithChildren<Props>) => {
  const Icon = icons[type]

  return (
    <div className={clsx(styles.label, styles[`label_size_${size}`], styles[`label_type_${type}`])}>
      <Icon />
      {children && <span>{children}</span>}
    </div>
  )
}
