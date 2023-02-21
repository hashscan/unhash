import ky from 'ky'
import { Address } from 'wagmi'
import { API_URL } from './constants'
import type { Network, Domain, DomainRecords } from './types'

type DomainStatus = {
  isAvailable: boolean
  listing?: DomainListing
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
  records: DomainRecords
}

export type DomainListing = {
  url: string
  source: {
    name: string
    url: string
  }
  priceUsd: number
  price: number
  currency: Currency
}

export type UserDomain = {
  domain: string
  namehash: string | null
  isValid: boolean
  owned: boolean
  controlled: boolean
  resolved: boolean
}

export type UserInfo = {
  primaryEns: Domain | null
  domains: UserDomain[]
}

export type Currency = {
  contract: string
  name: string
  symbol: string
  decimals: number
}


async function checkDomain(domain: string, network: Network = 'mainnet', withListing: boolean = false): Promise<boolean> {
  const res = await ky.get(`${API_URL}/domain/check?domain=${domain}&network=${network}&withListing=${withListing}`).json<DomainStatus>()
  return res.isAvailable
}

async function getPrice(domain: string, network: Network = 'mainnet', duration: number): Promise<DomainPrice> {
  return await ky
    .get(`${API_URL}/domain/price?domain=${domain}&network=${network}&duration=${duration}`)
    .json<DomainPrice>()
}

async function domainInfo(domain: Domain, network: Network = 'mainnet'): Promise<DomainInfo> {
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
