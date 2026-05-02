import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackages } from '../hooks/useApi';
import { itineraries } from '../data/itineraries';
import './Packages.css';

const Packages = () => {
  const navigate = useNavigate();
  const { packages, loading, error } = usePackages();
  const sectionRef = useRef(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const itineraryMap = useMemo(() => {
    return itineraries.reduce((acc, item) => {
      acc[item.name.toLowerCase()] = item;
      return acc;
    }, {});
  }, []);

  const handleBookNowClick = (destination) => {
    window.dispatchEvent(
      new CustomEvent('prefill-booking-destination', {
        detail: { destination }
      })
    );
  };

  const handleViewItinerary = (pkg) => {
    const destinationName = pkg.location || '';
    const fallback = itineraryMap[destinationName.toLowerCase()];
    const selected = {
      name: destinationName,
      duration: pkg.duration || fallback?.duration || '',
      itinerary:
        Array.isArray(pkg.itinerary) && pkg.itinerary.length
          ? pkg.itinerary
          : fallback?.itinerary || []
    };
    setSelectedItinerary(selected);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.pkg-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 150);
          });
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [packages]);

  if (loading) return <div className="loading">Loading packages...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!packages?.length) {
    return (
      <section className="packages-section" id="packages" ref={sectionRef}>
        <div className="section-header">
          <div className="section-eyebrow">Curated Packages</div>
          <h2 className="section-title">Signature <strong>Travel Experiences</strong></h2>
          <p className="section-sub">Trips will appear here once packages are added.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="packages-section" id="packages" ref={sectionRef}>
      <div className="section-header">
        <div className="section-eyebrow">Curated Packages</div>
        <h2 className="section-title">Signature <strong>Travel Experiences</strong></h2>
        <p className="section-sub">Choose from our most-loved luxury packages</p>
      </div>
      <div className="packages-grid">
        {packages.map((pkg) => (
          <div 
            className={`pkg-card ${pkg.featured ? 'featured-pkg' : ''}`}
            key={pkg._id || pkg.slug}
            style={{ opacity: '0', transform: 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            <div className="pkg-img">
              <img src={pkg.image} alt={pkg.name} loading="lazy" />
              {(pkg.tag || pkg.recommendation) && <div className="pkg-tag">{pkg.tag || pkg.recommendation}</div>}
            </div>
            <div className="pkg-body">
              <div className="pkg-location">{pkg.location}</div>
              <div className="pkg-name">{pkg.name}</div>
              <p className="pkg-desc">{pkg.description}</p>
              <div className="pkg-meta">
                {pkg.duration && (
                  <div className="pkg-meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    {pkg.duration}
                  </div>
                )}
                {pkg.guests && (
                  <div className="pkg-meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    {pkg.guests}
                  </div>
                )}
                {pkg.inclusions?.map((inc, idx) => (
                  <div className="pkg-meta-item" key={idx}>✈ {inc}</div>
                ))}
              </div>
              <div className="pkg-footer">
                <div>
                  <div className="pkg-price-label">Starting from</div>
                  <div className="pkg-price"><span>₹</span>{pkg.priceValue?.toLocaleString()}</div>
                </div>
                <div className="pkg-actions">
                  <button
                    type="button"
                    className="btn-outline itinerary-btn"
                    onClick={() => handleViewItinerary(pkg)}
                  >
                    View Itinerary
                  </button>
                  <button
                    type="button"
                    className="btn-outline btn-details"
                    onClick={() => navigate(`/packages/${pkg.slug}`)}
                  >
                    View Details
                  </button>
                  <a
                    href="#contact"
                    className="btn-gold"
                    onClick={() => handleBookNowClick(pkg.location)}
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedItinerary ? (
        <div className="itinerary-modal-overlay" onClick={() => setSelectedItinerary(null)}>
          <div className="itinerary-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="itinerary-close"
              onClick={() => setSelectedItinerary(null)}
            >
              x
            </button>
            <h3>{selectedItinerary.name}</h3>
            <p className="itinerary-duration">{selectedItinerary.duration}</p>
            <ul className="itinerary-list">
              {selectedItinerary.itinerary.map((dayPlan, idx) => (
                <li key={`${selectedItinerary.name}-${idx}`}>{dayPlan}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Packages;
