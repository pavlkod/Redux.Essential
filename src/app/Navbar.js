import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchNotifications,
  fetchNotificationsWebsocket,
  selectAllNotifications,
  useGetNotificationsQuery,
} from '../components/Notifications/sliceNotification'

export const Navbar = () => {
  const dispatch = useDispatch()

  // Trigger initial fetch of notifications and keep the websocket open to receive updates
  useGetNotificationsQuery()

  // const notificationsMetadata = useSelector(selectNotificationsMetadata)

  const notifications = useSelector(selectAllNotifications)
  const numUnreadNotifications = notifications.filter((n) => !n.read).length
  let notificationsBadge
  if (numUnreadNotifications > 0) {
    notificationsBadge = <span className="badge">{numUnreadNotifications}</span>
  }
  const fetchNewNotifications = () => {
    // dispatch(fetchNotifications())
    dispatch(fetchNotificationsWebsocket())
  }
  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">Notification {notificationsBadge}</Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}
