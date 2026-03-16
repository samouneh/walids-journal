const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function authHeaders() {
  const token = sessionStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchPosts() {
  const resp = await fetch(`${API_URL}/posts`);
  if (!resp.ok) throw new Error(`Failed to fetch posts: ${resp.status}`);
  return resp.json();
}

export async function fetchPost(id) {
  const resp = await fetch(`${API_URL}/posts/${id}`);
  if (!resp.ok) throw new Error(`Failed to fetch post: ${resp.status}`);
  return resp.json();
}

export async function createPost(data) {
  const resp = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error(`Failed to create post: ${resp.status}`);
  return resp.json();
}

export async function updatePost(id, data) {
  const resp = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error(`Failed to update post: ${resp.status}`);
  return resp.json();
}

export async function deletePost(id) {
  const resp = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!resp.ok) throw new Error(`Failed to delete post: ${resp.status}`);
}

export async function togglePin(id) {
  const resp = await fetch(`${API_URL}/posts/${id}/pin`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  if (!resp.ok) throw new Error(`Failed to toggle pin: ${resp.status}`);
  return resp.json();
}

export async function toggleInProgress(id) {
  const resp = await fetch(`${API_URL}/posts/${id}/in-progress`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  if (!resp.ok) throw new Error(`Failed to toggle in-progress: ${resp.status}`);
  return resp.json();
}
