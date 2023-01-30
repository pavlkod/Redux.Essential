import {
  createAsyncThunk,
  createSlice,
  nanoid,
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { client } from "../../api/client";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
});

const initialState = postsAdapter.getInitialState({
  // posts: [],
  status: "idle",
  error: null
});
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await client.get("/fakeApi/posts");
  return response.data;
});
export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost) => {
    console.log(initialPost);
    // We send the initial data to the fake API server
    const response = await client.post("/fakeApi/posts", initialPost);
    // The response includes the complete post object, including unique ID
    return response.data;
  }
);

const slicePosts = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: {
              thumbsUp: 0,
              hooray: 0,
              heart: 1,
              rocket: 0,
              eyes: 0
            }
          }
        };
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    updatePost(state, action) {
      const { id, title, content, userId } = action.payload;
      // const post = state.posts.find((post) => post.id === id);
      const post = state.entities[id];
      if (post) {
        post.title = title;
        post.content = content;
        post.user = userId;
      }
    },
    reactionAdd(state, action) {
      const { postId, reaction } = action.payload;
      // const existingPost2 = state.posts.find((post) => post.id === postId);
      const existingPost = state.entities[postId];
      existingPost.reactions[reaction]++;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        // state.posts = state.posts.concat(action.payload);
        postsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder.addCase(addNewPost.fulfilled, postsAdapter.addOne);
  }
});
export const {
  addPost,
  updatePost,
  reactionAdd,
  reactionAdded
} = slicePosts.actions;

export const selectPosts = (state) => state.posts.posts;
export const selectPostById2 = (state, id) =>
  state.posts.posts.find((post) => post.id === id);
export const selectPostsByUserId = createSelector(
  selectPosts,
  (state, userId) => userId,
  (posts, userId) => {
    return posts.filter((post) => post.user === userId);
  }
);
// console.log(postsAdapter.getSelectors())
export default slicePosts.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state) => state.posts);
