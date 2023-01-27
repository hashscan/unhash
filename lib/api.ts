import ky from 'ky'
import { Address } from 'wagmi'
import { API_URL } from './constants'
import type { Network, Fields, Domain } from './types'

type DomainStatus = {
  domain: Domain
  isAvailable: boolean
}

export type DomainPrice = {
  wei: string
  eth: string
  usd: number
}

export type DomainInfo = {
  registrant: Address | null
  controller: Address | null
  resolver: Address | null
  records: Fields
}

export type UserInfo = {
  primaryEns: Domain | null
  domains: {
    owned: string[]
    controlled: string[]
    resolved: Domain[]
  }
}

async function checkDomain(domain: string, network: Network = 'mainnet'): Promise<boolean> {
  const res = await ky.get(`${API_URL}/domain/check?domain=${domain}&network=${network}`).json<DomainStatus>()
  return res.isAvailable
}

async function getPrice(domain: string, network: Network = 'mainnet', duration: number): Promise<DomainPrice> {
  return await ky
    .get(`${API_URL}/domain/price?domain=${domain}&network=${network}&duration=${duration}`)
    .json<DomainPrice>()
}

async function domainInfo(domain: string, network: Network = 'mainnet'): Promise<DomainInfo> {
  return await ky.get(`${API_URL}/domain/info?domain=${domain}&network=${network}`).json<DomainInfo>()
}

async function userInfo(address: Address, network: Network = 'mainnet'): Promise<UserInfo> {
  return await ky.get(`${API_URL}/user?address=${address}&network=${network}`).json<UserInfo>()
}

const api = {
  checkDomain,
  getPrice,
  domainInfo,
  userInfo
}

export default api
