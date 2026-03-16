import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Reveal from '../components/Reveal';
import { catSlug, formatDateLong, readingTime } from '../utils/format';

export default function PostDetail({ posts, onDelete, onTogglePin, onToggleInProgress }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="not-found">
        <h2>Post not found</h2>
        <Link to="/">← Back home</Link>
      </div>
    );
  }

  async function handleDelete() {
    if (window.confirm('Delete this post?')) {
      try {
        await onDelete(post.id);
        navigate('/');
      } catch {
        alert('Failed to delete post.');
      }
    }
  }

  const isAnalysis = post.type === 'analysis';

  return (
    <div className={isAnalysis ? 'post-detail-layout post-detail-layout--analysis' : 'post-detail-layout'}>
      <Reveal>
      <article className={isAnalysis ? 'post-detail post-detail--analysis' : 'post-detail'}>
        <Link to={isAnalysis ? '/research' : '/'} className="back-link">
          ← {isAnalysis ? 'Back to Research' : 'Back'}
        </Link>

        {isAnalysis && (
          <div className="analysis-stamp">Investment Analysis</div>
        )}

        <header className="post-detail-header">
          <span className={`post-card-category cat-${catSlug(post.category)}`}>
            {post.category}
          </span>
          <h1>{post.title}</h1>
          <div className="post-detail-meta">
            <time className="post-detail-date">{formatDateLong(post.createdAt)}</time>
            {!isAnalysis && (
              <span className="post-reading-time">{readingTime(post.content)} min read</span>
            )}
          </div>
          {post.updatedAt && (
            <span className="post-detail-updated">Edited {formatDateLong(post.updatedAt)}</span>
          )}
        </header>

        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((t) => <span key={t} className="post-tag">{t}</span>)}
          </div>
        )}

        <div className="post-body">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <footer className="post-detail-footer">
          <Link to={`/admin/edit/${post.id}`} className="btn btn-secondary">Edit</Link>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          <button
            className="btn btn-ghost"
            onClick={() => onTogglePin(post.id)}
            title={post.pinned ? 'Unpin this entry' : 'Pin to Featured Work'}
          >
            {post.pinned ? '★ Pinned' : '☆ Pin'}
          </button>
          <button
            className={`btn btn-ghost${post.inProgress ? ' wip-active' : ''}`}
            onClick={() => onToggleInProgress(post.id)}
            title={post.inProgress ? 'Mark as complete' : 'Mark as in progress'}
          >
            {post.inProgress ? '⚡ In Progress' : '⚡︎ In Progress'}
          </button>
        </footer>
      </article>
      </Reveal>
    </div>
  );
}
