import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPackage } from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'
import './PackageDetail.css'

const PackageDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [packageItem, setPackageItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPackage = async () => {
      try {
        const response = await getPackage(slug)
        setPackageItem(response.data)
      } catch (err) {
        setError(err.message || 'Package not found')
      } finally {
        setLoading(false)
      }
    }
    loadPackage()
  }, [slug])

  const openBooking = () => {
    if (!packageItem) return
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: { destination: packageItem.location }
      })
    )
  }

  if (loading) {
    return (
      <div className="detail-page">
        <p>Loading package...</p>
      </div>
    )
  }

  if (error || !packageItem) {
    return (
      <div className="detail-page">
        <p>Error: {error || 'Package not found'}</p>
        <button className="btn-outline" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <Navbar />
      <main className="detail-container">
        <div className="detail-hero">
          <img src={packageItem.image} alt={packageItem.name} />
          <div className="detail-hero-copy">
            <div className="detail-tags">
              {(packageItem.recommendation || packageItem.tag) && (
                <span className="badge">{packageItem.recommendation || packageItem.tag}</span>
              )}
            </div>
            <h1>{packageItem.name}</h1>
            <p className="detail-subtitle">{packageItem.location}</p>
            <div className="detail-meta">
              {packageItem.duration && <span>{packageItem.duration}</span>}
              {packageItem.guests && <span>{packageItem.guests} guests</span>}
            </div>
            <p className="detail-description">{packageItem.description}</p>
            <div className="detail-actions">
              <button className="btn-gold" onClick={openBooking}>
                Book Now
              </button>
              <button className="btn-outline" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </div>
        </div>

        <section className="detail-content">
          <div className="detail-block">
            <h2>Itinerary</h2>
            {Array.isArray(packageItem.itinerary) && packageItem.itinerary.length ? (
              <div className="itinerary-list">
                {packageItem.itinerary.map((item, idx) => (
                  <div key={idx} className="itinerary-card">
                    <div className="itinerary-day">Day {idx + 1}</div>
                    {packageItem.itineraryImages && packageItem.itineraryImages[idx] && (
                      <img 
                        src={packageItem.itineraryImages[idx]} 
                        alt={`Day ${idx + 1}`} 
                        className="itinerary-image"
                      />
                    )}
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No itinerary details available yet.</p>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </div>
  )
}

export default PackageDetail
