import { useEffect } from 'react'

export const Success = ({ name, address }: { name: string; address: string }) => {
  useEffect(() => {
    localStorage.removeItem('status')
    localStorage.removeItem(`ens.registration.${name}`)
  }, [])

  return (
    <div>
      success! {name}.eth is resolved to {address}
    </div>
  )
}
