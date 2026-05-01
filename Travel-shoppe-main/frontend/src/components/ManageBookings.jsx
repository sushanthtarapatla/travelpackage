import { useEffect, useMemo, useState } from 'react'
import { getBookings } from '../services/api'
import { cancelBooking } from '../services/api'

const ManageBookings = () => {
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
    await cancelBooking(id);

    // update UI instantly
    setBookings(prev =>
      prev.map(b =>
        b._id === id ? { ...b, status: "cancelled" } : b
      )
    );
  } catch (error) {
    console.error("Cancel failed", error);
  }
};
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
      <h3>Manage Bookings</h3>
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
              className="admin-list-row"
              style={{ width: '100%', textAlign: 'left', background: '#fff' }}
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
        <div style={{ marginTop: '12px' }}>
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

    <div>
      {booking.status !== "cancelled" ? (
        <button
          className="cancel-btn"
          onClick={() => {
            if (!window.confirm("Cancel this booking?")) return;
            handleCancel(booking._id);
          }}
        >
          Cancel
        </button>
      ) : (
        <span className="status-cancelled">Cancelled</span>
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
