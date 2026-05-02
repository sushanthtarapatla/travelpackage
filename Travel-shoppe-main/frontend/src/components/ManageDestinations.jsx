import { useEffect, useState } from 'react'
import {
  createDestination,
  deleteDestination,
  getDestinations,
  updateDestination
} from '../services/api'

const initialForm = {
  name: '',
  slug: '',
  image: '',
  price: '',
  priceValue: '',
  duration: '',
  itinerary: ''
}

const ManageDestinations = ({ onStatsChange }) => {
  const [destinations, setDestinations] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const loadDestinations = async () => {
    setLoading(true)
    try {
      const response = await getDestinations()
      setDestinations(response.data || [])
    } catch (error) {
      setMessage('Failed to load destinations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDestinations()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditingId('')
  }

  const handleEdit = (destination) => {
    setEditingId(destination._id)
    setFormData({
      name: destination.name || '',
      slug: destination.slug || '',
      image: destination.image || '',
      price: destination.price || '',
      priceValue: destination.priceValue || '',
      duration: destination.duration || '',
      itinerary: Array.isArray(destination.itinerary) ? destination.itinerary.join(', ') : ''
    })
    setMessage('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return
    try {
      await deleteDestination(id)
      setMessage('Destination deleted')
      await loadDestinations()
      if (onStatsChange) onStatsChange()
    } catch (error) {
      setMessage('Delete failed')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    const payload = {
      ...formData,
      priceValue: Number(formData.priceValue),
      itinerary: formData.itinerary
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }

    try {
      if (editingId) {
        await updateDestination(editingId, payload)
        setMessage('Destination updated')
      } else {
        await createDestination(payload)
        setMessage('Destination created')
      }
      resetForm()
      await loadDestinations()
      if (onStatsChange) onStatsChange()
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Save failed')
    }
  }

  return (
    <div className="admin-card">
      <h3>Manage Destinations</h3>
      {message ? <p className="admin-message">{message}</p> : null}

      <form onSubmit={handleSubmit} className="admin-form">
        <input name="name" placeholder="Destination Name" value={formData.name} onChange={handleChange} required />
        <input name="slug" placeholder="Slug" value={formData.slug} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
        <input name="price" placeholder="Price text (e.g. From ₹95,000)" value={formData.price} onChange={handleChange} required />
        <input name="duration" placeholder="Duration (e.g. 5 Days / 4 Nights)" value={formData.duration} onChange={handleChange} />
        <input
          name="itinerary"
          placeholder="Itinerary (comma separated day-wise)"
          value={formData.itinerary}
          onChange={handleChange}
        />
        <input
          type="number"
          name="priceValue"
          placeholder="Price value (e.g. 95000)"
          value={formData.priceValue}
          onChange={handleChange}
          required
        />
        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn-primary">
            {editingId ? 'Update Destination' : 'Add Destination'}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="admin-btn">
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div>
        <h4>Destination List</h4>
        {loading ? <p>Loading...</p> : null}
        {!loading && !destinations.length ? <p>No destinations available.</p> : null}
        {destinations.map((destination) => (
          <div key={destination._id} className="admin-list-row">
            <div>
              <strong>{destination.name}</strong> - {destination.price}
            </div>
            <div className="admin-actions">
              <button type="button" onClick={() => handleEdit(destination)} className="admin-btn">
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(destination._id)} className="admin-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageDestinations
