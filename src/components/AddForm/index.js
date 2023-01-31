import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAddNewPostMutation } from '../../api/apiSlice'
// import { addNewPost, addPost } from '../Posts/slicePosts'
import { selectAllUsers } from '../User/sliceUser'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const dispatch = useDispatch()
  const users = useSelector(selectAllUsers)

  console.log(users)

  const [addNewPost, { isLoading }] = useAddNewPostMutation()

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  const canSave = [title, content, userId].every(Boolean) && !isLoading

  return (
    <section>
      <h2>Add a New Post</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (canSave) {
            try {
              await addNewPost({ title, content, user: userId }).unwrap()
              setTitle('')
              setContent('')
              setUserId('')
            } catch (e) {
              console.error('Fail: ', e)
            }
          }
        }}
      >
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
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
          <option></option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}
