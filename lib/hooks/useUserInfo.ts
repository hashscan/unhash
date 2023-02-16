import api, { UserInfo } from 'lib/api'
import { toNetwork } from 'lib/types'
import { useEffect, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'

/**
 * Fetches user domains info for currently connected wallet.
 * @returns user info if wallet connected
 */
export const useCurrentUserInfo = (): UserInfo | undefined => {
  const chainId = useChainId()
  const { address } = useAccount()
  const [userInfo, setUserInfo] = useState<UserInfo>()

  useEffect(() => {
    setUserInfo(undefined)
    if (!address) return

    const fetchUser = async () => {
      try {
        const res = await api.userInfo(address, toNetwork(chainId))
        setUserInfo(res)
      } catch (err) {
        console.log(`failed to fetch user info: ${err}`)
      }
    }

    fetchUser()
  }, [chainId, address])

  return userInfo
}
