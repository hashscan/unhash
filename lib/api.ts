import ky from "ky"
import { API_URL } from "./constants"
import { Network, Fields } from "./types"

type DomainStatus = {
  domain: string
  isAvailable: boolean
}

export type DomainPrice = {
  wei: string
  eth: string
  usd: number
}

// Registrant, controller and resolver are always null for non-mainnet
export type DomainInfo = {
  registrant: string | null
  controller: string | null
  resolver: string | null
  records: Fields
}

async function checkDomain(domain: string, network: Network = 'mainnet'): Promise<boolean> {
  const res = await ky.get(`${API_URL}/domain/check?domain=${domain}&network=${network}`).json<DomainStatus>()
  return res.isAvailable
}

async function getPrice(domain: string, network: Network = 'mainnet', duration: number): Promise<DomainPrice> {
  return await ky.get(`${API_URL}/domain/price?domain=${domain}&network=${network}&duration=${duration}`)
    .json<DomainPrice>()
}

async function domainInfo(domain: string, network: Network = 'mainnet'): Promise<DomainInfo> {
  return await ky.get(`${API_URL}/domain/info?domain=${domain}&network=${network}`)
    .json<DomainInfo>()
}

const api = {
  checkDomain,
  getPrice,
  domainInfo,
}

export default api