import ky from "ky"
import { API_URL } from "./constants"
import { Network } from "./types"

type DomainStatus = {
  domain: string
  isAvailable: boolean
}

async function checkDomain(domain: string, network: Network = 'mainnet'): Promise<boolean> {
  const res = await ky.get(`${API_URL}/domain/check?domain=${domain}&network=${network}`).json<DomainStatus>()
  return res.isAvailable
}


const api = {
  checkDomain,
}

export default api