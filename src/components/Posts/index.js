import classNames from 'classnames'
import { useMemo } from 'react'
import { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetPostsQuery } from '../../api/apiSlice'
import { ReactionButtons } from '../Emoji'
import { PostAuthor } from '../PostAuthor'
import { Spinner } from '../Spinner'
import { TimeAgo } from '../TimeAgo'
import {
  fetchPosts,
  selectPostById,
  selectPostIds,
  selectPosts,
} from './slicePosts'

const PostExcerpt = ({ post }) => {
  // const post = useSelector((state) => selectPostById(state, postId));
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      {Date.now()}
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export default function Posts() {
  const {
    data: posts = [],
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error,
    refetch,
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))
    const containerClassname = classNames('posts-container', {
      disabled: isFetching,
    })
    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
