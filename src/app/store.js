import { configureStore } from "@reduxjs/toolkit";

import postReducer from "../components/Posts/slicePosts";
import userReducer from "../components/User/sliceUser";
import notificationReducer from "../components/Notifications/sliceNotification";

export default configureStore({
  reducer: {
    posts: postReducer,
    users: userReducer,
    notifications: notificationReducer
  },
  devTools: { trace: true, traceLimit: 25 }
});
