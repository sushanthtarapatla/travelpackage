import { useState, useEffect } from 'react';
import UserCancellation from './UserCancellation';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [cancellationModalOpen, setCancellationModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
      
      // Update active section based on scroll position
      const sections = document.querySelectorAll('section[id], div[id]');
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 120) {
          current = section.getAttribute('id');
        }
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'packages', label: 'Packages' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <>
      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={closeMobileMenu}>✕</button>
        {navLinks.map(link => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={closeMobileMenu}
          >
            {link.label}
          </a>
        ))}
        <button
          className="mobile-menu-btn"
          onClick={() => {
            closeMobileMenu();
            setCancellationModalOpen(true);
          }}
        >
          Cancel Trip
        </button>
      </div>

      {/* Navigation */}
      <nav className={isScrolled ? 'scrolled' : ''}>
        <a href="#home" className="nav-logo">
          <div className="nav-logo-icon"></div>
          <div className="nav-logo-text">
            <span>Travel</span>
            <span>Luxury Travel Experiences</span>
          </div>
        </a>

        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.id}>
              <a 
                href={`#${link.id}`}
                className={activeSection === link.id ? 'active' : ''}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <div className="nav-phone">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"></path>
            </svg>
            +91 81421 89138
          </div>
          <button
            className="btn-outline"
            onClick={() => setCancellationModalOpen(true)}
          >
            Cancel Trip
          </button>
          <a href="#contact" className="btn-gold">Plan My Trip</a>
          <div className="hamburger" onClick={openMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <UserCancellation
        isOpen={cancellationModalOpen}
        onClose={() => setCancellationModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
