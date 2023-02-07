import { useRef, useState } from 'react'

/**
 * This hook ensures that only latest enqueued promise resolves
 * by automatically cancelling all previous promises
 *
 * @returns run - call this method whenever you fire a new promise
 * @returns cancel - cancelles the last run promise
 */
export const useLatestPromise = <T extends any = void>() => {
  // here is the idea: for each promise provided we generate a unique id
  // and we that as a latest id in this ref below
  //
  // when a promise settles it checks if its id is the same as the latest id
  // if it's not — we don't proceed down the promise chain
  const promiseId = useRef<Symbol>()

  // this object never changes, ever...
  const [returned] = useState(() => {
    const run = (promise: Promise<T>) => {
      const id = (promiseId.current = Symbol())

      // the promise we return to the caller
      const outerPromise: Promise<T> = new Promise((resolve, reject) => {
        promise.then(
          (v) => {
            id === promiseId.current && resolve(v)
          },
          (v) => {
            id === promiseId.current && reject(v)
          }
        )
      })

      return outerPromise
    }

    const cancel = () => (promiseId.current = undefined)
    return { run, cancel }
  })

  return returned
}
