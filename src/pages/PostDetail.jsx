import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Reveal from '../components/Reveal';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function PostDetail({ posts, onDelete, onTogglePin }) {
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

  function handleDelete() {
    if (window.confirm('Delete this post?')) {
      onDelete(post.id);
      navigate('/');
    }
  }

  return (
    <div className="post-detail-layout">
      <Reveal>
      <article className="post-detail">
        <Link to="/" className="back-link">← Back</Link>
        <header className="post-detail-header">
          <span className={`post-card-category cat-${post.category.toLowerCase().replace(/[^a-z]/g, '-')}`}>
            {post.category}
          </span>
          <h1>{post.title}</h1>
          <time className="post-detail-date">{formatDate(post.createdAt)}</time>
          {post.updatedAt && (
            <span className="post-detail-updated">Edited {formatDate(post.updatedAt)}</span>
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
            title={post.pinned ? 'Unpin this entry' : 'Pin to top of carousel'}
          >
            {post.pinned ? '★ Pinned' : '☆ Pin'}
          </button>
        </footer>
      </article>
      </Reveal>
    </div>
  );
}
