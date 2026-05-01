import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid =
      credentials.username === 'admin' && credentials.password === 'admin123'

    if (!isValid) {
      setError('Invalid credentials. Use admin / admin123')
      return
    }

    localStorage.setItem('isAdminLoggedIn', 'true')
    navigate('/admin/dashboard')
  }

  return (
    <div className="admin-page" style={{ display: 'grid', placeItems: 'center' }}>
      <form onSubmit={handleSubmit} className="admin-card" style={{ width: '100%', maxWidth: '420px' }}>
        <h2 style={{ margin: '0 0 16px' }}>Admin Login</h2>
        {error ? <p style={{ color: '#c62828', marginBottom: '12px' }}>{error}</p> : null}
        <div className="admin-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
          Sign In
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
