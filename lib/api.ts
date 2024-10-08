import ky from 'ky'
import { Address } from 'wagmi'
import { API_URL } from './constants'
import {
  Network,
  Domain,
  UserInfo,
  AddrRecords,
  TextRecords,
  DomainListing,
  NFTToken,
  currentNetwork
} from './types'

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

export type OrderPrice = {
  names: { [domain: string]: DomainPrice }
  fee: DomainPrice
  total: DomainPrice
}

export type DomainInfo = {
  contract: string
  tokenId: string
  namehash: string | null
  isWrapped: boolean
  owner: string // ENS owner
  registrant: Address | null // NameWrapper contract for wrapped names
  controller: Address | null // NameWrapper contract for wrapped names
  resolver: Address | null
  createdAt: string
  textRecords: TextRecords
  addrRecords: AddrRecords
}

export type EthPrice = {
  usd: number
  updatedAt: number
}

export type NFTsResponse = {
  tokens: NFTToken[]
  continuation?: string
}

async function checkDomain(
  domain: string,
  withListing: boolean = false,
  network: Network = currentNetwork()
): Promise<DomainStatus> {
  return await ky
    .get(`${API_URL}/domain/check?domain=${domain}&network=${network}&withListing=${withListing}`)
    .json<DomainStatus>()
}

async function getPrices(
  domains: string[],
  duration: number,
  network: Network = currentNetwork()
): Promise<OrderPrice> {
  return await ky
    .get(
      `${API_URL}/domain/price?domains=${domains.join(',')}&network=${network}&duration=${duration}`
    )
    .json<OrderPrice>()
}

async function domainInfo(
  domain: Domain,
  network: Network = currentNetwork()
): Promise<DomainInfo> {
  return await ky
    .get(`${API_URL}/domain/info?domain=${domain}&network=${network}`)
    .json<DomainInfo>()
}

async function userInfo(address: Address, network: Network = currentNetwork()): Promise<UserInfo> {
  return await ky.get(`${API_URL}/user?address=${address}&network=${network}`).json<UserInfo>()
}

async function saveFeedback(author: string, message: string): Promise<void> {
  await ky.post(`${API_URL}/feedback`, { json: { author, message } })
}

async function ethPrice(): Promise<EthPrice> {
  return await ky.get(`${API_URL}/ethPrice`).json<EthPrice>()
}

async function userNFTs(
  address: string,
  limit?: number,
  continuation?: string,
  network: Network = currentNetwork()
): Promise<NFTsResponse> {
  const query = new URLSearchParams({ network, address })

  if (limit) query.set('limit', limit.toString())
  if (continuation) query.set('continuation', continuation)

  const url = `${API_URL}/user/nfts?${query}`

  return await ky.get(url).json<NFTsResponse>()
}

const api = {
  checkDomain,
  getPrices,
  domainInfo,
  userInfo,
  saveFeedback,
  ethPrice,
  userNFTs
}

export default api
