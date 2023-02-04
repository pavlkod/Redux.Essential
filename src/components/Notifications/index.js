import { useDispatch, useSelector } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'

import { selectAllUsers } from '../User/sliceUser'

import {
  allNotificationsRead,
  selectAllNotifications,
  selectMetadataEntities,
  useGetNotificationsQuery,
} from './sliceNotification'
import { useLayoutEffect } from 'react'
import classNames from 'classnames'

export const NotificationsList = () => {
  // const notifications = useSelector(selectAllNotifications);
  const users = useSelector(selectAllUsers)
  const dispatch = useDispatch()
  const { data: notifications = [] } = useGetNotificationsQuery()
  const notificationsMetadata = useSelector(selectMetadataEntities)

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find((user) => user.id === notification.user) || {
      name: 'Unknown User',
    }

    const metadata = notificationsMetadata[notification.id]

    const notificationClassname = classNames('notification', {
      new: metadata.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  }, [])
  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
