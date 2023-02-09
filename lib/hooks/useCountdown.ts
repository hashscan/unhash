import { useEffect, useRef, useState } from 'react'

const secondsUntil = (target: number) => Math.ceil((target - Date.now()) / 1000)

/**
 * @param target - timestamp
 * @returns number of seconds until the target timestamp
 */
export function useCountdown(target: number) {
  const [count, setCount] = useState(() => secondsUntil(target))

  // holds the ref to the last timer
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const tick = () => {
      const count = secondsUntil(target)
      setCount(count)

      if (count > 0) {
        timerRef.current = setTimeout(tick, 1000)
      }
    }

    tick()
    return () => clearTimeout(timerRef.current!)
  }, [target]) // when target changes everything gets cancelled and starts over

  return count
}
