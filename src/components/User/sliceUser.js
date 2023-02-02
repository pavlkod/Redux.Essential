import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit'
import { apiSlice } from '../../api/apiSlice'
import { client } from '../../api/client'

/*
const usersAdapter = createEntityAdapter()
const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(build) {
    build.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  },
})

export const selectAllUsers2 = (state) => state.users
export const selectUserById2 = (state, id) =>
  state.users.find((user) => user.id === id)

export default usersSlice.reducer

export const {
  selectAll: selectAllUsers3,
  selectById: selectUserById3,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users)
*/

const emptyUsers = []
const selectUsersResult = apiSlice.endpoints.getUsers.select()

export const selectAllUsers = createSelector(
  selectUsersResult,
  (users) => users?.data ?? emptyUsers
)
export const selectUserById = createSelector(
  selectAllUsers,
  (state, userId) => userId,
  (users, id) => users.find((user) => user.id === id)
)
