import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetPostQuery } from '../../api/apiSlice'
import { PostAuthor } from '../PostAuthor'
import { selectPostById } from '../Posts/slicePosts'
import { Spinner } from '../Spinner'

export const SinglePostPage = ({ location, match }) => {
  const { postId } = match.params

  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

  /*if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }*/

  let content

  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <section>
        <article className="post">
          <h2>{post.title}</h2>
          <p className="post-content">{post.content}</p>
          <PostAuthor userId={post.user} />{' '}
          <Link to={`/posts/${postId}/edit`}>Edit</Link>
        </article>
      </section>
    )
  }

  return <div>{content}</div>
}
