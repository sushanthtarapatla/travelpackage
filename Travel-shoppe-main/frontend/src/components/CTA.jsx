import { useEffect, useState } from 'react';
import { createBooking } from '../services/api';
import './CTA.css';

const CTA = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelDate: '',
    people: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const handlePrefillDestination = (event) => {
      setFormData((prev) => ({
        ...prev,
        destination: event.detail?.destination || prev.destination
      }));
    };

    window.addEventListener('prefill-booking-destination', handlePrefillDestination);
    return () => window.removeEventListener('prefill-booking-destination', handlePrefillDestination);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'people' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');
    
    try {
      await createBooking(formData);
      setSubmitMessage('Booking created successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelDate: '',
        people: 1
      });
    } catch (error) {
      setSubmitMessage(error?.response?.data?.message || 'Error submitting booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="cta-section" id="contact">
      <video 
        className="cta-video" 
        autoPlay 
        muted 
        loop 
        playsInline
        poster="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=70"
      >
        <source src="https://videos.pexels.com/video-files/4782931/4782931-hd_1920_1080_25fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>
      <div className="cta-overlay"></div>
      <div className="cta-content">
        <div className="section-eyebrow">Ready to Explore?</div>
        <h2 className="section-title">Let's Plan Your <strong>Dream Journey</strong></h2>
        <p>Book your trip in a few steps. Our team will contact you with final confirmation and trip details.</p>
        
        {submitMessage && (
          <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
            {submitMessage}
          </div>
        )}

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <div className="form-row">
            <input
              type="text"
              name="destination"
              placeholder="Destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="number"
            name="people"
            placeholder="Number of People"
            min="1"
            value={formData.people}
            onChange={handleChange}
            required
          />
          <div className="cta-actions">
            <a href="tel:+919876543210" className="btn-outline">
              Call +91 81421 89138
            </a>
            <button type="submit" className="btn-gold" disabled={submitting}>
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CTA;
