import './FeaturedExperience.css';

const features = [
  'Personally curated luxury itineraries tailored to your desires',
  'Access to exclusive properties and private experiences worldwide',
  'Dedicated travel concierge available 24 hours a day',
  'Seamless end-to-end travel management from flights to villas',
  'Over 150+ handpicked destinations across 6 continents'
];

const FeaturedExperience = () => {
  return (
    <section className="featured-section" id="about">
      <div className="featured-inner">
        <div className="featured-image-wrap">
          <img 
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=85&fit=crop" 
            alt="Luxury Hotel" 
            className="featured-image" 
            loading="lazy" 
          />
          <div className="featured-badge">Since 2010</div>
          <div className="featured-stat-box">
            <div className="featured-stat-num">10K+</div>
            <div className="featured-stat-label">Happy Travelers</div>
          </div>
        </div>
        <div className="featured-content">
          <div className="section-eyebrow">Why Travel</div>
          <h2 className="section-title">Where Luxury Meets <strong>Authentic Discovery</strong></h2>
          <p className="section-sub">
            We don't just book trips — we craft personalised journeys that transform the way you experience the world.
          </p>
          <ul className="featured-list">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <a href="#contact" className="btn-outline">
            Start Planning
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperience;
