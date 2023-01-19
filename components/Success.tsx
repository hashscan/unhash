import { useEffect } from 'react'

export const Success = ({ domain, address }: { domain: string; address: string }) => {
  useEffect(() => {
    localStorage.removeItem('step')
  }, [])

  return (
    <div>
      success! {domain} is resolved to {address}
    </div>
  )
}
