import { makeCommitmentData } from '@ensdomains/ensjs/utils/registerHelpers'
import { BulkRegistrationParams, CommitmentParams, Domain, RegistrationParams } from './types'
import { getDomainName, ZERO_ADDRESS } from './utils'
import { ethers } from 'ethers'
import { generateRecordCallArray } from '@ensdomains/ensjs/utils/recordHelpers'
import { namehash } from 'ethers/lib/utils.js'
import { ETH_RESOLVER_ABI } from './constants'

/**
 * A function to generate secret for commit transaction.
 * It uses Web Crypto API.
 */
export function generateCommitSecret() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return `0x${Array.from(bytes)
    .map((p) => p.toString(16).padStart(2, '0'))
    .join('')}`
}

// Raw internal function to generate commitment
function _makeCommitment(
  name: string,
  owner: string,
  duration: number,
  secret: string,
  resolver: string,
  data: string[],
  reverseRecord: boolean,
  ownerControlledFuses: number
): string {
  const label = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))

  if (data.length > 0 && resolver === ZERO_ADDRESS) {
    throw new Error('ResolverRequiredWhenDataSupplied')
  }

  const encoded = ethers.utils.defaultAbiCoder.encode(
    ['bytes32', 'address', 'uint256', 'bytes32', 'address', 'bytes[]', 'bool', 'uint16'],
    [label, owner, duration, secret, resolver, data, reverseRecord, ownerControlledFuses]
  )

  return ethers.utils.keccak256(encoded)
}

/**
 * Generate secret and commitment hash for ENS commit transaction.
 */
export function makeCommitment(params: CommitmentParams): RegistrationParams {
  const { name, owner, duration, resolver, addr, reverseRecord } = params

  const secret = generateCommitSecret()
  const _name = getDomainName(name)
  const ownerControlledFuses = 0

  const data = new Array<string>()
  if (resolver && addr && addr !== ZERO_ADDRESS) {
    const node = namehash(_name)
    const ethCoinType = 60

    // TODO: test encoding works
    const iface = new ethers.utils.Interface(ETH_RESOLVER_ABI)
    const ethAddrData = iface.encodeFunctionData('setAddr', [node, ethCoinType, addr])
    data.push(ethAddrData)
  }

  const commitment = _makeCommitment(
    _name,
    owner,
    duration,
    secret,
    resolver ?? ZERO_ADDRESS,
    data,
    reverseRecord,
    ownerControlledFuses
  )
  return { ...params, secret, data, commitment }
}

/**
 * Generate list of commitments for ENS commit transaction with a single secret.
 */
export function makeCommitments(
  names: Domain[],
  owner: string,
  duration: number
): BulkRegistrationParams {
  const secret = generateCommitSecret()

  const commitments = names.map((name) => {
    const _name = getDomainName(name)
    return _makeCommitment(_name, owner, duration, secret, ZERO_ADDRESS, [], false, 0)
  })

  return {
    names,
    owner,
    secret,
    commitments
  }
}

/**
 * Estimated gas limit for single commit transaction.
 * Should only be used for UI purposes, not for actual gas limit calculations.
 */
export const COMMIT_GAS_AVERAGE = 46_267

/** Returns estimated average gas for single bulk register transactions. */
export function registerGasAverage(count: number) {
  return count === 1 ? 250_000 : 200_000 + count * 100_000
}

/** Returns gas limit for single and bulk register transactions. */
export function registerGasLimit(count: number) {
  return count === 1 ? 320_000 : (200_000 + count * 140_000) * 1.1
}
