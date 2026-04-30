import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePackages } from '../hooks/useApi';
import './PackagesAnimated.css';

gsap.registerPlugin(ScrollTrigger);

const PackagesAnimated = () => {
  const { packages, loading, error } = usePackages();
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!packages.length) return;

    const ctx = gsap.context(() => {
      // Header 3D reveal
      gsap.fromTo(headerRef.current?.querySelectorAll('.animate-header'),
        { opacity: 0, y: 50, rotateX: 15 },
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

      // 3D Card stack entrance
      const cards = gridRef.current?.querySelectorAll('.pkg-card-3d');
      if (cards && cards.length >= 3) {
        // Featured (middle) card comes forward
        gsap.fromTo(cards[1],
          { 
            opacity: 0, 
            z: -100,
            scale: 0.9,
            y: 50
          },
          {
            opacity: 1,
            z: 50,
            scale: 1.05,
            y: 0,
            duration: 1.2,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Side cards angle in
        gsap.fromTo(cards[0],
          { opacity: 0, x: -80, rotateY: 25 },
          {
            opacity: 1,
            x: 0,
            rotateY: -8,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        gsap.fromTo(cards[2],
          { opacity: 0, x: 80, rotateY: -25 },
          {
            opacity: 1,
            x: 0,
            rotateY: 8,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Hover effects
        cards.forEach((card, index) => {
          const isFeatured = index === 1;
          const image = card.querySelector('.pkg-img img');
          const tag = card.querySelector('.pkg-tag');
          const price = card.querySelector('.pkg-price');

          card.addEventListener('mouseenter', () => {
            // Card lifts and centers
            gsap.to(card, {
              z: 80,
              scale: isFeatured ? 1.08 : 1.05,
              rotateY: 0,
              duration: 0.5,
              ease: 'power2.out'
            });

            // Others recede
            cards.forEach((otherCard, otherIndex) => {
              if (otherIndex !== index) {
                gsap.to(otherCard, {
                  opacity: 0.7,
                  scale: 0.95,
                  filter: 'blur(2px)',
                  duration: 0.4
                });
              }
            });

            // Image zoom
            gsap.to(image, {
              scale: 1.2,
              duration: 0.6,
              ease: 'power2.out'
            });

            // Tag wiggle
            if (tag) {
              gsap.to(tag, {
                rotation: 3,
                duration: 0.2,
                yoyo: true,
                repeat: 3
              });
            }

            // Price pulse
            gsap.to(price, {
              scale: 1.1,
              color: '#E8C97A',
              duration: 0.3,
              yoyo: true,
              repeat: 1
            });
          });

          card.addEventListener('mouseleave', () => {
            // Reset card
            gsap.to(card, {
              z: isFeatured ? 50 : 0,
              scale: isFeatured ? 1.05 : 1,
              rotateY: index === 0 ? -8 : index === 2 ? 8 : 0,
              duration: 0.5,
              ease: 'power2.out'
            });

            // Reset others
            cards.forEach((otherCard, otherIndex) => {
              if (otherIndex !== index) {
                gsap.to(otherCard, {
                  opacity: 1,
                  scale: otherIndex === 1 ? 1.05 : 1,
                  filter: 'blur(0px)',
                  duration: 0.4
                });
              }
            });

            // Reset image
            gsap.to(image, {
              scale: 1,
              duration: 0.6,
              ease: 'power2.out'
            });
          });

          // Mouse move parallax
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            gsap.to(image, {
              x: -x * 20,
              y: -y * 20,
              duration: 0.4,
              ease: 'power2.out'
            });
          });
        });

        // Ambient floating
        cards.forEach((card, index) => {
          gsap.to(card, {
            y: -8,
            duration: 2 + index * 0.3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: index * 0.5
          });
        });
      }

      // Tag wiggle animation for featured
      gsap.to('.pkg-tag', {
        rotation: 2,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [packages]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Curating experiences...</p>
    </div>
  );
  
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section className="packages-section" id="packages" ref={sectionRef}>
      <div className="section-header" ref={headerRef}>
        <div className="section-eyebrow animate-header">Curated Packages</div>
        <h2 className="section-title animate-header">Signature <strong>Travel Experiences</strong></h2>
        <p className="section-sub animate-header">Choose from our most-loved luxury packages</p>
      </div>
      
      <div className="packages-grid-3d" ref={gridRef}>
        {packages.map((pkg, index) => (
          <div 
            className={`pkg-card-3d ${pkg.featured ? 'featured-pkg' : ''}`}
            key={pkg._id || pkg.slug}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="pkg-img">
              <img src={pkg.image} alt={pkg.name} loading="lazy" />
              {pkg.tag && <div className="pkg-tag">{pkg.tag}</div>}
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
                <a href="#contact" className="btn-gold magnetic-btn">Book Now</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PackagesAnimated;
