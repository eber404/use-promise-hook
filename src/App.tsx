import { PropsWithChildren, useEffect } from 'react'
import './App.css'
import { usePromise } from './hooks/usePromise'

type Post = {
  userId: number
  id: number
  title: string
  body: string
}

const fetchPosts = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts123')
  if (!res.ok) throw Error(`status code ${res.status}`)
  return (await res.json()) as Promise<Post[]>
}

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <div>{children}</div>
    </>
  )
}

function App() {
  const { data, isLoading, error, resolve, isError, isSuccess } =
    usePromise(fetchPosts)

  useEffect(() => {
    void resolve()
  }, [])

  if (isLoading)
    return (
      <Layout>
        <p>loading...</p>
      </Layout>
    )

  if (error)
    return (
      <Layout>
        <p>{error}</p>
      </Layout>
    )

  return (
    <Layout>
      <ul>
        {data && data?.map((post) => <li key={post.id}>{post.title}</li>)}
      </ul>
    </Layout>
  )
}

export default App
