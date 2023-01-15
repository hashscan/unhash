import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from 'styles/InputENS.module.css'
import ui from 'styles/ui.module.css'
import { useProvider } from 'wagmi'
import { ProgressBar } from './icons'

export const InputENS = () => {
  const [v, set] = useState('')
  const [isClaimable, setClaimable] = useState<null | boolean>(null)
  const [isLoading, setLoading] = useState(false)
  const provider = useProvider()
  const router = useRouter()

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <input
          className={styles.input}
          value={v}
          onChange={(e) => set(e.currentTarget.value)}
          placeholder="v1rtl.eth"
        />
        <button
          disabled={v === ''}
          style={{ width: 100 }}
          className={ui.button}
          onClick={() => {
            setLoading(true)
            if (isClaimable) return router.push(`/register?domain=${v}`)

            provider.resolveName(v).then((domain) => {
              setLoading(false)

              setClaimable(!domain)
            })
          }}
        >
          {isLoading ? <ProgressBar color="var(--text-primary)" /> : v === '' || !isClaimable ? 'check' : 'continue'}
        </button>
      </div>
      <div className={styles.info}>
        {isClaimable !== null && <div>{isClaimable === true ? 'Eligible!' : 'Domain already taken :('}</div>}
        <span>$5/y</span>
      </div>
    </div>
  )
}
