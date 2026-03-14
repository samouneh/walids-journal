import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const INTERVAL  = 5000;
const MAX_PINNED = 3;
const MAX_RECENT = 5;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function excerpt(text, max = 200) {
  const plain = text.replace(/[#*`>_~\[\]]/g, '').trim();
  return plain.length <= max ? plain : plain.slice(0, max).trimEnd() + '…';
}

function readingTime(content) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

export default function Sidebar({ posts, onTogglePin }) {
  const pinned = posts
    .filter((p) => p.pinned)
    .slice(0, MAX_PINNED);

  const recent = posts
    .filter((p) => !p.pinned)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, MAX_RECENT);

  /* Fallback: if everything is pinned, show all posts in carousel */
  const carouselPosts = recent.length > 0 ? recent : posts.slice(0, MAX_RECENT);

  const [idx, setIdx]     = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => { setIdx(0); }, [carouselPosts.length]);

  useEffect(() => {
    if (paused || carouselPosts.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % carouselPosts.length);
    }, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [paused, carouselPosts.length]);

  function prev() { setIdx((i) => (i - 1 + carouselPosts.length) % carouselPosts.length); }
  function next() { setIdx((i) => (i + 1) % carouselPosts.length); }

  if (posts.length === 0) {
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

  const post     = carouselPosts[idx];
  const catClass = `cat-${post.category.toLowerCase().replace(/[^a-z]/g, '-')}`;

  return (
    <aside
      className="sidebar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Header ───────────────────────────────────────── */}
      <div className="sidebar-header">
        <span className="sidebar-title">Progress Log</span>
        <Link to="/archive" className="sidebar-view-all">View all →</Link>
      </div>

      {/* ── ★ Top (pinned strip) ─────────────────────────── */}
      {pinned.length > 0 && (
        <div className="sidebar-pinned-strip">
          <p className="sidebar-section-label">
            <span className="sidebar-section-star">★</span> Top
          </p>
          {pinned.map((p) => (
            <Link key={p.id} to={`/post/${p.id}`} className="sidebar-pinned-row">
              <span className="sidebar-pinned-row-title">{p.title}</span>
              <span className="sidebar-pinned-row-date">{formatDate(p.createdAt)}</span>
            </Link>
          ))}
        </div>
      )}

      {/* ── Recent (carousel) ────────────────────────────── */}
      <div className="sidebar-section-label-wrap">
        <p className="sidebar-section-label">Recent</p>
      </div>

      <div className="carousel">
        <div className="carousel-slide" key={post.id}>
          <div className="carousel-slide-top">
            <div className="carousel-slide-meta">
              <span className={`post-card-category ${catClass}`}>{post.category}</span>
              <span className="carousel-date">{formatDate(post.createdAt)}</span>
              <span className="carousel-read-time">{readingTime(post.content)}m read</span>
            </div>
            <button
              className={`carousel-pin-btn ${post.pinned ? 'pinned' : ''}`}
              onClick={() => onTogglePin(post.id)}
              title={post.pinned ? 'Unpin' : 'Pin to top'}
            >
              {post.pinned ? '★' : '☆'}
            </button>
          </div>

          <Link to={`/post/${post.id}`} className="carousel-slide-title">
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
            {carouselPosts.map((_, i) => (
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
