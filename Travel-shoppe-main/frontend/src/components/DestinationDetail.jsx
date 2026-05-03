import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDestination } from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'
import './DestinationDetail.css'

const DestinationDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDestination = async () => {
      try {
        const response = await getDestination(slug)
        setDestination(response.data)
      } catch (err) {
        setError(err.message || 'Destination not found')
      } finally {
        setLoading(false)
      }
    }
    loadDestination()
  }, [slug])

  const openBooking = () => {
    if (!destination) return
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: { destination: destination.name }
      })
    )
  }

  if (loading) {
    return (
      <div className="detail-page">
        <p>Loading destination...</p>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="detail-page">
        <p>Error: {error || 'Destination not found'}</p>
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
          <img src={destination.image} alt={destination.name} />
          <div className="detail-hero-copy">
          <div className="detail-tags">
            {((destination.recommendationTags && destination.recommendationTags.length)
              ? destination.recommendationTags
              : [destination.recommendation].filter(Boolean)
            ).map((tag, idx) => (
              <span key={idx} className="badge">{tag}</span>
            ))}
          </div>
          <h1>{destination.name}</h1>
          {destination.duration && <p className="detail-duration">{destination.duration}</p>}
          <p className="detail-description">{destination.description}</p>
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
          {Array.isArray(destination.itinerary) && destination.itinerary.length ? (
            <div className="itinerary-list">
              {destination.itinerary.map((item, idx) => (
                <div key={idx} className="itinerary-card">
                  <div className="itinerary-day">Day {idx + 1}</div>
                  {destination.itineraryImages && destination.itineraryImages[idx] && (
                    <img 
                      src={destination.itineraryImages[idx]} 
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

export default DestinationDetail
