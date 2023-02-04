import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createAction,
  isAnyOf,
} from '@reduxjs/toolkit'
import { apiSlice } from '../../api/apiSlice'

import { client } from '../../api/client'
import { forceGenerateNotifications } from '../../api/server'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

/*
const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})
*/

const notificationsReceived = createAction(
  'notifications/notificationsReceived'
)

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket('ws://localhost')
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          // when data is received from the socket connection to the server,
          // update our query result with the received message
          const listener = (event) => {
            const message = JSON.parse(event.data)
            switch (message.type) {
              case 'notifications': {
                updateCachedData((draft) => {
                  // Insert all received notifications from the websocket
                  // into the existing RTKQ cache array
                  draft.push(...message.payload)
                  draft.sort((a, b) => b.date.localeCompare(a.date))
                })
                // Dispatch an additional action so we can track "read" state
                dispatch(notificationsReceived(message.payload))
                break
              }
              default:
                break
            }
          }

          ws.addEventListener('message', listener)
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close()
      },
    }),
  }),
})

const notificationsAdapter = createEntityAdapter()

const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  extendedApi.endpoints.getNotifications.matchFulfilled
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        notificationsAdapter.addOne(state, action.payload)
        Object.values(state.entities).forEach((notification) => {
          // Any notifications we've read are no longer new
          notification.isNew = !notification.read
        })
      })
      .addMatcher(matchNotificationsReceived, (state, action) => {
        // Add client-side metadata for tracking new notifications
        const notificationsMetadata = action.payload.map((notification) => ({
          id: notification.id,
          read: false,
          isNew: true,
        }))

        Object.values(state.entities).forEach((notification) => {
          // Any notifications we've read are no longer new
          notification.isNew = !notification.read
        })

        notificationsAdapter.upsertMany(state, notificationsMetadata)
      })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const selectAllNotifications2 = (state) => state.notifications

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllNotifications,
  selectEntities: selectMetadataEntities,
  // selectById: selectPostById,
  // selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = notificationsAdapter.getSelectors((state) => state.notifications)

export const { useGetNotificationsQuery } = extendedApi

const emptyNotifications = []

export const selectNotificationsResult =
  extendedApi.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => notificationsResult.data ?? emptyNotifications
)

export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
  const allNotifications = selectNotificationsData(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification?.date ?? ''
  // Hardcode a call to the mock server to simulate a server push scenario over websockets
  forceGenerateNotifications(latestTimestamp)
}
