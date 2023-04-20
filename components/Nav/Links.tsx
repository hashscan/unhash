import { ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import styles from './Links.module.css'
import { useCurrentRoute } from 'lib/hooks/useCurrentRoute'

export const Links = (props: ComponentPropsWithoutRef<'div'> & { mobile?: boolean }) => {
  const { mobile, ...rest } = props
  const route = useCurrentRoute()

  return (
    <div {...rest} className={clsx(props.className, styles.links)}>
      <Link
        href="/"
        className={clsx(styles.navLink, {
          [styles['navLink_mobile']]: mobile,
          [styles.navLinkActive]: route === '/' || route.match(/\/register$/) !== null
        })}
      >
        Search
      </Link>

      <Link
        href="/names"
        className={clsx(styles.navLink, {
          [styles['navLink_mobile']]: mobile,
          [styles.navLinkActive]: route === '/names'
        })}
      >
        My names
      </Link>

      <Link
        href="/profile"
        className={clsx(styles.navLink, {
          [styles['navLink_mobile']]: mobile,
          [styles.navLinkActive]: route === '/profile'
        })}
      >
        Profile
      </Link>
    </div>
  )
}
