import { useState } from 'react';
import { submitContact } from '../services/api';
import './CTA.css';

const CTA = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await submitContact(formData);
      setSubmitMessage(response.message);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitMessage('Error submitting form. Please try again.');
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
        <p>Tell us where you want to go, and our expert travel designers will craft a bespoke experience just for you. No cookie-cutter packages — only pure, personalised luxury.</p>
        
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
          />
          <textarea
            name="message"
            placeholder="Tell us about your dream trip..."
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <div className="cta-actions">
            <a href="tel:+919876543210" className="btn-outline">
              Call +91 81421 89138
            </a>
            <button type="submit" className="btn-gold" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CTA;
