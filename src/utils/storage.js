const STORAGE_KEY = 'finance_blog_posts';

export function getPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function createPost({ title, content, category, tags, type }) {
  const posts = getPosts();
  const post = {
    id: crypto.randomUUID(),
    title,
    content,
    category,
    tags: tags || [],
    type: type || 'journal',
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
