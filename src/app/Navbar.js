import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchNotifications,
  selectAllNotifications
} from "../components/Notifications/sliceNotification";

export const Navbar = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);
  const numUnreadNotifications = notifications.reduce((acc, item) => {
    if (item.isNew) {
      acc += 1;
    }
    return acc;
  }, 0);
  let notificationsBadge;
  if (numUnreadNotifications > 0) {
    notificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    );
  }
  const fetchNewNotifications = () => {
    dispatch(fetchNotifications());
  };
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
  );
};
