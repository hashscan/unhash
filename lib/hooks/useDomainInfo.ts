import api, { DomainInfo } from 'lib/api'
import { Domain, Network } from 'lib/types'
import { useEffect, useState } from 'react'

/**
 * Fetches domain info from the API.
 * Server error are ignored.
 * @returns domain info, updated if pararm change
 */
export const useDomainInfo = (network: Network, domain: Domain): DomainInfo | undefined => {
  const [info, setInfo] = useState<DomainInfo>()

  useEffect(() => {
    setInfo(undefined)

    const fetchInfo = async () => {
      try {
        const res = await api.domainInfo(domain, network)
        setInfo(res)
      } catch (err) {
        console.log(`failed to fetch domain info: ${err}`)
      }
    }

    fetchInfo()
  }, [domain, network])

  return info
}
