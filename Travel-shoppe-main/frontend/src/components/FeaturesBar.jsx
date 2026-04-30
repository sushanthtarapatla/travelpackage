import './FeaturesBar.css';

const features = [
  {
    icon: '✦',
    title: 'Exclusive Experiences',
    description: 'Handpicked luxury stays & unique experiences'
  },
  {
    icon: '◈',
    title: 'Best Price Guarantee',
    description: 'Premium experiences at the best value'
  },
  {
    icon: '◉',
    title: '24/7 Concierge',
    description: 'Round-the-clock support for a worry-free journey'
  },
  {
    icon: '❋',
    title: 'Trusted by Travelers',
    description: '10,000+ happy travelers worldwide'
  }
];

const FeaturesBar = () => {
  return (
    <div className="features-bar">
      <div className="features-inner">
        {features.map((feature, index) => (
          <div className="feature-item" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <div className="feature-text">
              <strong>{feature.title}</strong>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesBar;
