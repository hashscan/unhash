import posts from 'content'
import Link from 'next/link'

export default function Posts() {
  return (
    <>
      <h1>Posts:</h1>
      <ul>
        {Object.values(posts).map((post) => (
          <li key={post.slug}>
            <Link href={`/how-tos/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
