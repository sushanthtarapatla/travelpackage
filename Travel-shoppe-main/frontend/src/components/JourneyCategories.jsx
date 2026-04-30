import { useState, useEffect, useRef } from 'react';
import { useJourneyCategories } from '../hooks/useApi';
import './JourneyCategories.css';

const JourneyCategories = () => {
  const { categories, loading, error } = useJourneyCategories();
  const [activeCategory, setActiveCategory] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      const active = categories.find(c => c.active) || categories[0];
      setActiveCategory(active.slug);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cats = entry.target.querySelectorAll('.journey-cat');
          cats.forEach((cat, index) => {
            setTimeout(() => {
              cat.style.opacity = '1';
              cat.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [categories]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="journeys-section" id="experiences" ref={sectionRef}>
      <div className="section-header">
        <div className="section-eyebrow">Journeys Curated For You</div>
        <h2 className="section-title">Handcrafted travel experiences <strong>designed around your dreams</strong></h2>
      </div>
      <div className="journey-cats">
        {categories.map((category, index) => (
          <div 
            className={`journey-cat ${activeCategory === category.slug ? 'active' : ''}`}
            key={category._id || index}
            onClick={() => setActiveCategory(category.slug)}
            style={{ opacity: '0', transform: 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            <div className="journey-cat-icon">{category.icon}</div>
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyCategories;
