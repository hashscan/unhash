import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import styles from './Links.module.css'
import { useRouter } from 'next/router'

const useCurrentRoute = () => {
  const router = useRouter()
  const [route, setRoute] = useState(router.asPath)

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(router.asPath)
    }

    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  return route
}

export const Links = (props: ComponentPropsWithoutRef<'div'>) => {
  const route = useCurrentRoute()

  return (
    <div {...props} className={clsx(props.className, styles.links)}>
      <Link
        href="/"
        className={clsx(styles.navLink, {
          [styles.navLinkActive]: route === '/' || route.match(/\/register$/) !== null
        })}
      >
        Get ENS Domain
      </Link>

      <Link
        href="/profile"
        className={clsx(styles.navLink, { [styles.navLinkActive]: route === '/profile' })}
      >
        Set up Profile
      </Link>

      <Link
        href="https://docs.ens.domains/frequently-asked-questions"
        className={clsx(styles.navLink)}
      >
        FAQ↗
      </Link>
    </div>
  )
}
