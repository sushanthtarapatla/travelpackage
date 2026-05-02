import { useEffect, useState } from 'react'
import { createPackage, deletePackage, getPackages, updatePackage } from '../services/api'

const initialForm = {
  name: '',
  slug: '',
  location: '',
  image: '',
  description: '',
  duration: '',
  itinerary: '',
  itineraryImages: '',
  price: '',
  priceValue: '',
  recommendation: ''
}

const ManagePackages = ({ onStatsChange }) => {
  const [packages, setPackages] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const loadPackages = async () => {
    setLoading(true)
    try {
      const response = await getPackages()
      setPackages(response.data || [])
    } catch (error) {
      setMessage('Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPackages()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditingId('')
  }

  const handleEdit = (pkg) => {
    setEditingId(pkg._id)
    setFormData({
      name: pkg.name || '',
      slug: pkg.slug || '',
      location: pkg.location || '',
      image: pkg.image || '',
      description: pkg.description || '',
      duration: pkg.duration || '',
      itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary.join(', ') : '',
      itineraryImages: Array.isArray(pkg.itineraryImages) ? pkg.itineraryImages.join(', ') : '',
      price: pkg.price || '',
      priceValue: pkg.priceValue || '',
      recommendation: pkg.recommendation || ''
    })
    setMessage('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return
    try {
      await deletePackage(id)
      setMessage('Package deleted')
      await loadPackages()
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
        .filter(Boolean),
      itineraryImages: formData.itineraryImages
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }

    try {
      if (editingId) {
        await updatePackage(editingId, payload)
        setMessage('Package updated')
      } else {
        await createPackage(payload)
        setMessage('Package created')
      }
      resetForm()
      await loadPackages()
      if (onStatsChange) onStatsChange()
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Save failed')
    }
  }

  return (
    <div className="admin-card">
      <h3>Manage Packages</h3>
      {message ? <p className="admin-message">{message}</p> : null}

      <form onSubmit={handleSubmit} className="admin-form">
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="slug" placeholder="Slug" value={formData.slug} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
        <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="itinerary"
          placeholder="Itinerary (comma separated)"
          value={formData.itinerary}
          onChange={handleChange}
        />
        <input
          name="itineraryImages"
          placeholder="Itinerary Images (comma separated URLs)"
          value={formData.itineraryImages}
          onChange={handleChange}
        />
        <input
          name="recommendation"
          placeholder="Recommendation label (e.g. Best Seller)"
          value={formData.recommendation}
          onChange={handleChange}
        />
        <input name="price" placeholder="Price text (e.g. ₹20,000)" value={formData.price} onChange={handleChange} required />
        <input
          type="number"
          name="priceValue"
          placeholder="Price value (e.g. 20000)"
          value={formData.priceValue}
          onChange={handleChange}
          required
        />
        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn-primary">
            {editingId ? 'Update Package' : 'Add Package'}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="admin-btn">
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div>
        <h4>Packages List</h4>
        {loading ? <p>Loading...</p> : null}
        {!loading && !packages.length ? <p>No packages available.</p> : null}
        {packages.map((pkg) => (
          <div key={pkg._id} className="admin-list-row">
            <div>
              <strong>{pkg.name}</strong> - {pkg.location} - {pkg.price}
            </div>
            <div className="admin-actions">
              <button type="button" onClick={() => handleEdit(pkg)} className="admin-btn">
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(pkg._id)} className="admin-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManagePackages
