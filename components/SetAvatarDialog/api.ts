// fake API response from Reservoir API
// https://api.reservoir.tools/users/0xB4b18818E9262584921b371c891b62219DaefeA3/tokens/v6
import fakeResponse from './fakeResponse.json' assert { type: 'json' }

export type ContinuationToken = string | null

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
  isSpamContract: boolean
  acquiredAt?: Date
}

interface Query {
  continuation?: ContinuationToken
  limit?: number
  address: string
}

interface Response {
  nfts: Array<NFTAvatarOption>
  avatar: NFTAvatarOption | null // currently set avatar
  continuation: ContinuationToken
}

// fake delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// cycle three times
const allTokens = [
  ...fakeResponse.tokens.filter((t) => t.token.image),
  ...fakeResponse.tokens.filter((t) => t.token.image),
  ...fakeResponse.tokens.filter((t) => t.token.image)
]

export const fetchAvatarTokens = async ({
  address,
  continuation,
  limit = 8
}: Query): Promise<Response> => {
  await delay(1000)

  const json = fakeResponse
  const { /* continuation, */ tokens }: { tokens: Array<any> } = {
    tokens: allTokens
  }

  const startFrom = continuation ? Number(continuation) : 0

  const fetchedNFTs = tokens.slice(startFrom, startFrom + limit).map((token) => {
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
      isSpamContract: false,
      acquiredAt
    } as NFTAvatarOption
  })

  const alreadyFetched = startFrom + fetchedNFTs.length
  const nextContinuation: ContinuationToken =
    alreadyFetched >= tokens.length ? null : String(alreadyFetched)

  return { nfts: fetchedNFTs, avatar: fetchedNFTs[2], continuation: nextContinuation }
}
