import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useGetPostQuery, useUpdatePostMutation } from '../../api/apiSlice'

// import { updatePost } from '../Posts/slicePosts'
import { selectAllUsers } from '../User/sliceUser'

export const EditPostForm = ({ history, match }) => {
  const { postId } = match.params

  const { data: post } = useGetPostQuery(postId)
  const [updatePost, { isLoading }] = useUpdatePostMutation()

  // const post = useSelector((state) =>
  //   state.posts.find((post) => post.id === postId)
  // );
  const users = useSelector(selectAllUsers)

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [userId, setUserId] = useState(post.user || '0')

  const dispatch = useDispatch()
  // const history = useHistory();

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  const onSavePostClicked = () => {
    if (title && content) {
      updatePost({ id: postId, title, content, user: users[userId] })
      history.push(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <label htmlFor="user">User</label>
        <select id="user" value={userId} onChange={onAuthorChanged}>
          {Object.values(users).map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  )
}
