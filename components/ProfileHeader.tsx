import { useEnsName } from 'wagmi'
import { ProgressBar } from './icons'

export const ProfileHeader = ({ address }: { address?: `0x${string}` }) => {
  const { data: name, error, isError, isLoading } = useEnsName({ address })

  if (isError) return <div>Failed to resolve ENS: {error?.message}</div>
  if (isLoading) return <ProgressBar />

  return <h1>{name}</h1>
}
