import { ProgressBar } from 'components/icons'
import api, { DomainInfo, UserInfo } from 'lib/api'
import { useEffect, useState } from 'react'
import { Address, useAccount, useChainId, useEnsAvatar, useFeeData } from 'wagmi'
import ui from 'styles/ui.module.css'
import styles from './profile.module.css'
import { Domain, Fields, toNetwork } from 'lib/types'
import { useSendSetFields } from 'lib/hooks/useSendSetFields'
import { useTxPrice } from 'lib/hooks/useTxPrice'
import { useSetPrimaryEns } from 'lib/hooks/useSetPrimaryEns'
import { useIsMounted } from 'usehooks-ts'

const Avatar = ({ chainId, address }: { chainId: number; address?: Address }) => {
  const { data: avatar, isLoading, error } = useEnsAvatar({ chainId, address })

  if (isLoading) return <>Loading...</>
  if (error) return <div className={ui.error}>{error?.message}</div>
  return <img className={styles.avatar} src={avatar!} alt="ENS Avatar" />
}

const Profile = () => {
  const { address, isDisconnected } = useAccount()
  const chainId = useChainId()
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null)
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [fields, setFields] = useState<Fields>({})
  const [domain, setDomain] = useState<Domain | null>(null)

  const {
    isLoading: isFieldsLoading,
    write,
    writeError,
    remoteError,
    isRemoteError,
    isWriteError,
    config
  } = useSendSetFields({ domain, fields, onSuccess: () => setMode('view') })
  const { data: feeData } = useFeeData()
  const txPrice = useTxPrice({ config, feeData })
  const isMounted = useIsMounted()

  useEffect(() => {
    if (address) {
      api.userInfo(address, toNetwork(chainId)).then((res) => {
        setUserInfo(res)
        setDomain(res.primaryEns!)
        if (res.primaryEns)
          api.domainInfo(res.primaryEns!, toNetwork(chainId)).then((res) => {
            setDomainInfo(res)
          })
      })
    }
  }, [chainId, mode, address])

  if (isDisconnected) return <p>Please connect wallet</p>

  return (
    <main className={styles.main}>
      {isMounted() ? <Avatar {...{ chainId, address }} /> : null}
      <h1 className={styles.domain}>{domain}</h1>
      <p className={styles.desc}>{domainInfo?.records.description}</p>
    </main>
  )
}

export default Profile
