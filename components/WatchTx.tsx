import { getAllRegistrations } from 'lib/registration/getAllRegistrations'
import { updateRegistration } from 'lib/registration/updateRegistration'
import { Registration } from 'lib/types'
import { waitForPending } from 'lib/waitForPending'
import { useMemo, useState, useEffect } from 'react'
import { useProvider } from 'wagmi'

const filterForUnique = (data: Registration[]) => {
  return data.reduce<Registration[]>((acc, x) => acc.concat(acc.find((y) => y.name === x.name) ? [] : [x]), [])
}

export const WatchTx = () => {
  const provider = useProvider()
  const txesCache = useMemo(() => new Map<string, Promise<void>>(), [])
  const [completed, setCompleted] = useState<Registration[]>([])
  const [failed, setFailed] = useState<Registration[]>([])
  const [pending, setPending] = useState<Registration[]>([])

  useEffect(() => {
    const regs = getAllRegistrations()
    setPending(regs)
    waitForPending({
      regs,
      provider,
      txesCache,
      onSuccess: (reg) => {
        setCompleted(filterForUnique([...completed, reg]))
        setPending(regs.filter((x) => x.name !== reg.name))
        updateRegistration(reg)
      },
      onError: (reg) => {
        setPending(regs.filter((x) => x.name !== reg.name))
        setFailed(filterForUnique([...failed, reg]))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  return (
    <>
      {failed.length ? (
        <div>
          <div>Failed:</div>
          {[...failed].map((reg) => {
            const pending = reg.status.indexOf('Pending')
            return (
              <>
                {reg.name}.eth - {reg.status.slice(0, pending === -1 ? reg.status.length : pending)}
              </>
            )
          })}
        </div>
      ) : null}
      {completed.length ? (
        <div>
          <div>Completed:</div>
          {[...completed].map((reg) => {
            const pending = reg.status.indexOf('Pending')
            return (
              <>
                {reg.name}.eth - {reg.status.slice(0, pending === -1 ? reg.status.length : pending)}
              </>
            )
          })}
        </div>
      ) : null}
      {pending.length ? (
        <div>
          <div>Pending:</div>
          {[...pending].map((reg) => {
            const pending = reg.status.indexOf('Pending')
            return (
              <>
                {reg.name}.eth - {reg.status.slice(0, pending === -1 ? reg.status.length : pending)}
              </>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
