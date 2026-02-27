import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const CATEGORIES = ['Markets & Investing', 'Excel & Spreadsheets', 'Reading', 'Project', 'Other'];

const EMPTY = { title: '', content: '', category: 'Markets & Investing', tags: '' };

export default function Admin({ posts, onAdd, onEdit, onDelete, onTogglePin }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const existing = isEdit ? posts.find((p) => p.id === id) : null;

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        content: existing.content,
        category: existing.category,
        tags: existing.tags.join(', '),
      });
    } else {
      setForm(EMPTY);
    }
  }, [id]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.content.trim()) { setError('Content is required.'); return; }
    setError('');

    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = { title: form.title.trim(), content: form.content.trim(), category: form.category, tags };

    if (isEdit) {
      onEdit(id, payload);
    } else {
      onAdd(payload);
    }
    navigate('/');
  }

  function handleDelete(postId) {
    if (window.confirm('Delete this post? This cannot be undone.')) {
      onDelete(postId);
    }
  }

  return (
    <div className="admin-layout">
      <div className="admin-form-col">
        <Link to="/" className="back-link">← Back</Link>
        <h1>{isEdit ? 'Edit Entry' : 'New Entry'}</h1>

        <form className="post-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="What did you work on?"
            />
          </label>

          <label>
            Category
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>

          <label>
            Tags <span className="field-hint">(comma-separated)</span>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="DCF, VLOOKUP, ratio analysis…"
            />
          </label>

          <label>
            Content <span className="field-hint">(Markdown supported)</span>
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              placeholder="Describe what you learnt, what you built, key takeaways…"
              rows={16}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Publish Entry'}
            </button>
            <Link to="/" className="btn btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>

      <div className="admin-list-col">
        <h2>All Entries</h2>
        {posts.length === 0 && <p className="empty-msg">No entries yet.</p>}
        <ul className="admin-post-list">
          {posts.map((post) => (
            <li key={post.id} className="admin-post-item">
              <Link to={`/admin/edit/${post.id}`} className="admin-post-title">{post.title}</Link>
              <span className="admin-post-category">{post.category}</span>
              <button
                className={`admin-post-pin ${post.pinned ? 'pinned' : ''}`}
                onClick={() => onTogglePin(post.id)}
                title={post.pinned ? 'Unpin' : 'Pin to top'}
              >
                {post.pinned ? '★' : '☆'}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
