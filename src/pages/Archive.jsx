import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ActivityHeatmap from '../components/ActivityHeatmap';
import Reveal from '../components/Reveal';

const CATEGORIES = ['Markets & Investing', 'Excel & Spreadsheets', 'Reading', 'Project', 'Other'];

const CATEGORY_COLORS = {
  'Markets & Investing': '#2563eb',
  'Excel & Spreadsheets':'#059669',
  'Reading':             '#d97706',
  'Project':             '#7c3aed',
  'Other':               '#4b5563',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function excerpt(text, max = 140) {
  const plain = text.replace(/[#*`>_~\[\]]/g, '').trim();
  return plain.length <= max ? plain : plain.slice(0, max).trimEnd() + '…';
}

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
  const [query, setQuery]         = useState('');
  const [cats, setCats]           = useState([]);
  const [sort, setSort]           = useState('newest');
  const [view, setView]           = useState('timeline');

  function toggleCat(cat) {
    setCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return posts
      .filter((p) => q === '' || [p.title, p.content, p.tags.join(' ')].join(' ').toLowerCase().includes(q))
      .filter((p) => cats.length === 0 || cats.includes(p.category))
      .sort((a, b) =>
        sort === 'newest'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
  }, [posts, query, cats, sort]);

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
        Showing {filtered.length} of {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
        {query && ` matching "${query}"`}
      </p>

      {filtered.length === 0 && (
        <div className="archive-empty">
          {posts.length === 0
            ? <p>No entries yet. <Link to="/admin">Add your first entry →</Link></p>
            : <p>No entries match your filters.</p>
          }
        </div>
      )}

      {view === 'timeline' && filtered.length > 0 && (
        <TimelineView posts={filtered} onTogglePin={onTogglePin} />
      )}

      {view === 'grid' && filtered.length > 0 && (
        <GridView posts={filtered} onTogglePin={onTogglePin} />
      )}
    </div>
  );
}

function TimelineView({ posts, onTogglePin }) {
  const groups = groupByMonth(posts);
  return (
    <>
      {Object.entries(groups).map(([month, monthPosts]) => (
        <div key={month} className="archive-timeline-month">
          <h2 className="archive-month-label">{month}</h2>
          <div className="archive-track">
            {monthPosts.map((post) => {
              const color = CATEGORY_COLORS[post.category] || '#6b7280';
              const catClass = `cat-${post.category.toLowerCase().replace(/[^a-z]/g, '-')}`;
              return (
                <div key={post.id} className="archive-item">
                  <span className="archive-dot" style={{ background: color }} />
                  <div className="archive-item-body">
                    <div className="archive-item-meta">
                      <span className={`post-card-category ${catClass}`}>{post.category}</span>
                      <span className="archive-item-date">{formatDate(post.createdAt)}</span>
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
            })}
          </div>
        </div>
      ))}
    </>
  );
}

function GridView({ posts, onTogglePin }) {
  return (
    <div className="archive-grid">
      {posts.map((post) => {
        const catClass = `cat-${post.category.toLowerCase().replace(/[^a-z]/g, '-')}`;
        return (
          <div key={post.id} className="archive-grid-card">
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
            <span className="archive-grid-card-date">{formatDate(post.createdAt)}</span>
            <p className="archive-grid-card-excerpt">{excerpt(post.content)}</p>
            <div className="archive-grid-card-footer">
              <span className={`post-card-category ${catClass}`}>{post.category}</span>
              {post.tags.slice(0, 2).map((t) => (
                <span key={t} className="post-tag">{t}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
