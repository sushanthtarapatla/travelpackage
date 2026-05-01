import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { submitContact } from '../services/api';
import './CTAAnimated.css';

gsap.registerPlugin(ScrollTrigger);

const CTAAnimated = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const formRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax video background
      gsap.to(videoRef.current, {
        y: () => 100,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Content reveal
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          // Header 3D reveal
          gsap.fromTo('.cta-animate',
            { opacity: 0, y: 60, rotateX: 20 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 1,
              stagger: 0.15,
              ease: 'power3.out'
            }
          );

          // Form fields 3D flip entrance
          gsap.fromTo('.form-field-3d',
            { opacity: 0, rotateX: -45, y: 30, transformPerspective: 1000 },
            {
              opacity: 1,
              rotateX: 0,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              delay: 0.5,
              ease: 'back.out(1.2)'
            }
          );

          // Buttons elastic bounce
          gsap.fromTo('.cta-btn-animate',
            { opacity: 0, scale: 0, y: 20 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              delay: 1,
              ease: 'elastic.out(1, 0.5)'
            }
          );
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic button effect
  const useMagneticButton = (ref) => {
    useEffect(() => {
      const button = ref.current;
      if (!button) return;

      const handleMouseMove = (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(button, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
      };

      const handleMouseLeave = () => {
        gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      };

      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [ref]);
  };

  const submitBtnRef = useRef(null);
  useMagneticButton(submitBtnRef);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');
    
    // Button press animation
    gsap.to(submitBtnRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
    
    try {
      const response = await submitContact(formData);
      setSubmitMessage(response.message);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Success animation
      gsap.fromTo('.submit-message',
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
    } catch (error) {
      console.error('Contact form error:', error?.response?.data || error.message || error);
      const errMsg = error?.response?.data?.message || 'Error submitting form. Please try again.';
      setSubmitMessage(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="cta-section-3d" id="contact" ref={sectionRef}>
      <video 
        className="cta-video-3d" 
        ref={videoRef}
        autoPlay 
        muted 
        loop 
        playsInline
        poster="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=70"
      >
        <source src="https://videos.pexels.com/video-files/4782931/4782931-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>
      <div className="cta-overlay-3d"></div>
      
      <div className="cta-content-3d" ref={contentRef}>
        <div className="section-eyebrow cta-animate">Ready to Explore?</div>
        <h2 className="section-title cta-animate">Let's Plan Your <strong>Dream Journey</strong></h2>
        <p className="cta-animate">Tell us where you want to go, and our expert travel designers will craft a bespoke experience just for you. No cookie-cutter packages — only pure, personalised luxury.</p>
        
        {submitMessage && (
          <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
            {submitMessage}
          </div>
        )}

        <form className="contact-form-3d" ref={formRef} onSubmit={handleSubmit}>
          <div className="form-row-3d">
            <div className="form-field-3d">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field-3d">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-field-3d">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-field-3d">
            <textarea
              name="message"
              placeholder="Tell us about your dream trip..."
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="cta-actions-3d">
            <a href="tel:+919876543210" className="btn-outline cta-btn-animate">
              Call +91 81421 89138
            </a>
            <button 
              type="submit" 
              className="btn-gold magnetic-btn cta-btn-animate" 
              disabled={submitting}
              ref={submitBtnRef}
            >
              {submitting ? 'Sending...' : 'Send Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CTAAnimated;