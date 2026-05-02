import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDestinations } from '../hooks/useApi';
import './Destinations.css';

const Destinations = () => {
  const navigate = useNavigate();
  const { destinations, loading, error } = useDestinations();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.dest-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [destinations]);

  if (loading) return <div className="loading">Loading destinations...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section className="section destinations" id="destinations" ref={sectionRef}>
      <div className="section-header">
        <div className="section-eyebrow">Top Destinations</div>
        <h2 className="section-title">Explore the <strong>World's Finest</strong></h2>
        <p className="section-sub">Handcrafted journeys to the world's most extraordinary places</p>
      </div>
      <div className="dest-grid">
        {destinations.map((destination) => (
          <div 
            className="dest-card" 
            key={destination._id || destination.slug}
            style={{ opacity: '0', transform: 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            <img src={destination.image} alt={destination.name} loading="lazy" />
            <div className="dest-card-overlay"></div>
            <div className="dest-card-info">
              <div className="dest-card-name">{destination.name}</div>
              <div className="dest-card-price">{destination.price}</div>              <button
                type="button"
                className="btn-details"
                onClick={() => navigate(`/destinations/${destination.slug}`)}
              >
                View Details
              </button>            </div>
            <div className="dest-card-arrow">→</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Destinations;
