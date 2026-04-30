import './VideoStrip.css';

const VideoStrip = () => {
  return (
    <div className="video-strip">
      <video 
        className="video-strip-bg" 
        autoPlay 
        muted 
        loop 
        playsInline
        poster="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=70"
      >
        <source src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/1562478/1562478-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>
      <div className="video-strip-overlay"></div>
      <div className="video-strip-content">
        <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Your Journey Begins</div>
        <h2 className="video-strip-title">
          The World is Waiting<br />
          <em>Are You?</em>
        </h2>
        <a href="#contact" className="btn-outline video-strip-btn">
          Plan My Journey
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default VideoStrip;
