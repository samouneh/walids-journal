import { useRef, useState, useEffect } from 'react';

/**
 * Scroll-reveal wrapper — fades/slides children in when they enter the viewport.
 *
 * variant:
 *   "up"    → translateY + opacity   (default)
 *   "fade"  → opacity only
 *   "scale" → scale + opacity
 *
 * delay: ms delay before the transition starts (useful for staggering siblings)
 */
export default function Reveal({ children, variant = 'up', delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // only animate once
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const baseClass =
    variant === 'fade'  ? 'reveal-fade' :
    variant === 'scale' ? 'reveal-scale' :
    'reveal';

  return (
    <Tag
      ref={ref}
      className={`${baseClass} ${visible ? 'visible' : ''} ${className}`}
      style={delay ? { transitionDelay: delay + 'ms' } : undefined}
    >
      {children}
    </Tag>
  );
}
