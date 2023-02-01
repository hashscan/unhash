import { Registration } from 'lib/types'

export const updateRegistration = (reg: Registration) => {
  localStorage.setItem(
    `ens.registration.${reg.name}`,
    JSON.stringify({
      ...reg,
      status: reg.status === 'registerPending' ? 'registered' : 'committed'
    } as Registration)
  )
  dispatchEvent(new Event('local-storage'))
}
