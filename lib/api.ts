import ky from "ky"
import { API_URL } from "./constants"
import { Network } from "./types"

type DomainStatus = {
  domain: string
  isAvailable: boolean
}

export type DomainPrice = {
  priceWei: string
  priceEth: string
}

async function checkDomain(domain: string, network: Network = 'mainnet'): Promise<boolean> {
  const res = await ky.get(`${API_URL}/domain/check?domain=${domain}&network=${network}`).json<DomainStatus>()
  return res.isAvailable
}

async function getPrice(domain: string, network: Network = 'mainnet', duration: number): Promise<DomainPrice> {
  return await ky.get(`${API_URL}/domain/price?domain=${domain}&network=${network}&duration=${duration}`)
    .json<DomainPrice>()
}

const api = {
  checkDomain,
  getPrice,
}

export default api