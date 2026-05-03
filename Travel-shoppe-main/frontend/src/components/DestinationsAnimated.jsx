import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDestinations, usePackages } from '../hooks/useApi';
import { itineraries } from '../data/itineraries';
import RecommendationBadges from './RecommendationBadges';
import './Destinations.css';

gsap.registerPlugin(ScrollTrigger);

const DestinationsAnimated = () => {
  const { destinations, loading, error } = useDestinations();
  const { packages } = usePackages();
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const headerRef = useRef(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const fallbackItineraryMap = useMemo(() => {
    return itineraries.reduce((acc, item) => {
      acc[item.name.toLowerCase()] = item;
      return acc;
    }, {});
  }, []);

  const packageByLocation = useMemo(() => {
    return (packages || []).reduce((acc, item) => {
      const key = (item.location || '').toLowerCase();
      if (key && !acc[key]) acc[key] = item;
      return acc;
    }, {});
  }, [packages]);

  const destinationByName = useMemo(() => {
    return (destinations || []).reduce((acc, item) => {
      const key = (item.name || '').toLowerCase();
      if (key) acc[key] = item;
      return acc;
    }, {});
  }, [destinations]);

  const handleOpenItinerary = (destinationName) => {
    const key = (destinationName || '').toLowerCase();
    const destinationData = destinationByName[key];
    const packageData = packageByLocation[key];
    const fallback = fallbackItineraryMap[key];
    setSelectedItinerary({
      name: destinationName,
      duration: destinationData?.duration || packageData?.duration || fallback?.duration || '',
      itinerary:
        Array.isArray(destinationData?.itinerary) && destinationData.itinerary.length
          ? destinationData.itinerary
          : Array.isArray(packageData?.itinerary) && packageData.itinerary.length
          ? packageData.itinerary
          : fallback?.itinerary || []
    });
  };

  const navigate = useNavigate();

  const handleBookNowClick = (destination) => {
    window.dispatchEvent(
      new CustomEvent('open-booking-modal', {
        detail: { destination }
      })
    );
  };

  const handleViewDetails = (slug) => {
    navigate(`/destinations/${slug}`)
  }

  useEffect(() => {
    if (!destinations.length) return;

    const ctx = gsap.context(() => {
      // Header 3D reveal
      gsap.fromTo(headerRef.current?.querySelectorAll('.animate-header'),
        { opacity: 0, y: 60, rotateX: 20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 3D Card entrance with perspective
      const cards = gridRef.current?.querySelectorAll('.dest-card-3d');
      if (cards) {
        // Split into two rows for different animation directions
        const row1 = Array.from(cards).slice(0, 4);
        const row2 = Array.from(cards).slice(4, 8);

        // Row 1: From left with rotation
        gsap.fromTo(row1,
          { 
            opacity: 0, 
            x: -100,
            rotateY: -45,
            transformPerspective: 2000
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Row 2: From right with rotation
        gsap.fromTo(row2,
          { 
            opacity: 0, 
            x: 100,
            rotateY: 45,
            transformPerspective: 2000
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Hover effects for each card
        cards.forEach((card) => {
          const image = card.querySelector('.card-image');
          const overlay = card.querySelector('.dest-card-overlay');
          const info = card.querySelector('.dest-card-info');
          const arrow = card.querySelector('.dest-card-arrow');

          // Mouse enter - 3D lift
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              rotateX: 5,
              rotateY: 0,
              z: 50,
              scale: 1.03,
              boxShadow: '0 25px 50px rgba(201,168,76,0.15)',
              duration: 0.5,
              ease: 'power2.out'
            });
            gsap.to(image, {
              scale: 1.15,
              duration: 0.6,
              ease: 'power2.out'
            });
            gsap.to(overlay, {
              background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.1) 100%)',
              duration: 0.3
            });
            gsap.to(info, {
              y: -5,
              duration: 0.4,
              ease: 'power2.out'
            });
            gsap.to(arrow, {
              x: 5,
              rotate: 0,
              scale: 1.2,
              duration: 0.3,
              ease: 'back.out(2)'
            });
          });

          // Mouse leave - return to normal
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              z: 0,
              scale: 1,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              duration: 0.5,
              ease: 'power2.out'
            });
            gsap.to(image, {
              scale: 1,
              duration: 0.6,
              ease: 'power2.out'
            });
            gsap.to(overlay, {
              background: '',
              duration: 0.3
            });
            gsap.to(info, {
              y: 0,
              duration: 0.4,
              ease: 'power2.out'
            });
            gsap.to(arrow, {
              x: 0,
              rotate: 0,
              scale: 1,
              duration: 0.3
            });
          });

          // Mouse move parallax (looking through window effect)
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            gsap.to(image, {
              x: -x * 15,
              y: -y * 15,
              duration: 0.4,
              ease: 'power2.out'
            });
          });
        });
      }

      // Ambient floating animation for cards
      gsap.to('.dest-card-3d', {
        y: -5,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.3,
          from: 'start'
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [destinations]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Curating destinations...</p>
    </div>
  );
  
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section className="section destinations" id="destinations" ref={sectionRef}>
      <div className="section-header" ref={headerRef}>
        <div className="section-eyebrow animate-header">Top Destinations</div>
        <h2 className="section-title animate-header">Explore the <strong>World's Finest</strong></h2>
        <p className="section-sub animate-header">Handcrafted journeys to the world's most extraordinary places</p>
      </div>
      
      <div className="dest-grid-3d" ref={gridRef}>
        {destinations.map((destination, index) => (
          <div 
            className="dest-card-3d card-3d" 
            key={destination._id || destination.slug}
            style={{ 
              transformStyle: 'preserve-3d',
              transformPerspective: '2000px'
            }}
          >
            <div className="card-image-wrapper">
              <img 
                className="card-image"
                src={destination.image} 
                alt={destination.name} 
                loading="lazy" 
              />
              <RecommendationBadges item={destination} />
            </div>
            <div className="dest-card-overlay"></div>
            <div className="dest-card-info">
              <div className="dest-card-name">{destination.name}</div>
            </div>
            <div className="dest-card-actions">
              <button
                type="button"
                className="dest-card-arrow"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenItinerary(destination.name);
                }}
              >
                →
              </button>
              <button
                type="button"
                className="btn-outline dest-card-detail"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(destination.slug)
                }}
              >
                Details
              </button>
              <button
                type="button"
                className="dest-card-book"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookNowClick(destination.name);
                }}
              >
                Book
              </button>
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
            <button
              type="button"
              className="btn-gold"
              style={{ marginTop: '12px' }}
              onClick={() => handleBookNowClick(selectedItinerary.name)}
            >
              Book This Trip
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default DestinationsAnimated;
