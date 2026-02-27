import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const INTERVAL = 5000;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function excerpt(text, max = 180) {
  const plain = text.replace(/[#*`>_~\[\]]/g, '').trim();
  return plain.length <= max ? plain : plain.slice(0, max).trimEnd() + '…';
}

export default function Sidebar({ posts, onTogglePin }) {
  const featured = [
    ...posts.filter((p) => p.pinned),
    ...posts.filter((p) => !p.pinned),
  ].slice(0, 8);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // Reset index when posts list changes length
  useEffect(() => { setIdx(0); }, [posts.length]);

  // Auto-advance
  useEffect(() => {
    if (paused || featured.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % featured.length);
    }, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [paused, featured.length]);

  function prev() { setIdx((i) => (i - 1 + featured.length) % featured.length); }
  function next() { setIdx((i) => (i + 1) % featured.length); }

  if (featured.length === 0) {
    return (
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">Progress Log</span>
        </div>
        <div className="sidebar-empty">
          <p>No entries yet.</p>
          <p><Link to="/admin">Start logging your progress →</Link></p>
        </div>
      </aside>
    );
  }

  const post = featured[idx];
  const catClass = `cat-${post.category.toLowerCase().replace(/[^a-z]/g, '-')}`;

  return (
    <aside
      className="sidebar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="sidebar-header">
        <span className="sidebar-title">Progress Log</span>
        <Link to="/archive" className="sidebar-view-all">View all →</Link>
      </div>

      <div className="carousel">
        <div className="carousel-slide" key={post.id}>
          <div className="carousel-slide-top">
            <div className="carousel-slide-meta">
              <span className={`post-card-category ${catClass}`}>{post.category}</span>
              <span className="carousel-date">{formatDate(post.createdAt)}</span>
            </div>
            <button
              className={`carousel-pin-btn ${post.pinned ? 'pinned' : ''}`}
              onClick={() => onTogglePin(post.id)}
              title={post.pinned ? 'Unpin' : 'Pin to top'}
            >
              {post.pinned ? '★' : '☆'}
            </button>
          </div>

          <Link to={`/post/${post.id}`} className="carousel-slide-title" style={{ textDecoration: 'none' }}>
            {post.title}
          </Link>

          <p className="carousel-slide-excerpt">{excerpt(post.content)}</p>

          {post.tags.length > 0 && (
            <div className="carousel-slide-tags">
              {post.tags.slice(0, 4).map((t) => (
                <span key={t} className="post-tag">{t}</span>
              ))}
            </div>
          )}

          <div className="carousel-slide-footer">
            <Link to={`/post/${post.id}`} className="carousel-read-more">
              Read entry →
            </Link>
            {paused && <span className="carousel-paused-badge">Paused</span>}
          </div>
        </div>

        <div className="carousel-controls">
          <button className="carousel-nav-btn" onClick={prev} aria-label="Previous">‹</button>
          <div className="carousel-dots">
            {featured.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === idx ? 'active' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Go to entry ${i + 1}`}
              />
            ))}
          </div>
          <button className="carousel-nav-btn" onClick={next} aria-label="Next">›</button>
        </div>
      </div>
    </aside>
  );
}
