import { providers } from 'ethers'
import { Registration } from './types'

export const waitForPending = async ({
  regs,
  provider,
  txesCache,
  onError,
  onSuccess
}: {
  regs: Registration[]
  provider: providers.BaseProvider
  txesCache: Map<string, Promise<void>>
  onError?: (r: Registration, hash: string) => void
  onSuccess?: (r: Registration, hash: string) => void
}) => {
  await Promise.all(
    regs.map(async (reg) => {
      const hash = reg.status === 'registerPending' ? reg.registerTxHash! : reg.commitTxHash!
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
          onError?.(reg, hash)
        } else {
          onSuccess?.(reg, hash)
        }
      })

      txesCache.set(hash, requestPromise)

      return await requestPromise
    })
  )
}
