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

export type DomainInfo = {
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

async function domainInfo(domain: string, network: Network = 'mainnet'): Promise<Fields> {
  const res = await ky.get(`${API_URL}/domain/info?domain=${domain}&network=${network}`)
    .json<DomainInfo>()
  return res.records
}

const api = {
  checkDomain,
  getPrice,
  domainInfo,
}

export default api