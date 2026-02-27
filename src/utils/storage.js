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

export function createPost({ title, content, category, tags }) {
  const posts = getPosts();
  const post = {
    id: crypto.randomUUID(),
    title,
    content,
    category,
    tags: tags || [],
    createdAt: new Date().toISOString(),
  };
  savePosts([post, ...posts]);
  return post;
}

export function updatePost(id, fields) {
  const posts = getPosts();
  const updated = posts.map((p) => (p.id === id ? { ...p, ...fields, updatedAt: new Date().toISOString() } : p));
  savePosts(updated);
}

export function deletePost(id) {
  const posts = getPosts().filter((p) => p.id !== id);
  savePosts(posts);
}

export function togglePin(id) {
  const posts = getPosts();
  savePosts(posts.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)));
}
