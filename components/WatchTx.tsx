import { Registration } from 'lib/types'
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { useProvider } from 'wagmi'
import { providers } from 'ethers'
import { useEventListener } from 'usehooks-ts'

const waitForPending = async ({
  txes,
  provider,
  txesCache,
  setCompleted,
  setFailed
}: {
  txes: string[]
  provider: providers.BaseProvider
  txesCache: Map<string, Promise<void>>
  setCompleted: Dispatch<SetStateAction<string[]>>
  setFailed: Dispatch<SetStateAction<string[]>>
}) => {
  await Promise.all(
    txes.map(async (hash) => {
      const existingRequest = txesCache.get(hash)

      if (existingRequest) {
        return await existingRequest
      }

      const requestPromise = provider.waitForTransaction(hash).then(({ status }) => {
        txesCache.delete(hash)

        if (status === undefined) {
          return
        }
        if (status === 0) {
          // failed
          setFailed((h) => [...h, hash])
        } else {
          setCompleted((h) => [...h, hash])
        }
      })

      txesCache.set(hash, requestPromise)

      return await requestPromise
    })
  )
}

const getTransactions = async (hashes: string[]) => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const item = localStorage.getItem(key)
      if (key.includes('ens.registration') && item) {
        const reg = JSON.parse(item) as Registration
        if (reg.commitTxHash) hashes.push(reg.commitTxHash)
        if (reg.registerTxHash) hashes.push(reg.registerTxHash)
      }
    }
  }
}

export const WatchTx = () => {
  const provider = useProvider()
  const txesCache = useMemo(() => new Map<string, Promise<void>>(), [])
  const [completed, setCompleted] = useState<string[]>([])
  const [failed, setFailed] = useState<string[]>([])

  useEffect(() => {
    const hashes: string[] = []
    getTransactions(hashes)
    waitForPending({ txes: hashes, provider, txesCache, setCompleted, setFailed })
  }, [provider, txesCache])

  useEventListener('local-storage', () => {
    const hashes: string[] = []
    getTransactions(hashes)
    waitForPending({ txes: hashes, provider, txesCache, setCompleted, setFailed })
  })

  console.log({ completed, failed })

  return <></>
}
