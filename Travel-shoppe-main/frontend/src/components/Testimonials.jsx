import { useEffect, useRef } from 'react';
import { useTestimonials } from '../hooks/useApi';
import './Testimonials.css';

const Testimonials = () => {
  const { testimonials, loading, error } = useTestimonials();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.testi-card');
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
  }, [testimonials]);

  if (loading) return <div className="loading">Loading testimonials...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section className="testimonials-section" ref={sectionRef}>
      <div className="section-header">
        <div className="section-eyebrow">Traveler Stories</div>
        <h2 className="section-title">Words from <strong>Our Explorers</strong></h2>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div 
            className="testi-card" 
            key={testimonial._id || index}
            style={{ opacity: '0', transform: 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            <div className="testi-stars">{'★'.repeat(testimonial.rating || 5)}</div>
            <div className="testi-quote">"{testimonial.quote}"</div>
            <div className="testi-author">
              <div className="testi-avatar">
                <img src={testimonial.avatar} alt={testimonial.name} />
              </div>
              <div>
                <div className="testi-name">{testimonial.name}</div>
                <div className="testi-trip">{testimonial.trip}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
