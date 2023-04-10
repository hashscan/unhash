import api from 'lib/api'
import { UserInfo, currentNetwork } from 'lib/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'

/**
 * Fetches user domains info for currently connected wallet.
 * Server error are ignored.
 * Call refreshUser to force refresh.
 * @returns user info if wallet connected
 */
export const useCurrentUser = (): { user: UserInfo | undefined; refreshUser: () => void } => {
  const { address } = useAccount()
  const [user, setUser] = useState<UserInfo>()

  // a hack to force refetch
  const [refresh, setRefresh] = useState(0)
  const refreshUser = useCallback(() => {
    isForcedFetch.current = true
    setRefresh(refresh + 1)
  }, [refresh])
  const isForcedFetch = useRef(false)

  useEffect(() => {
    // only set user to undefined if update is not forced
    if (!isForcedFetch.current) setUser(undefined)
    if (isForcedFetch.current) isForcedFetch.current = false

    if (!address) return

    const fetchUser = async () => {
      try {
        const res = await api.userInfo(address, currentNetwork())
        setUser(res)
      } catch (err) {
        console.log(`failed to fetch user info: ${err}`)
      }
    }

    fetchUser()
  }, [address, refresh])

  return { user, refreshUser }
}
