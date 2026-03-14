import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { excerpt, catSlug, formatDateShort } from '../utils/format';

export default function Research({ posts }) {
  const analyses = posts
    .filter((p) => p.type === 'analysis')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="research-layout">
      <Reveal>
        <header className="research-header">
          <div className="research-header-text">
            <p className="research-eyebrow">Investment Research</p>
            <h1 className="research-title">Analysis</h1>
            <p className="research-desc">
              Written investment theses, sector notes, and valuation work.
              Engineering meets markets.
            </p>
          </div>
          <Link to="/admin" className="btn btn-primary research-new-btn">
            + New Analysis
          </Link>
        </header>
      </Reveal>

      {analyses.length === 0 ? (
        <Reveal>
          <div className="research-empty">
            <p className="research-empty-title">No analyses published yet.</p>
            <p className="research-empty-hint">
              Go to Admin, write a new entry, and set the type to <strong>Analysis</strong>.
            </p>
            <Link to="/admin" className="btn btn-primary">Write your first analysis &rarr;</Link>
          </div>
        </Reveal>
      ) : (
        <div className="research-grid">
          {analyses.map((post, i) => (
            <Reveal key={post.id} delay={i * 60}>
              <Link to={`/post/${post.id}`} className="research-card">
                <div className="research-card-top">
                  <span className={`post-card-category cat-${catSlug(post.category)}`}>
                    {post.category}
                  </span>
                  <time className="research-card-date">{formatDateShort(post.createdAt)}</time>
                </div>
                <h2 className="research-card-title">{post.title}</h2>
                <p className="research-card-excerpt">{excerpt(post.content)}</p>
                {post.tags.length > 0 && (
                  <div className="research-card-tags">
                    {post.tags.slice(0, 4).map((t) => (
                      <span key={t} className="post-tag">{t}</span>
                    ))}
                  </div>
                )}
                <span className="research-card-cta">Read analysis &rarr;</span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
