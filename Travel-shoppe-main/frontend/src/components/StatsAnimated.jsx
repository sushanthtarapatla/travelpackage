import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Stats.css';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { num: 10000, suffix: '+', label: 'Happy Travelers' },
  { num: 150, suffix: '+', label: 'Destinations' },
  { num: 15, suffix: '', label: 'Years of Excellence' },
  { num: 98, suffix: '%', label: 'Client Satisfaction' }
];

const StatsAnimated = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 3D flip entrance for stats
      gsap.fromTo('.stat-item-3d',
        { 
          opacity: 0, 
          rotateX: -90,
          y: 50,
          transformPerspective: 1000
        },
        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Number counter animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          statsRef.current.forEach((stat, index) => {
            if (!stat) return;
            const target = stats[index].num;
            const obj = { value: 0 };
            
            // Scramble effect before revealing
            const chars = '0123456789';
            let scrambleInterval;
            
            gsap.to(obj, {
              value: target,
              duration: 2,
              delay: index * 0.2,
              ease: 'power2.out',
              onStart: () => {
                // Scramble effect
                scrambleInterval = setInterval(() => {
                  const randomVal = Math.floor(Math.random() * target * 1.5);
                  stat.textContent = randomVal.toLocaleString() + stats[index].suffix;
                }, 50);
              },
              onUpdate: () => {
                clearInterval(scrambleInterval);
                const current = Math.round(obj.value);
                stat.textContent = current.toLocaleString() + stats[index].suffix;
              }
            });
          });
        }
      });

      // Divider lines animate
      gsap.fromTo('.stat-divider',
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Ambient float
      gsap.to('.stat-item-3d', {
        y: -5,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.5,
          from: 'start'
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="stats-section" ref={sectionRef}>
      <div className="stats-inner">
        {stats.map((stat, index) => (
          <div className="stat-item-3d stat-item" key={index}>
            <div 
              className="stat-num" 
              ref={el => statsRef.current[index] = el}
            >
              0{stat.suffix}
            </div>
            <div className="stat-label">{stat.label}</div>
            {index < stats.length - 1 && <div className="stat-divider"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsAnimated;
