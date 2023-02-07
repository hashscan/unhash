import { useEffect, useState } from "react"

export function useCountdown(target: number) {
  const initCount = Math.ceil((target - Date.now()) / 1000)
  const [count, setCount] = useState(initCount)

  useEffect(() => {
    if (count <= 0) return

    const timer = setTimeout(() => {
      setCount(Math.ceil((target - Date.now()) / 1000))
    }, 1000)

    return () => clearTimeout(timer)
  }, [target, count])

  return count
}