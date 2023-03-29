import ky from 'ky'
import { Address } from 'wagmi'
import { API_URL } from './constants'
import type { Network, Domain, UserInfo, AddrRecords, TextRecords, DomainListing } from './types'

export type DomainStatus = {
  isValid: boolean
  isAvailable: boolean
  validationMessage?: string
  listing?: DomainListing
}

export type DomainPrice = {
  wei: string
  eth: string
  usd: number
}

export type DomainInfo = {
  tokenId: string
  registrant: Address | null
  controller: Address | null
  resolver: Address | null
  textRecords: TextRecords
  addrRecords: AddrRecords
}

export type EthPrice = {
  usd: number
  updatedAt: number
}

async function checkDomain(
  domain: string,
  network: Network = 'mainnet',
  withListing: boolean = false
): Promise<DomainStatus> {
  return await ky
    .get(`${API_URL}/domain/check?domain=${domain}&network=${network}&withListing=${withListing}`)
    .json<DomainStatus>()
}

function checkNames(
  names: string[],
  network: Network = 'mainnet',
  withListing: boolean = false
): Promise<DomainStatus[]> {
  return Promise.all(
    names.map((name) =>
      ky
        .get(`${API_URL}/domain/check?domain=${name}&network=${network}&withListing=${withListing}`)
        .json<DomainStatus>()
    )
  )
}

async function getPrice(
  domain: string,
  network: Network = 'mainnet',
  duration: number
): Promise<DomainPrice> {
  return await ky
    .get(`${API_URL}/domain/price?domain=${domain}&network=${network}&duration=${duration}`)
    .json<DomainPrice>()
}

async function domainInfo(domain: Domain, network: Network = 'mainnet'): Promise<DomainInfo> {
  return await ky
    .get(`${API_URL}/domain/info?domain=${domain}&network=${network}`)
    .json<DomainInfo>()
}

async function userInfo(address: Address, network: Network = 'mainnet'): Promise<UserInfo> {
  return await ky.get(`${API_URL}/user?address=${address}&network=${network}`).json<UserInfo>()
}

async function saveFeedback(author: string, message: string): Promise<void> {
  await ky.post(`${API_URL}/feedback`, { json: { author, message } })
}

async function ethPrice(): Promise<EthPrice> {
  return await ky.get(`${API_URL}/ethPrice`).json<EthPrice>()
}

const api = {
  checkDomain,
  checkNames,
  getPrice,
  domainInfo,
  userInfo,
  saveFeedback,
  ethPrice
}

export default api
