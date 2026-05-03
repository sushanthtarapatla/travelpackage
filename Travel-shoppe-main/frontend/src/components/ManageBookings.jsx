import { useEffect, useMemo, useState } from 'react'
import { getBookings, updateBookingStatus, downloadBookings } from '../services/api'

const ManageBookings = ({ onStatsChange }) => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')

  const loadBookings = async () => {
    setLoading(true)
    setMessage('')
    try {
      const response = await getBookings()
      setBookings(response.data || [])
    } catch (error) {
      setMessage('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])
const handleCancel = async (id) => {
  try {
    await updateBookingStatus(id, 'cancelled');
    setBookings(prev =>
      prev.map(b =>
        b._id === id ? { ...b, status: "cancelled" } : b
      )
    );
    if (onStatsChange) onStatsChange();
  } catch (error) {
    console.error("Cancel failed", error);
  }
};

const handleStatusChange = async (id, newStatus) => {
  try {
    await updateBookingStatus(id, newStatus);
    setBookings(prev =>
      prev.map(b =>
        b._id === id ? { ...b, status: newStatus } : b
      )
    );
    if (onStatsChange) onStatsChange();
  } catch (error) {
    console.error("Status update failed", error);
  }
};

  const handleDownloadBookings = async () => {
    try {
      const response = await downloadBookings()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Failed to download bookings', e)
      alert('Failed to download bookings. Please try again.')
    }
  }

  const destinationSummary = useMemo(() => {
    const summary = {}

    bookings
      .filter((booking) => booking.status !== 'cancelled')
      .forEach((booking) => {
        const key = booking.destination || 'Unknown'
        if (!summary[key]) {
          summary[key] = { destination: key, totalBookings: 0, totalPeople: 0 }
        }
        summary[key].totalBookings += 1
        summary[key].totalPeople += Number(booking.people || 0)
      })

    return Object.values(summary)
  }, [bookings])

  const selectedBookings = useMemo(() => {
    if (!selectedDestination) return []
    return bookings
      .filter(
        (booking) =>
          booking.destination === selectedDestination && booking.status !== 'cancelled'
      )
      .sort((a, b) => new Date(a.travelDate) - new Date(b.travelDate))
  }, [bookings, selectedDestination])

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Manage Bookings</h3>
        <button onClick={handleDownloadBookings} className="btn-gold">
          📥 Download Bookings
        </button>
      </div>
      {message ? <p className="admin-message">{message}</p> : null}
      {loading ? <p>Loading bookings...</p> : null}
      {!loading && !destinationSummary.length ? <p>No active bookings available.</p> : null}

      {!loading && destinationSummary.length ? (
        <div>
          <h4>Destination Summary</h4>
          {destinationSummary.map((item) => (
            <button
              key={item.destination}
              type="button"
              className="admin-list-button"
              onClick={() => setSelectedDestination(item.destination)}
            >
              <span>
                <strong>{item.destination}</strong>
              </span>
              <span>
                Bookings: {item.totalBookings} | People: {item.totalPeople}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {selectedDestination ? (
        <div className="admin-section-spacing">
          <h4>{selectedDestination} Bookings</h4>
          {!selectedBookings.length ? <p>No bookings for this destination.</p> : null}
          {selectedBookings.map((booking) => (
  <div key={booking._id} className="admin-list-row">

    <div>
      <strong>{booking.name}</strong> | {booking.phone}
    </div>

    <div>
      {new Date(booking.travelDate).toLocaleDateString()} | People: {booking.people}
    </div>

    <div className="booking-actions-row">
      <select
        value={booking.status}
        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
        className={`status-select status-${booking.status}`}
        disabled={booking.status === 'cancelled'}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {booking.status !== "cancelled" && (
        <button
          className="cancel-btn"
          onClick={() => {
            if (!window.confirm("Cancel this booking?")) return;
            handleCancel(booking._id);
          }}
        >
          Cancel
        </button>
      )}
    </div>

  </div>
))}
        </div>
      ) : null}
    </div>
  )
}

export default ManageBookings
