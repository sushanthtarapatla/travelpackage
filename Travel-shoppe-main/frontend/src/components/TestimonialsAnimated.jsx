import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTestimonials } from '../hooks/useApi';
import './TestimonialsAnimated.css';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsAnimated = () => {
  const { testimonials, loading, error } = useTestimonials();
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!testimonials.length) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo('.testimonials-header',
        { opacity: 0, y: 50, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Cards 3D entrance with coverflow
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        const offset = index - 1; // -1, 0, 1
        
        gsap.fromTo(card,
          { 
            opacity: 0, 
            rotateY: offset * 45,
            x: offset * 100,
            z: -200,
            scale: 0.8
          },
          {
            opacity: 1,
            rotateY: offset * 25,
            x: offset * 50,
            z: Math.abs(offset) * -50,
            scale: offset === 0 ? 1 : 0.9,
            duration: 1.2,
            delay: index * 0.15,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [testimonials]);

  // Handle card click
  const handleCardClick = (index) => {
    setActiveIndex(index);
    
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - index;
      const isActive = i === index;
      
      gsap.to(card, {
        rotateY: offset * 25,
        x: offset * 50,
        z: isActive ? 50 : Math.abs(offset) * -50,
        scale: isActive ? 1 : 0.9,
        opacity: Math.abs(offset) > 1 ? 0.3 : 1,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
  };

  if (loading) return <div className="loading">Loading testimonials...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section className="testimonials-section-3d" ref={sectionRef}>
      <div className="section-header testimonials-header">
        <div className="section-eyebrow">Traveler Stories</div>
        <h2 className="section-title">Words from <strong>Our Explorers</strong></h2>
      </div>
      
      <div className="testimonials-coverflow">
        {testimonials.map((testimonial, index) => (
          <div 
            className={`testi-card-3d ${index === activeIndex ? 'active' : ''}`}
            key={testimonial._id || index}
            ref={el => cardsRef.current[index] = el}
            onClick={() => handleCardClick(index)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Decorative quote */}
            <div className="testi-quote-mark">"</div>
            
            <div className="testi-stars">
              {'★'.repeat(testimonial.rating || 5)}
            </div>
            
            <div className="testi-quote">{testimonial.quote}</div>
            
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
      
      {/* Navigation dots */}
      <div className="testi-nav">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`testi-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsAnimated;
