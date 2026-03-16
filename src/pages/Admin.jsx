import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const CATEGORIES = ['Markets & Investing', 'Financial Modelling', 'Reading & Research', 'Projects & Analysis', 'Industry Notes'];

const EMPTY = { title: '', content: '', category: 'Markets & Investing', tags: '', type: 'journal', expectedFinish: '' };

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function Admin({ posts, onAdd, onEdit, onDelete, onTogglePin, onToggleInProgress }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const existing = isEdit ? posts.find((p) => p.id === id) : null;

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const mdImportRef  = useRef(null);
  const jsonImportRef = useRef(null);

  useEffect(() => {
    if (existing) {
      setForm({
        title:          existing.title,
        content:        existing.content,
        category:       existing.category,
        tags:           existing.tags.join(', '),
        type:           existing.type || 'journal',
        expectedFinish: existing.expectedFinish || '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [id]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim())   { setError('Title is required.');   return; }
    if (!form.content.trim()) { setError('Content is required.'); return; }
    setError('');

    const tags    = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = { title: form.title.trim(), content: form.content.trim(), category: form.category, tags, type: form.type, expectedFinish: form.expectedFinish || null };

    try {
      if (isEdit) {
        await onEdit(id, payload);
        navigate('/');
      } else {
        await onAdd(payload);
        setForm(EMPTY);
      }
    } catch {
      setError('Failed to save — check your connection and try again.');
    }
  }

  async function handleDelete(postId) {
    if (window.confirm('Delete this post? This cannot be undone.')) {
      try {
        await onDelete(postId);
      } catch {
        alert('Failed to delete post.');
      }
    }
  }

  /* ── Import a .md / .txt file into the textarea ── */
  function handleMdImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      set('content', evt.target.result);
      // Auto-fill title from filename if field is empty
      if (!form.title.trim()) {
        const name = file.name.replace(/\.(md|txt)$/i, '').replace(/[-_]/g, ' ');
        set('title', name.charAt(0).toUpperCase() + name.slice(1));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  /* ── Export all posts as a JSON backup file ── */
  function handleExport() {
    const data = JSON.stringify(posts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `journal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ── Restore posts from a JSON backup file ── */
  function handleJsonImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (!Array.isArray(data)) throw new Error('Not an array');
        if (window.confirm(`Import ${data.length} posts? This will add them to the database.`)) {
          for (const post of data) {
            await onAdd({
              id: post.id,
              title: post.title,
              content: post.content,
              category: post.category,
              tags: post.tags || [],
              type: post.type || 'journal',
              expectedFinish: post.expectedFinish || null,
              createdAt: post.createdAt || null,
              pinned: post.pinned || false,
              inProgress: post.inProgress || false,
            });
          }
          alert(`Imported ${data.length} posts.`);
        }
      } catch {
        alert('Import failed — check the file format and try again.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  /* ── Ctrl/Cmd + Enter to publish ── */
  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSubmit(e);
  }

  const wc       = wordCount(form.content);
  const readMins = Math.max(1, Math.ceil(wc / 200));

  return (
    <div className="admin-layout">

      {/* ── Left: form ── */}
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
              placeholder={form.type === 'analysis' ? 'e.g. BP plc — Buy | Target: 650p' : 'What did you work on?'}
            />
          </label>

          <label>
            Category
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>


          {/* ── Entry type toggle ── */}
          <div className="type-toggle-row">
            <span className="type-toggle-label">Entry Type</span>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${form.type === 'journal' ? 'active' : ''}`}
                onClick={() => set('type', 'journal')}
              >
                📓 Journal
              </button>
              <button
                type="button"
                className={`type-btn ${form.type === 'analysis' ? 'active analysis' : ''}`}
                onClick={() => set('type', 'analysis')}
              >
                📊 Analysis
              </button>
            </div>
          </div>

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
            Expected finish <span className="field-hint">(optional — shows in Working On section)</span>
            <input
              type="date"
              value={form.expectedFinish}
              onChange={(e) => set('expectedFinish', e.target.value)}
            />
          </label>

          {/* Content row with file-import button */}
          <div className="content-label-row">
            <span className="content-label-text">
              Content <span className="field-hint">(Markdown · Ctrl+Enter to save)</span>
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => mdImportRef.current?.click()}
              title="Import a .md or .txt file as content"
            >
              ↑ Import file
            </button>
            <input
              ref={mdImportRef}
              type="file"
              accept=".md,.txt"
              style={{ display: 'none' }}
              onChange={handleMdImport}
            />
          </div>

          <textarea
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              form.type === 'analysis'
                ? '## Investment Thesis\n\n## Key Financials\n\n## Valuation\n\n## Risks\n\n## Catalysts'
                : 'Describe what you learnt, what you built, key takeaways…'
            }
            rows={16}
          />

          {wc > 0 && (
            <p className="word-count-hint">{wc.toLocaleString()} words · ~{readMins} min read</p>
          )}

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Publish Entry'}
            </button>
            <Link to="/" className="btn btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>

      {/* ── Right: post list + backup controls ── */}
      <div className="admin-list-col">
        <div className="admin-list-header">
          <div className="admin-list-title-row">
            <h2>All Entries</h2>
          </div>
          <div className="admin-backup-btns">
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleExport}
              title="Download all posts as a JSON backup"
            >
              ↓ Backup
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => jsonImportRef.current?.click()}
              title="Restore posts from a JSON backup"
            >
              ↑ Restore
            </button>
            <input
              ref={jsonImportRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleJsonImport}
            />
          </div>
        </div>

        {posts.length === 0 && <p className="empty-msg">No entries yet.</p>}

        <ul className="admin-post-list">
          {posts.map((post) => (
            <li key={post.id} className="admin-post-item">
              <div className="admin-post-main">
                <Link to={`/admin/edit/${post.id}`} className="admin-post-title">{post.title}</Link>
                <div className="admin-post-meta">
                  <span className="admin-post-category">{post.category}</span>
                  {post.type === 'analysis' && <span className="admin-post-type-badge">Analysis</span>}
                  {post.pinned      && <span className="admin-post-status-badge pinned">Pinned</span>}
                  {post.inProgress  && <span className="admin-post-status-badge wip">In Progress</span>}
                </div>
              </div>
              <div className="admin-post-actions">
                <button
                  className={`admin-post-pin ${post.pinned ? 'pinned' : ''}`}
                  onClick={() => onTogglePin(post.id)}
                  title={post.pinned ? 'Unpin' : 'Pin to Featured Work'}
                >
                  {post.pinned ? '★' : '☆'}
                </button>
                <button
                  className={`admin-post-wip ${post.inProgress ? 'active' : ''}`}
                  onClick={() => onToggleInProgress(post.id)}
                  title={post.inProgress ? 'Mark as complete' : 'Mark as in progress'}
                >
                  ⚡
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
