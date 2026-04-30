import './Footer.css';

const Footer = () => {
  const destinations = [
    'Maldives', 'Greece', 'Switzerland', 'Dubai', 'Bali', 'Japan'
  ];

  const experiences = [
    'Honeymoon', 'Family Holidays', 'Adventure', 'Cultural Tours', 'Luxury Getaways', 'Business Travel'
  ];

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="#home" className="nav-logo footer-logo">
            <div className="nav-logo-icon"></div>
            <div className="nav-logo-text">
              <span>Travel</span>
              <span>Luxury Travel Experiences</span>
            </div>
          </a>
          <p>We craft extraordinary journeys for the discerning traveler. From intimate island escapes to grand European adventures — every trip is a masterpiece.</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="YouTube">▶</a>
            <a href="#" aria-label="Instagram">✦</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Destinations</h4>
          <ul>
            {destinations.map((dest, index) => (
              <li key={index}><a href="#destinations">{dest}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Experiences</h4>
          <ul>
            {experiences.map((exp, index) => (
              <li key={index}><a href="#experiences">{exp}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul>
            <li><a href="tel:+919876543210">+91 81421 89138</a></li>
            <li><a href="mailto:hello@travelshoppe.in">hello@travelshoppe.in</a></li>
            <li><a href="#">Hyderabad, India</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Travel. All rights reserved. Crafted with passion for luxury travel.</p>
        <p className="footer-tagline">Luxury Travel Experiences Since 2010</p>
      </div>
    </footer>
  );
};

export default Footer;
