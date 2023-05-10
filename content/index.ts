import * as post$1 from 'content/first-post.mdx'
import * as post$2 from 'content/second-post.mdx'

const normalize = (posts: (typeof post$1)[]) =>
  Object.fromEntries(posts.map((post) => [post.slug, post]))

// add post here
export default normalize([post$1, post$2])
