import { useState } from 'react'
import { getBookingsByPhone, cancelBooking } from '../services/api'
import './UserCancellation.css'

const UserCancellation = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('form') // form | loading | results
  const [formData, setFormData] = useState({ phone: '', email: '' })
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setStep('loading')
    setMessage('')

    try {
      const response = await getBookingsByPhone(formData.phone)
      const userBookings = response.data.filter(booking =>
        booking.email.toLowerCase() === formData.email.toLowerCase() &&
        booking.status !== 'cancelled'
      )

      if (userBookings.length === 0) {
        setMessage('No active bookings found with these details.')
        setStep('form')
      } else {
        setBookings(userBookings)
        setStep('results')
      }
    } catch (error) {
      setMessage('Failed to find bookings. Please check your details.')
      setStep('form')
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      await cancelBooking(bookingId)
      setBookings(prev => prev.filter(b => b._id !== bookingId))
      setMessage('Booking cancelled successfully.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to cancel booking. Please try again.')
    }
  }

  const resetForm = () => {
    setStep('form')
    setFormData({ phone: '', email: '' })
    setBookings([])
    setMessage('')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cancellation-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Cancel Previously Booked Trips</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {step === 'form' && (
            <form onSubmit={handleSearch} className="cancellation-form">
              <p>Please enter your phone number and email to find your bookings.</p>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Find My Bookings
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Searching for your bookings...</p>
            </div>
          )}

          {step === 'results' && (
            <div className="results-section">
              <h3>Your Active Bookings</h3>
              <p>Select the booking you want to cancel:</p>

              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-info">
                      <h4>{booking.destination}</h4>
                      <p><strong>Name:</strong> {booking.name}</p>
                      <p><strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}</p>
                      <p><strong>People:</strong> {booking.people}</p>
                      <p><strong>Status:</strong> <span className={`status-${booking.status}`}>{booking.status}</span></p>
                    </div>
                    <button
                      className="btn-danger"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                ))}
              </div>

              <button className="btn-secondary" onClick={resetForm}>
                Search Again
              </button>
            </div>
          )}

          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserCancellation