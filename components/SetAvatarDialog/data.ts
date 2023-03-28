// fake API response from Reservoir API
// https://api.reservoir.tools/users/0xB4b18818E9262584921b371c891b62219DaefeA3/tokens/v6
import fakeResponse from './fakeResponse.json' assert { type: 'json' }

// Tokens that are allowed to be used as avatars
export interface NFTAvatarOption {
  id: string
  contract: string
  image: string
  kind: 'erc721' | 'erc1155' // ENS only supports these two at the moment
  name: string
  tokenId: string
  collection: {
    id: string
    name: string
  }
  acquiredAt?: Date
}

// fake delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface Query {
  limit?: number
  continuation?: string
  address: string
}

export const fetchAvatarTokens = async ({ address, continuation, limit = 8 }: Query) => {
  await delay(1000)

  const json = fakeResponse
  const { /* continuation, */ tokens }: { continuation: string | null; tokens: Array<any> } = json

  const startFrom = continuation ? Number(continuation) : 0

  const allNFTs = tokens.map((token) => {
    const {
      token: { contract, image, kind, name, tokenId, collection },
      ownership: { acquiredAt }
    } = token

    // unique id that allows us to check if this NFT is currenly used as an avatar
    const id = `${contract}-${tokenId}`

    return {
      id,
      contract,
      image,
      kind,
      name,
      tokenId,
      collection,
      acquiredAt
    } as NFTAvatarOption
  })

  const nfts = allNFTs
    .filter((nft) => {
      return ['erc721', 'erc1155'].includes(nft.kind) && nft.image
    })
    .slice(startFrom, limit)

  const nextContinuation = startFrom + limit
  return { nfts, continuation: nextContinuation >= tokens.length ? null : nextContinuation }
}
