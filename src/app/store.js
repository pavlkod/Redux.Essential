import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import postReducer from '../components/Posts/slicePosts'
import userReducer from '../components/User/sliceUser'
import notificationReducer from '../components/Notifications/sliceNotification'

import { apiSlice } from '../api/apiSlice'

export default configureStore({
  reducer: {
    posts: postReducer,
    users: userReducer,
    notifications: notificationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  devTools: { trace: true, traceLimit: 25 },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
