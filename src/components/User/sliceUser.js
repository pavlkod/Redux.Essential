import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { client } from "../../api/client";

const usersAdapter = createEntityAdapter();
const initialState = usersAdapter.getInitialState();

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await client.get("/fakeApi/users");
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(build) {
    build.addCase(fetchUsers.fulfilled, usersAdapter.setAll);
  }
});

export const selectAllUsers2 = (state) => state.users;
export const selectUserById2 = (state, id) =>
  state.users.find((user) => user.id === id);

export default usersSlice.reducer;

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersAdapter.getSelectors((state) => state.users);
