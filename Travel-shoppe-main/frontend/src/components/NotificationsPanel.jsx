import { useEffect, useState } from 'react'
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, downloadContacts } from '../services/api'

const TYPE_CONFIG = {
  cancellation: { icon: '❌', label: 'Cancellation', color: '#ef4444', bg: '#fef2f2' },
  contact:      { icon: '📩', label: 'Enquiry',      color: '#2563eb', bg: '#eff6ff' },
  upcoming:     { icon: '🗓️', label: 'Upcoming',     color: '#d97706', bg: '#fffbeb' },
}

const NotificationsPanel = ({ onStatsChange }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | unread

  const load = async () => {
    setLoading(true)
    try {
      const res = await getNotifications()
      setNotifications(res.data || [])
    } catch (e) {
      console.error('Failed to load notifications', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      )
    } catch (e) {
      console.error('Failed to mark read', e)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (e) {
      console.error('Failed to mark all read', e)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n._id !== id))
      if (onStatsChange) onStatsChange()
    } catch (e) {
      console.error('Failed to delete notification', e)
    }
  }

  const handleDownloadContacts = async () => {
    try {
      const response = await downloadContacts()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `contacts_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Failed to download contacts', e)
      alert('Failed to download contacts. Please try again.')
    }
  }

  const displayed = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="admin-card">
      {/* Header */}
      <div className="admin-card-header">
        <h3 className="admin-card-title">
          🔔 Notifications
          {unreadCount > 0 && (
            <span className="notification-summary-badge">{unreadCount} new</span>
          )}
        </h3>
        <div className="admin-actions">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-outline"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={handleDownloadContacts}
            className="btn-gold"
          >
            📥 Download Contacts
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="notification-filter-row">
        {['all', 'unread'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`admin-filter-tab ${filter === f ? 'active' : ''}`}
          >
            {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading && <p className="admin-status-text">Loading notifications...</p>}

      {!loading && displayed.length === 0 && (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">🎉</div>
          <p>
            {filter === 'unread' ? 'No unread notifications!' : 'No notifications yet.'}
          </p>
        </div>
      )}

      {!loading && displayed.length > 0 && (
        <div>
          {['contact', 'cancellation', 'upcoming'].map(type => {
            const typeNotifications = displayed.filter(n => n.type === type)
            if (typeNotifications.length === 0) return null
            const cfg = TYPE_CONFIG[type]
            return (
              <div key={type} className="notification-group">
                <h4 className="notification-group-title" style={{ color: cfg.color }}>
                  {cfg.icon} {cfg.label} ({typeNotifications.length})
                </h4>
                {typeNotifications.map(n => (
                  <div
                    key={n._id}
                    className="notification-card"
                    style={{
                      borderColor: n.isRead ? '#e2e8f0' : cfg.color,
                      background: n.isRead ? '#fafafa' : cfg.bg,
                      opacity: n.isRead ? 0.75 : 1
                    }}
                  >
                    {/* Icon */}
                    <div className="notification-icon" style={{ background: cfg.bg, borderColor: cfg.color }}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="notification-content">
                      {!n.isRead && (
                        <span className="notification-unread-dot" style={{ background: cfg.color }} />
                      )}
                      {n.type === 'contact' && n.contactId ? (
                        <div className="notification-contact-details">
                          <p className="notification-contact-name">
                            {n.contactId.name} ({n.contactId.email})
                          </p>
                          {n.contactId.phone && (
                            <p className="notification-contact-meta">Phone: {n.contactId.phone}</p>
                          )}
                          {n.contactId.destination && (
                            <p className="notification-contact-meta">Destination: {n.contactId.destination}</p>
                          )}
                          <p className="notification-message">
                            Message: {n.contactId.message}
                          </p>
                        </div>
                      ) : (
                        <p className="notification-message">
                          {n.message}
                        </p>
                      )}
                      <p className="notification-meta">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="notification-action-group">
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkRead(n._id)}
                          title="Mark as read"
                          className="notification-action-btn notification-action-read"
                          style={{ borderColor: cfg.color, color: cfg.color }}
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n._id)}
                        title="Delete notification"
                        className="notification-action-btn notification-action-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NotificationsPanel
