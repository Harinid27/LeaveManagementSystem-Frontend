import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState.jsx";
import { notificationService } from "../services/notificationService.js";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await notificationService.getMine();
    setNotifications(data.notifications);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications().catch((requestError) => {
      setError(requestError.displayMessage || "Unable to load notifications");
      setLoading(false);
    });
  }, []);

  const handleRead = async (notificationId) => {
    setError("");
    setMessage("");
    try {
      await notificationService.markRead(notificationId);
      setMessage("Notification marked as read.");
      await loadNotifications();
    } catch (requestError) {
      setError(requestError.displayMessage || "Unable to update notification");
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Notifications</p>
        <h2>Leave status updates and workflow alerts.</h2>
      </div>
      {message ? <p className="success-text">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <LoadingState label="Loading notifications..." /> : <div className="stack">
        {notifications.map((notification) => (
          <article
            className={`panel notification-card${notification.isRead ? " notification-card--read" : ""}`}
            key={notification._id}
          >
            <div className="leave-card__header">
              <div>
                <h3>{notification.title}</h3>
                <p className="helper-text">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`status-badge ${notification.isRead ? "" : "status-badge--pending"}`}>
                {notification.isRead ? "read" : "new"}
              </span>
            </div>
            <p>{notification.message}</p>
            {!notification.isRead ? (
              <button className="btn btn-primary" type="button" onClick={() => handleRead(notification._id)}>
                Mark as Read
              </button>
            ) : null}
          </article>
        ))}
        {!notifications.length ? <div className="panel">No notifications yet.</div> : null}
      </div>}
    </section>
  );
}

export default NotificationsPage;
