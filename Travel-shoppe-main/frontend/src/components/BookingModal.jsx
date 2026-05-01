import { useEffect, useState } from 'react'
import { createBooking } from '../services/api'
import './BookingModal.css'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  destination: '',
  travelDate: '',
  people: 1
}

const BookingModal = () => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleOpenBooking = (event) => {
      const destination = event.detail?.destination || ''
      setFormData((prev) => ({ ...initialForm, destination }))
      setMessage('')
      setOpen(true)
    }

    window.addEventListener('open-booking-modal', handleOpenBooking)
    return () => window.removeEventListener('open-booking-modal', handleOpenBooking)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const updatePeople = (delta) => {
    setFormData((prev) => {
      const next = Math.max(1, Number(prev.people || 1) + delta)
      return { ...prev, people: next }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      await createBooking({ ...formData, people: Number(formData.people) })
      setMessage('Booking confirmed successfully.')
      setFormData(initialForm)
      setTimeout(() => setOpen(false), 900)
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to create booking.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="booking-modal-overlay" onClick={() => setOpen(false)}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="booking-close" onClick={() => setOpen(false)}>
          x
        </button>
        <h3>Book Your Trip</h3>
        {message ? <p className="booking-message">{message}</p> : null}

        <form className="booking-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            required
          />
          <div className="people-stepper">
            <label>Number of People</label>
            <div>
              <button type="button" onClick={() => updatePeople(-1)}>
                -
              </button>
              <span>{formData.people}</span>
              <button type="button" onClick={() => updatePeople(1)}>
                +
              </button>
            </div>
          </div>
          <button type="submit" className="btn-gold" disabled={submitting}>
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
