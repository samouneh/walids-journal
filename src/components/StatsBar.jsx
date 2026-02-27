import { useState, useEffect, useMemo, useRef } from 'react';

function useCountUp(target, active, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) { setCount(active ? target : 0); return; }
    let current = 0;
    const steps = Math.ceil(duration / 16);
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, active, duration]);
  return count;
}

export default function StatsBar({ posts }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = useMemo(() => {
    const total = posts.length;
    const sorted = [...posts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const firstDate = sorted.length > 0 ? new Date(sorted[0].createdAt) : null;
    const daysActive = firstDate
      ? Math.max(1, Math.floor((Date.now() - firstDate.getTime()) / 86400000) + 1)
      : 0;
    const topics = new Set(posts.map((p) => p.category)).size;
    const weekAgo = Date.now() - 7 * 86400000;
    const thisWeek = posts.filter((p) => new Date(p.createdAt).getTime() >= weekAgo).length;
    return { total, daysActive, topics, thisWeek };
  }, [posts]);

  const total    = useCountUp(stats.total, visible);
  const days     = useCountUp(stats.daysActive, visible);
  const topics   = useCountUp(stats.topics, visible);
  const thisWeek = useCountUp(stats.thisWeek, visible);

  const items = [
    { value: total, label: 'Entries Logged' },
    { value: days, label: 'Days Active' },
    { value: topics, label: 'Topics Covered' },
    { value: thisWeek, label: 'This Week' },
  ];

  return (
    <div
      ref={ref}
      className={`stats-bar reveal-scale ${visible ? 'visible' : ''}`}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className="stat-item"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity .5s ease ${i * 100}ms, transform .5s ease ${i * 100}ms`,
          }}
        >
          <span className="stat-value">{item.value}</span>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
