import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global defaults for cinematic feel
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8
});

// Smooth scroll configuration
export const useSmoothScroll = () => {
  useEffect(() => {
    // Initialize smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};

// Hero entrance animation
export const useHeroAnimation = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Master timeline for hero entrance
      const masterTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Video fade in with scale
      masterTl.fromTo(videoRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.inOut' }
      );

      // Content 3D reveal from depth
      masterTl.fromTo(contentRef.current?.querySelectorAll('.animate-item'),
        { 
          opacity: 0, 
          z: -200,
          rotateX: 15,
          y: 50 
        },
        { 
          opacity: 1, 
          z: 0,
          rotateX: 0,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'back.out(1.2)'
        },
        '-=1'
      );

      // Scroll-triggered hero exit
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '50% top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(contentRef.current, {
            opacity: 1 - progress,
            z: -500 * progress,
            filter: `blur(${10 * progress}px)`,
            duration: 0.1
          });
          gsap.to(videoRef.current, {
            scale: 1 + (0.2 * progress),
            duration: 0.1
          });
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return { heroRef, contentRef, videoRef };
};

// Scroll reveal animation hook
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const {
    from = { opacity: 0, y: 50 },
    to = { opacity: 1, y: 0 },
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    stagger = 0.1,
    duration = 0.8
  } = options;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = ref.current?.querySelectorAll('.reveal-item');
      if (!elements?.length) return;

      gsap.fromTo(elements, from, {
        ...to,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start,
          end,
          scrub,
          toggleActions: 'play none none reverse'
        }
      });
    }, ref);

    return () => ctx.revert();
  }, [from, to, start, end, scrub, stagger, duration]);

  return ref;
};

// 3D Card perspective animation
export const use3DCardAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('.card-3d');
      if (!cards?.length) return;

      // Initial 3D reveal
      gsap.fromTo(cards,
        { 
          rotateY: -45,
          x: -100,
          opacity: 0,
          transformPerspective: 2000
        },
        {
          rotateY: 0,
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: {
            amount: 0.8,
            from: 'start'
          },
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Add hover effects to each card
      cards.forEach((card) => {
        const image = card.querySelector('.card-image');
        
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 5,
            z: 50,
            scale: 1.05,
            duration: 0.5,
            ease: 'power2.out'
          });
          gsap.to(image, {
            scale: 1.15,
            duration: 0.6,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            z: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
          });
          gsap.to(image, {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out'
          });
        });

        // Mouse move parallax inside card
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          
          gsap.to(image, {
            x: -x * 20,
            y: -y * 20,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
};

// Text split animation (for cinematic reveals)
export const useTextReveal = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const text = textRef.current;
      if (!text) return;

      // Split text into spans
      const content = text.textContent;
      text.innerHTML = content.split('').map(char => 
        char === ' ' ? ' ' : `<span class="char">${char}</span>`
      ).join('');

      const chars = text.querySelectorAll('.char');

      gsap.fromTo(chars,
        { 
          opacity: 0,
          y: 50,
          rotateX: -90
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: text,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, textRef);

    return () => ctx.revert();
  }, []);

  return textRef;
};

// Parallax layers
export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => (1 - speed) * 200,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return ref;
};

// Magnetic button effect
export const useMagneticButton = () => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return buttonRef;
};

// Counter animation
export const useCounter = (endValue, duration = 2) => {
  const counterRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: counterRef.current,
        start: 'top 80%',
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          const obj = { value: 0 };
          gsap.to(obj, {
            value: endValue,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = Math.round(obj.value).toLocaleString();
              }
            }
          });
        }
      });
    }, counterRef);

    return () => ctx.revert();
  }, [endValue, duration]);

  return counterRef;
};

// Floating animation (ambient)
export const useFloating = (amplitude = 10, duration = 4) => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: amplitude,
        duration: duration / 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    }, ref);

    return () => ctx.revert();
  }, [amplitude, duration]);

  return ref;
};

// Stagger reveal for lists
export const useStaggerReveal = (stagger = 0.1) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll('.stagger-item');
      if (!items?.length) return;

      gsap.fromTo(items,
        { opacity: 0, x: -30, rotateX: -15 },
        {
          opacity: 1,
          x: 0,
          rotateX: 0,
          duration: 0.6,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [stagger]);

  return containerRef;
};

export default {
  useSmoothScroll,
  useHeroAnimation,
  useScrollReveal,
  use3DCardAnimation,
  useTextReveal,
  useParallax,
  useMagneticButton,
  useCounter,
  useFloating,
  useStaggerReveal
};
