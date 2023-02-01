import { usePendingRegistrations } from 'lib/hooks/storage'
import { updateRegistration } from 'lib/registration/updateRegistration'
import { Registration } from 'lib/types'
import { waitForPending } from 'lib/waitForPending'
import { useState, useEffect } from 'react'
import { useProvider } from 'wagmi'
import ui from 'styles/ui.module.css'
import styles from './WatchTx.module.css'

const filterForUnique = (data: Registration[]) => {
  return data.reduce<Registration[]>((acc, x) => acc.concat(acc.find((y) => y.name === x.name) ? [] : [x]), [])
}

export const WatchTx = () => {
  const provider = useProvider()
  const txesCache = new Map()
  const [completed, setCompleted] = useState<Registration[]>([])
  const [failed, setFailed] = useState<Registration[]>([])
  const { pendingRegistrations, setPendingRegistrations } = usePendingRegistrations()

  useEffect(() => {
    waitForPending({
      regs: pendingRegistrations,
      provider,
      txesCache,
      onSuccess: (reg) => {
        setCompleted(filterForUnique([...completed, reg]))
        setPendingRegistrations(pendingRegistrations.filter((x) => x.name !== reg.name))
        updateRegistration(reg)
      },
      onError: (reg) => {
        setPendingRegistrations(pendingRegistrations.filter((x) => x.name !== reg.name))
        setFailed(filterForUnique([...failed, reg]))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  return (
    <>
      {failed.length ? (
        <div className={styles.container}>
          <div style={{ color: 'var(--error)' }}>Failed ({failed.length}):</div>
          {[...failed].map((reg) => {
            const pending = reg.status.indexOf('Pending')
            return (
              <div className={`${ui.menu} ${styles.tx}`} key={`${reg.name}-${reg.status}`}>
                {reg.name}.eth - {reg.status.slice(0, pending === -1 ? reg.status.length : pending)}
              </div>
            )
          })}
        </div>
      ) : null}
      {completed.length ? (
        <div>
          <div>Completed ({completed.length}):</div>
          {[...completed].map((reg) => {
            const pending = reg.status.indexOf('Pending')
            return (
              <div className={`${ui.menu} ${styles.tx}`} key={`${reg.name}-${reg.status}`}>
                {reg.name}.eth - {reg.status.slice(0, pending === -1 ? reg.status.length : pending)}
              </div>
            )
          })}
        </div>
      ) : null}
      {pendingRegistrations.length ? (
        <div>
          <div>Pending ({pendingRegistrations.length}):</div>
          {[...pendingRegistrations].map((reg) => {
            const pending = reg.status.indexOf('Pending')
            return (
              <div className={`${ui.menu} ${styles.tx}`} key={`${reg.name}-${reg.status}`}>
                {reg.name}.eth - {reg.status.slice(0, pending === -1 ? reg.status.length : pending)}
              </div>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
