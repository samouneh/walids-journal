const STORAGE_KEY   = 'finance_blog_posts';
const BACKUP_KEY    = 'finance_blog_posts_bak';
const BACKUP_TS_KEY = 'finance_blog_posts_bak_ts';

export function getPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const posts = raw ? JSON.parse(raw) : [];
    if (posts.length > 0) return posts;
    // Auto-restore from backup if main key is empty
    const bak = localStorage.getItem(BACKUP_KEY);
    if (bak) {
      const restored = JSON.parse(bak);
      if (restored.length > 0) {
        localStorage.setItem(STORAGE_KEY, bak);
        return restored;
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  // Keep a rolling backup + timestamp
  localStorage.setItem(BACKUP_KEY,    JSON.stringify(posts));
  localStorage.setItem(BACKUP_TS_KEY, new Date().toISOString());
}

export function getBackupTimestamp() {
  return localStorage.getItem(BACKUP_TS_KEY);
}

export function createPost({ title, content, category, tags, type, expectedFinish }) {
  const posts = getPosts();
  const post = {
    id: crypto.randomUUID(),
    title,
    content,
    category,
    tags: tags || [],
    type: type || 'journal',
    expectedFinish: expectedFinish || null,
    createdAt: new Date().toISOString(),
  };
  const next = [post, ...posts];
  savePosts(next);
  return next;
}

export function updatePost(id, fields) {
  const posts = getPosts();
  const next = posts.map((p) => (p.id === id ? { ...p, ...fields, updatedAt: new Date().toISOString() } : p));
  savePosts(next);
  return next;
}

export function deletePost(id) {
  const next = getPosts().filter((p) => p.id !== id);
  savePosts(next);
  return next;
}

export function togglePin(id) {
  const next = getPosts().map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p));
  savePosts(next);
  return next;
}

/* ── One-time category rename migration ── */
const CAT_MAP = {
  'Financial Analysis':  'Markets & Investing',
  'Excel & Spreadsheets':'Financial Modelling',
  'Reading':             'Reading & Research',
  'Project':             'Projects & Analysis',
  'Other':               'Industry Notes',
};

const MIGRATION_KEY = 'fblog_migrated_v1';
export function migrateCategories() {
  if (localStorage.getItem(MIGRATION_KEY)) return; // already done
  const posts = getPosts();
  const migrated = posts.map((p) =>
    CAT_MAP[p.category] ? { ...p, category: CAT_MAP[p.category] } : p
  );
  if (migrated.some((p, i) => p.category !== posts[i].category)) {
    savePosts(migrated);
  }
  localStorage.setItem(MIGRATION_KEY, '1');
}

export function toggleInProgress(id) {
  const next = getPosts().map((p) => (p.id === id ? { ...p, inProgress: !p.inProgress } : p));
  savePosts(next);
  return next;
}
