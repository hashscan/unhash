import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export const useCurrentRoute = () => {
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