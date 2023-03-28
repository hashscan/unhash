import { solidityKeccak256 } from 'ethers/lib/utils.js'
import { BulkRegistrationParams, CommitmentParams, Domain, RegistrationParams } from './types'
import { getDomainName, ZERO_ADDRESS } from './utils'

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
  secret: string,
  resolver: string,
  addr: string
): string {
  const label = solidityKeccak256(['string'], [name])

  if (resolver === ZERO_ADDRESS && addr === ZERO_ADDRESS) {
    return solidityKeccak256(['bytes32', 'address', 'bytes32'], [label, owner, secret])
  }

  if (resolver === ZERO_ADDRESS) {
    throw new Error('addr can only be set with resolver')
  }

  return solidityKeccak256(
    ['bytes32', 'address', 'address', 'address', 'bytes32'],
    [label, owner, resolver, addr, secret]
  )
}

/**
 * Generate secret and commitment hash for ENS commit transaction.
 */
export function makeCommitment(params: CommitmentParams): RegistrationParams {
  const { name, owner, resolver, addr } = params

  const secret = generateCommitSecret()
  const _name = getDomainName(name)

  const commitment = _makeCommitment(
    _name,
    owner,
    secret,
    resolver ?? ZERO_ADDRESS,
    addr ?? ZERO_ADDRESS
  )
  return { ...params, secret, commitment }
}

/**
 * Generate list of commitments for ENS commit transaction with a single secret.
 */
export function makeCommitments(names: Domain[], owner: string): BulkRegistrationParams {
  const secret = generateCommitSecret()

  const commitments = names.map((name) => {
    const _name = getDomainName(name)
    return _makeCommitment(_name, owner, secret, ZERO_ADDRESS, ZERO_ADDRESS)
  })

  return {
    names,
    owner,
    secret,
    commitments
  }
}
