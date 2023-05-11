'use client'

import {
  cloneElement,
  ComponentProps,
  isValidElement,
  PropsWithChildren,
  ReactElement
} from 'react'
import { NextPage } from 'next'
import clsx from 'clsx'

import { Nav } from 'components/Nav/Nav'
import { useCurrentRoute } from 'lib/hooks/useCurrentRoute'
import { usePathname } from 'next/navigation'

import styles from './layouts.module.css'

/**
 * How to use page layouts?
 *
 * import { ContainerLayout, PageWithLayout } from "components/layouts"
 *
 * const Page: PageWithLayout = () => { ... }
 *
 * Page.layout = ContainerLayout // or...
 * Page.layout = <ContainerLayout nav={false} /> // or...
 * Page.layout = false
 */

// Components in pages/ must have type of PageWithLayout to be
// able to set the `layout` property
export type PageWithLayout<P = {}> = NextPage<P> & {
  layout?: false | ReactElement | Function
}

export interface BaseLayoutProps {
  nav?: boolean
}

export const FullWidthLayout = ({ nav = true, children }: PropsWithChildren<BaseLayoutProps>) => {
  return (
    <>
      {nav && <Nav usePathname={useCurrentRoute} />}
      {children}
    </>
  )
}

export interface ContainerLayoutProps extends BaseLayoutProps {
  verticalPadding?: boolean
  centered?: boolean
}

export const ContainerLayout = ({
  nav = true,
  verticalPadding = true,
  centered = false,
  children
}: PropsWithChildren<ContainerLayoutProps>) => {
  return (
    <>
      {nav && <Nav usePathname={useCurrentRoute} />}
      <div
        className={clsx(styles.container, {
          [styles.withVerticalPadding]: verticalPadding,
          [styles.centered]: centered
        })}
      >
        {children}
      </div>
    </>
  )
}

/**
 * Layout for app ROUTER
 */
export const AppRouterLayout = ({
  nav = true,
  verticalPadding = true,
  centered = false,
  children
}: PropsWithChildren<ContainerLayoutProps>) => {
  return (
    <>
      {nav && <Nav usePathname={usePathname} />}
      <div
        className={clsx(styles.container, {
          [styles.withVerticalPadding]: verticalPadding,
          [styles.centered]: centered
        })}
      >
        {children}
      </div>
    </>
  )
}

export const CenteredLayout = (props: ComponentProps<typeof ContainerLayout>) => (
  <ContainerLayout {...props} centered />
)

export const DefaultLayout = ContainerLayout

/**
 * Wraps children with layout inherited from the page component
 * @param layout
 * @param children
 */
export const wrapInLayout = (pageComponent: PageWithLayout<any>, children: ReactElement) => {
  let layout: PageWithLayout['layout'] = pageComponent.layout

  if (typeof layout === 'undefined') {
    layout = DefaultLayout
  }

  /*
   * import { CustomLayout } from 'custom-layout'
   * Page.layout = CustomLayout
   */
  if (typeof layout === 'function') {
    const Layout = layout
    return <Layout>{children}</Layout>
  }

  /*
   * Page.layout = <Layout sidebar={false} />
   */
  if (typeof layout === 'object' && isValidElement(layout)) {
    return cloneElement(layout, {}, children)
  }

  /*
   * Page.layout = false
   */
  return children
}
