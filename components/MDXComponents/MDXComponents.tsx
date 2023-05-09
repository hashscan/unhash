import { PropsWithChildren } from 'react'
import NextLink from 'next/link'
import NextImage from 'next/image'

import styles from './MDXComponents.module.css'

export const Link = ({ href, children }: PropsWithChildren<{ href?: string }>) =>
  href ? <NextLink href={href}>{children}</NextLink> : null

export const Image = ({ src, alt }: { src?: string; alt?: string }) =>
  src ? (
    <>
      <NextImage src={src} alt={alt ?? 'image'} width={1200} height={627} />
      {alt && <span>{alt}</span>}
    </>
  ) : null

export const Paragraph = ({ children }: PropsWithChildren<{}>) => (
  <p className={styles.paragraph}>{children}</p>
)
