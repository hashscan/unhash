let MDXComponent: (props) => JSX.Element

declare module 'content/*.mdx' {
  export const title: string
  export const description: string
  export const slug: string
  export const preview: string

  export default MDXComponent
}

declare module '*.mdx' {
  export default MDXComponent
}
