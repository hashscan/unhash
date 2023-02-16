import api, { UserInfo } from 'lib/api'
import { toNetwork } from 'lib/types'
import { useEffect, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'

// TODO: use global type vs API's UserInfo
// TODO: set to null on logout
export const useCurrentUserInfo = (): UserInfo | undefined => {
  const chainId = useChainId()
  // TODO: is this null on initial load or only if wallet not connected?
  const { address } = useAccount()
  const [userInfo, setUserInfo] = useState<UserInfo>()

  useEffect(() => {
    if (!address) {
      setUserInfo(undefined)
      return
    }

    const fetchUser = async () => {
      try {
        const result = await api.userInfo(address, toNetwork(chainId))
        console.log(result) // TODO: remove
        setUserInfo(result)
      } catch (err) {
        console.log(`failed to fetch user info: ${err}`)
        // TODO: set to undefined or do nothing?
        // setUserInfo(undefined)
      }
    }

    fetchUser()
  }, [chainId, address])

  return userInfo
}
