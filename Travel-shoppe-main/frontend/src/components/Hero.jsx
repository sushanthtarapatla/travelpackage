import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  // Refs for animations
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const video = document.getElementById('heroVideo');
    if (video) {
      video.addEventListener('canplay', () => setVideoLoaded(true));
      const timer = setTimeout(() => setVideoLoaded(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Master entrance timeline
      const masterTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Video entrance with scale
      masterTl.fromTo(videoRef.current,
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.inOut' }
      );

      // Overlay fade
      masterTl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        '-=1.5'
      );

      // 3D Content reveal from depth
      const animateItems = contentRef.current?.querySelectorAll('.animate-item');
      if (animateItems) {
        masterTl.fromTo(animateItems,
          { 
            opacity: 0, 
            y: 80,
            rotateX: 25
          },
          { 
            opacity: 1, 
            y: 0,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'back.out(1.2)'
          },
          '-=1'
        );
      }

      // Social icons slide in
      masterTl.fromTo('.hero-social a',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.8'
      );

      // Slide numbers
      masterTl.fromTo('.hero-slide-num',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        '-=0.5'
      );

      // Scroll cue bounce in
      masterTl.fromTo('.scroll-cue',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)' },
        '-=0.3'
      );

      // Video button
      masterTl.fromTo('.video-btn',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
        '-=0.6'
      );

      // Scroll-triggered exit animation
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '60% top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(contentRef.current, {
            opacity: 1 - (progress * 1.5),
            y: -100 * progress,
            filter: `blur(${8 * progress}px)`,
            duration: 0.1
          });
          gsap.to(videoRef.current, {
            scale: 1 + (0.15 * progress),
            y: 50 * progress,
            duration: 0.1
          });
        }
      });

      // Ambient floating for video button
      gsap.to('.video-btn', {
        y: -8,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });

      // Scroll cue line animation
      gsap.to('.scroll-cue-line', {
        scaleY: 1.2,
        transformOrigin: 'top',
        duration: 1.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const openVideoModal = (e) => {
    e.preventDefault();
    setVideoModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      {/* Video Modal */}
      {videoModalOpen && (
        <div 
          className="video-modal" 
          onClick={(e) => e.target === e.currentTarget && closeVideoModal()}
        >
          <button className="video-modal-close" onClick={closeVideoModal}>✕</button>
          <div className="video-modal-content">
            <iframe
              src="https://www.youtube.com/embed/oHkZFQjIBZs?autoplay=1&rel=0"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay;encrypted-media;fullscreen"
              allowFullScreen
              title="Travel Video"
            ></iframe>
          </div>
        </div>
      )}

      <section className="hero" id="home" ref={heroRef}>
        <div className="hero-bg" ref={videoRef}>
          <div className="hero-bg-fallback"></div>
          <video
            id="heroVideo"
            className={`hero-video ${videoLoaded ? 'loaded' : ''}`}
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1439130490301-25e322d88054?w=1800&q=80"
          >
            <source src="https://videos.pexels.com/video-files/1739010/1739010-hd_1920_1080_24fps.mp4" type="video/mp4" />
            <source src="https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-overlay" ref={overlayRef}></div>

        {/* Floating Particles */}
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 8}s`
              }}
            />
          ))}
        </div>

        {/* Social */}
        <div className="hero-social">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="LinkedIn">in</a>
          <a href="#" aria-label="YouTube">▶</a>
        </div>

        <div className="hero-content" ref={contentRef}>
          <div className="hero-eyebrow animate-item">Discover the World</div>
          <h1 className="animate-item">
            <span className="title-line">Crafting Journeys</span>
            <em className="title-italic">Beyond Destinations</em>
          </h1>
          <p className="hero-sub animate-item">
            Luxury travel curated for the discerning explorer. Extraordinary places. Unforgettable experiences.
          </p>
          <div className="hero-actions animate-item">
            <a href="#destinations" className="btn-outline magnetic-btn">
              Explore Journeys
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#packages" className="btn-gold magnetic-btn">View Packages</a>
          </div>
        </div>

        {/* Slide numbers */}
        <div className="hero-slides">
          <div className="hero-slide-num active">01</div>
          <div className="hero-slide-divider"></div>
          <div className="hero-slide-num">02</div>
          <div className="hero-slide-divider"></div>
          <div className="hero-slide-num">03</div>
          <div className="hero-slide-divider"></div>
          <div className="hero-slide-num">04</div>
        </div>

        {/* Scroll cue */}
        <div className="scroll-cue">
          <div className="scroll-cue-line"></div>
          <span>Scroll to Explore</span>
        </div>

        {/* Video button */}
        <a href="#" className="video-btn" onClick={openVideoModal}>
          <div className="video-btn-circle">▶</div>
          <div className="video-btn-text">
            <span>Watch</span>
            <span>Full Video</span>
          </div>
        </a>
      </section>
    </>
  );
};

export default Hero;
