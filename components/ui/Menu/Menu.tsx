import React, { ComponentProps, useRef } from 'react'
import styles from './Menu.module.css'
import clsx from 'clsx'
import { useOnClickOutside } from 'usehooks-ts'

interface MenuItem {
  label: string
  onClick: () => void
}

interface MenuProps extends ComponentProps<'div'> {
  items: MenuItem[]
  onClose?: () => void
}

export const Menu = ({ items, onClose, className, ...rest }: MenuProps) => {
  const ref = useRef<HTMLUListElement>(null)
  useOnClickOutside(ref, () => onClose?.())

  return (
    <div {...rest} className={clsx(styles.menuWrapper, className)}>
      <ul ref={ref} className={styles.menu}>
        {items.map((item) => (
          <li
            key={item.label}
            className={styles.item}
            onClick={() => {
              item.onClick()
              onClose?.()
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
