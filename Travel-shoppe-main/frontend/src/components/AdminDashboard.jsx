import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ManagePackages from './ManagePackages'
import ManageDestinations from './ManageDestinations'
import ManageBookings from './ManageBookings'
import NotificationsPanel from './NotificationsPanel'
import { getPackages, getDestinations, getBookings, getNotifications } from '../services/api'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    packages: 0,
    destinations: 0,
    bookings: 0
  })
  const [unreadCount, setUnreadCount] = useState(0)

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn')
    navigate('/admin/login')
  }

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [packagesRes, destinationsRes, bookingsRes] = await Promise.all([
          getPackages(),
          getDestinations(),
          getBookings()
        ])
        setStats({
          packages: packagesRes.data?.length || 0,
          destinations: destinationsRes.data?.length || 0,
          bookings: bookingsRes.data?.length || 0
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      }

      // Fetch notification count separately — don't let it block stats
      try {
        const notifRes = await getNotifications()
        setUnreadCount(notifRes.unreadCount || 0)
      } catch (error) {
        console.error('Failed to load notification count:', error)
      }
    }
    loadStats()
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'packages':
        return <ManagePackages />
      case 'destinations':
        return <ManageDestinations />
      case 'bookings':
        return <ManageBookings />
      case 'notifications':
        return <NotificationsPanel />
      default:
        return (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.packages}</h3>
                  <p>Total Packages</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🌍</div>
                <div className="stat-info">
                  <h3>{stats.destinations}</h3>
                  <p>Destinations</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>{stats.bookings}</h3>
                  <p>Total Bookings</p>
                </div>
              </div>
            </div>
            <div className="welcome-message">
              <h2>Welcome to Travel Shoppe Admin</h2>
              <p>Manage your travel packages, destinations, and bookings from this centralized dashboard.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="admin-dashboard">

  {/* 🔥 TOP NAVBAR */}
  <div className="admin-navbar">
  <h2 className="logo">Travel Shoppe Admin</h2>

  <div className="nav-links">
    <button onClick={() => setActiveTab('overview')} className={activeTab==='overview'?'active':''}>Overview</button>
    <button onClick={() => setActiveTab('packages')} className={activeTab==='packages'?'active':''}>Packages</button>
    <button onClick={() => setActiveTab('destinations')} className={activeTab==='destinations'?'active':''}>Destinations</button>
    <button onClick={() => setActiveTab('bookings')} className={activeTab==='bookings'?'active':''}>Bookings</button>
    <button
      onClick={() => { setActiveTab('notifications'); setUnreadCount(0); }}
      className={activeTab==='notifications'?'active':''}
      style={{ position: 'relative' }}
    >
      🔔 Notifications
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          background: '#ef4444',
          color: 'white',
          borderRadius: '999px',
          fontSize: '0.65rem',
          fontWeight: 700,
          padding: '1px 6px',
          lineHeight: '1.4'
        }}>{unreadCount}</span>
      )}
    </button>
  </div>

  <div className="nav-right">
    <button onClick={handleLogout} className="logout-btn">Logout</button>
  </div>
</div>

  {/* 🔥 MAIN CONTENT */}
  <div className="admin-main">
    <div className="admin-header">
      <h1>
        {activeTab === 'overview' && 'Dashboard Overview'}
        {activeTab === 'packages' && 'Manage Packages'}
        {activeTab === 'destinations' && 'Manage Destinations'}
        {activeTab === 'bookings' && 'Manage Bookings'}
        {activeTab === 'notifications' && '🔔 Notifications'}
      </h1>
    </div>

    <div className="admin-content">
      {renderContent()}
    </div>
  </div>

</div>
  )
}

export default AdminDashboard