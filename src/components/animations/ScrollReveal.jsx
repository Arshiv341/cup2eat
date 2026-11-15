import React, { useRef, useState, useEffect } from 'react';

/**
 * Reusable Scroll Reveal Animation Wrapper
 * 
 * Uses native IntersectionObserver to animate content into view as the user scrolls.
 * Triggers once per element to prevent annoying re-animations on small scrolls.
 * Seamless on mobile and desktop.
 */
const ScrollReveal = ({
  children,
  className = '',
  direction = 'up', // 'up' | 'down' | 'fade' | 'scale'
  delay = 0,
  threshold = 0.15,
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If reduced motion is requested, show immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    const currentElem = ref.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [threshold]);

  const getTransitionStyle = () => {
    const baseTransition = 'transition-all duration-700 ease-out';
    const delayStyle = delay ? { transitionDelay: `${delay}ms` } : {};

    if (!isVisible) {
      switch (direction) {
        case 'up':
          return {
            classes: `${baseTransition} opacity-0 translate-y-8`,
            style: delayStyle,
          };
        case 'down':
          return {
            classes: `${baseTransition} opacity-0 -translate-y-8`,
            style: delayStyle,
          };
        case 'scale':
          return {
            classes: `${baseTransition} opacity-0 scale-95`,
            style: delayStyle,
          };
        case 'fade':
        default:
          return {
            classes: `${baseTransition} opacity-0`,
            style: delayStyle,
          };
      }
    }

    return {
      classes: `${baseTransition} opacity-100 translate-y-0 scale-100`,
      style: delayStyle,
    };
  };

  const { classes, style } = getTransitionStyle();

  return (
    <div ref={ref} className={`${classes} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default ScrollReveal;
