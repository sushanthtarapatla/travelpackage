import './Stats.css';

const stats = [
  { num: '10K+', label: 'Happy Travelers' },
  { num: '150+', label: 'Destinations' },
  { num: '15', label: 'Years of Excellence' },
  { num: '98%', label: 'Client Satisfaction' }
];

const Stats = () => {
  return (
    <div className="stats-section">
      <div className="stats-inner">
        {stats.map((stat, index) => (
          <div className="stat-item" key={index}>
            <div className="stat-num">{stat.num}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
