import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ActivityHeatmap from '../components/ActivityHeatmap';
import Reveal from '../components/Reveal';
import { excerpt, catSlug, formatDateShort } from '../utils/format';

const CATEGORIES = ['Markets & Investing', 'Financial Modelling', 'Reading & Research', 'Projects & Analysis', 'Industry Notes'];

const CATEGORY_COLORS = {
  'Markets & Investing': '#2563eb',
  'Financial Modelling':'#059669',
  'Reading & Research':             '#d97706',
  'Projects & Analysis':             '#7c3aed',
  'Industry Notes':               '#4b5563',
};



function groupByMonth(posts) {
  const groups = {};
  for (const post of posts) {
    const key = new Date(post.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
  }
  return groups;
}

export default function Archive({ posts, onTogglePin }) {
  const [searchParams]      = useSearchParams();
  const [query, setQuery]   = useState('');
  const [cats, setCats]     = useState(() => {
    const cat = searchParams.get('cat');
    return cat ? [cat] : [];
  });
  const [sort, setSort]             = useState('newest');
  const [view, setView]             = useState('timeline');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const pinnedCount = useMemo(() => posts.filter((p) => p.pinned).length, [posts]);

  function toggleCat(cat) {
    setCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return posts
      .filter((p) => q === '' || [p.title, p.content, p.tags.join(' ')].join(' ').toLowerCase().includes(q))
      .filter((p) => cats.length === 0 || cats.includes(p.category))
      .filter((p) => !showPinnedOnly || p.pinned)
      .sort((a, b) =>
        sort === 'newest'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
  }, [posts, query, cats, sort, showPinnedOnly]);

  return (
    <div className="archive-page">
      <Reveal>
        <div className="archive-page-header">
          <h1>Archive</h1>
          <p>{posts.length} {posts.length === 1 ? 'entry' : 'entries'} · your complete learning history</p>
        </div>
      </Reveal>

      <Reveal delay={100} variant="scale">
        <ActivityHeatmap posts={posts} />
      </Reveal>

      {/* Search */}
      <div className="archive-search-row">
        <input
          type="search"
          className="archive-search"
          placeholder="Search entries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Toolbar */}
      <div className="archive-toolbar">
        <div className="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tag-btn ${cats.includes(cat) ? 'active' : ''}`}
              onClick={() => toggleCat(cat)}
            >
              {cat}
            </button>
          ))}
          {cats.length > 0 && (
            <button className="tag-btn" onClick={() => setCats([])}>✕ Clear</button>
          )}
        </div>

        <div className="view-sort-controls">
          {/* Pinned filter — only shown when at least one post is pinned */}
          {pinnedCount > 0 && (
            <button
              className={`icon-btn pinned-filter-btn ${showPinnedOnly ? 'active' : ''}`}
              onClick={() => setShowPinnedOnly((v) => !v)}
              title="Show pinned entries only"
            >
              ★&thinsp;{pinnedCount}
            </button>
          )}
          <button
            className={`icon-btn ${sort === 'newest' ? 'active' : ''}`}
            onClick={() => setSort('newest')}
          >
            Newest
          </button>
          <button
            className={`icon-btn ${sort === 'oldest' ? 'active' : ''}`}
            onClick={() => setSort('oldest')}
          >
            Oldest
          </button>
          <button
            className={`icon-btn ${view === 'timeline' ? 'active' : ''}`}
            onClick={() => setView('timeline')}
            title="Timeline view"
          >
            ☰
          </button>
          <button
            className={`icon-btn ${view === 'grid' ? 'active' : ''}`}
            onClick={() => setView('grid')}
            title="Grid view"
          >
            ⊞
          </button>
        </div>
      </div>

      <p className="archive-meta">
        {showPinnedOnly
          ? `${filtered.length} pinned ${filtered.length === 1 ? 'entry' : 'entries'}`
          : `Showing ${filtered.length} of ${posts.length} ${posts.length === 1 ? 'entry' : 'entries'}`}
        {query && ` matching "${query}"`}
      </p>

      {filtered.length === 0 && (
        <div className="archive-empty">
          {posts.length === 0
            ? <p>No entries yet. <Link to="/admin">Add your first entry →</Link></p>
            : showPinnedOnly
            ? <p>No pinned entries yet. Star any entry to surface it here.</p>
            : <p>No entries match your filters.</p>
          }
        </div>
      )}

      {view === 'timeline' && filtered.length > 0 && (
        <TimelineView posts={filtered} onTogglePin={onTogglePin} showPinnedOnly={showPinnedOnly} />
      )}

      {view === 'grid' && filtered.length > 0 && (
        <GridView posts={filtered} onTogglePin={onTogglePin} showPinnedOnly={showPinnedOnly} />
      )}
    </div>
  );
}

/* ─── Timeline ────────────────────────────────────────────────────── */

function TimelineView({ posts, onTogglePin, showPinnedOnly }) {
  const pinned   = posts.filter((p) => p.pinned);
  const unpinned = posts.filter((p) => !p.pinned);
  const groups   = groupByMonth(showPinnedOnly ? [] : unpinned);

  return (
    <>
      {/* Pinned section — above month groups when not already filtering pinned-only */}
      {!showPinnedOnly && pinned.length > 0 && (
        <div className="archive-pinned-section">
          <h2 className="archive-month-label archive-pinned-label">
            <span className="pinned-star">★</span> Pinned
          </h2>
          <div className="archive-track">
            {pinned.map((post) => (
              <TimelineItem key={post.id} post={post} onTogglePin={onTogglePin} />
            ))}
          </div>
        </div>
      )}

      {/* Pinned-only mode: render all filtered posts as a flat list */}
      {showPinnedOnly && (
        <div className="archive-pinned-section">
          <div className="archive-track">
            {posts.map((post) => (
              <TimelineItem key={post.id} post={post} onTogglePin={onTogglePin} />
            ))}
          </div>
        </div>
      )}

      {/* Regular monthly groups */}
      {Object.entries(groups).map(([month, monthPosts]) => (
        <div key={month} className="archive-timeline-month">
          <h2 className="archive-month-label">{month}</h2>
          <div className="archive-track">
            {monthPosts.map((post) => (
              <TimelineItem key={post.id} post={post} onTogglePin={onTogglePin} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function TimelineItem({ post, onTogglePin }) {
  const color    = CATEGORY_COLORS[post.category] || '#6b7280';
  const catClass = `cat-${post.category.toLowerCase().replace(/[^a-z]/g, '-')}`;
  return (
    <div className={`archive-item${post.pinned ? ' archive-item--pinned' : ''}`}>
      <span className="archive-dot" style={{ background: color }} />
      <div className="archive-item-body">
        <div className="archive-item-meta">
          <span className={`post-card-category ${catClass}`}>{post.category}</span>
          <span className="archive-item-date">{formatDateShort(post.createdAt)}</span>
        </div>
        <Link to={`/post/${post.id}`} className="archive-item-title">{post.title}</Link>
        <p className="archive-item-excerpt">{excerpt(post.content)}</p>
        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((t) => <span key={t} className="post-tag">{t}</span>)}
          </div>
        )}
      </div>
      <button
        className={`archive-item-pin ${post.pinned ? 'pinned' : ''}`}
        onClick={() => onTogglePin(post.id)}
        title={post.pinned ? 'Unpin' : 'Pin'}
      >
        {post.pinned ? '★' : '☆'}
      </button>
    </div>
  );
}

/* ─── Grid ────────────────────────────────────────────────────────── */

function GridView({ posts, onTogglePin, showPinnedOnly }) {
  const pinned   = posts.filter((p) => p.pinned);
  const unpinned = posts.filter((p) => !p.pinned);

  if (showPinnedOnly) {
    return (
      <div className="archive-grid">
        {posts.map((post) => <GridCard key={post.id} post={post} onTogglePin={onTogglePin} />)}
      </div>
    );
  }

  return (
    <div>
      {pinned.length > 0 && (
        <>
          <h2 className="archive-month-label archive-pinned-label">
            <span className="pinned-star">★</span> Pinned
          </h2>
          <div className="archive-grid archive-grid--pinned">
            {pinned.map((post) => <GridCard key={post.id} post={post} onTogglePin={onTogglePin} />)}
          </div>
          {unpinned.length > 0 && <div className="archive-grid-divider" />}
        </>
      )}
      {unpinned.length > 0 && (
        <div className="archive-grid">
          {unpinned.map((post) => <GridCard key={post.id} post={post} onTogglePin={onTogglePin} />)}
        </div>
      )}
    </div>
  );
}

function GridCard({ post, onTogglePin }) {
  const catClass = `cat-${post.category.toLowerCase().replace(/[^a-z]/g, '-')}`;
  return (
    <div className={`archive-grid-card${post.pinned ? ' archive-grid-card--pinned' : ''}`}>
      <div className="archive-grid-card-header">
        <Link to={`/post/${post.id}`} className="archive-grid-card-title">{post.title}</Link>
        <button
          className={`archive-item-pin ${post.pinned ? 'pinned' : ''}`}
          onClick={() => onTogglePin(post.id)}
          title={post.pinned ? 'Unpin' : 'Pin'}
        >
          {post.pinned ? '★' : '☆'}
        </button>
      </div>
      <span className="archive-grid-card-date">{formatDateShort(post.createdAt)}</span>
      <p className="archive-grid-card-excerpt">{excerpt(post.content)}</p>
      <div className="archive-grid-card-footer">
        <span className={`post-card-category ${catClass}`}>{post.category}</span>
        {post.tags.slice(0, 2).map((t) => (
          <span key={t} className="post-tag">{t}</span>
        ))}
      </div>
    </div>
  );
}
