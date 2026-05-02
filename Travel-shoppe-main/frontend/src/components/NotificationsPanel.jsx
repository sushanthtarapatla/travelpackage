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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>
          🔔 Notifications
          {unreadCount > 0 && (
            <span style={{
              marginLeft: '10px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '999px',
              padding: '2px 10px',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>{unreadCount} new</span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Mark all as read
          </button>
        )}
        <button
          onClick={handleDownloadContacts}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginLeft: '10px'
          }}
        >
          📥 Download Contacts
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['all', 'unread'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 18px',
              borderRadius: '20px',
              border: '2px solid',
              borderColor: filter === f ? '#667eea' : '#e2e8f0',
              background: filter === f ? '#667eea' : 'white',
              color: filter === f ? 'white' : '#6b7280',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s'
            }}
          >
            {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading && <p style={{ color: '#6b7280' }}>Loading notifications...</p>}

      {!loading && displayed.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 0',
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: '3rem' }}>🎉</div>
          <p style={{ marginTop: '12px', fontSize: '1rem' }}>
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
              <div key={type} style={{ marginBottom: '24px' }}>
                <h4 style={{
                  margin: '0 0 12px',
                  color: cfg.color,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {cfg.icon} {cfg.label} ({typeNotifications.length})
                </h4>
                {typeNotifications.map(n => (
                  <div
                    key={n._id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '14px 16px',
                      marginBottom: '10px',
                      borderRadius: '12px',
                      border: `1px solid ${n.isRead ? '#e2e8f0' : cfg.color}`,
                      background: n.isRead ? '#fafafa' : cfg.bg,
                      opacity: n.isRead ? 0.75 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      fontSize: '1.4rem',
                      minWidth: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: cfg.bg,
                      border: `1.5px solid ${cfg.color}`
                    }}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      {!n.isRead && (
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: cfg.color,
                          display: 'inline-block',
                          marginBottom: '4px'
                        }} />
                      )}
                      {n.type === 'contact' && n.contactId ? (
                        <div style={{ marginBottom: '8px' }}>
                          <p style={{ margin: '0 0 4px', color: '#1f2937', fontSize: '0.9rem', fontWeight: 600 }}>
                            {n.contactId.name} ({n.contactId.email})
                          </p>
                          {n.contactId.phone && (
                            <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: '0.85rem' }}>
                              Phone: {n.contactId.phone}
                            </p>
                          )}
                          {n.contactId.destination && (
                            <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: '0.85rem' }}>
                              Destination: {n.contactId.destination}
                            </p>
                          )}
                          <p style={{ margin: 0, color: '#1f2937', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            Message: {n.contactId.message}
                          </p>
                        </div>
                      ) : (
                        <p style={{ margin: 0, color: '#1f2937', fontSize: '0.9rem', lineHeight: 1.5 }}>
                          {n.message}
                        </p>
                      )}
                      <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.78rem' }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkRead(n._id)}
                          title="Mark as read"
                          style={{
                            background: 'none',
                            border: `1.5px solid ${cfg.color}`,
                            borderRadius: '6px',
                            color: cfg.color,
                            padding: '4px 10px',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n._id)}
                        title="Delete notification"
                        style={{
                          background: 'none',
                          border: '1.5px solid #ef4444',
                          borderRadius: '6px',
                          color: '#ef4444',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}
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
