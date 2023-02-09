import { NextRouter, useRouter } from 'next/router'
import { useCallback } from 'react'

type NavigateArguments = Parameters<NextRouter['push']>

/**
 * A utility methond hook for performing page navigation
 * Like `useRouter().push()`, but returning a promise
 *
 * https://nextjs.org/docs/api-reference/next/router#routerevents
 */
export const useRouterNavigate = () => {
  const router = useRouter()

  return useCallback(
    (...args: NavigateArguments) => {
      const promise = new Promise<void>((resolve, reject) => {
        const clearAll = () => {
          // unsub
          router.events.off('routeChangeComplete', onSuccess)
          router.events.off('routeChangeError', onError)
        }

        const onSuccess = () => {
          clearAll()
          resolve()
        }

        const onError = (err: any) => {
          clearAll()
          reject(err)
        }

        router.events.on('routeChangeComplete', onSuccess)
        router.events.on('routeChangeError', onError)
      })

      router.push(...args)
      return promise
    },
    [router]
  )
}
