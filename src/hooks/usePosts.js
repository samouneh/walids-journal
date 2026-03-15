import { useState, useCallback } from 'react';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  togglePin as togglePinStorage,
  toggleInProgress as toggleInProgressStorage,
} from '../utils/storage';

const API_URL      = import.meta.env.VITE_API_URL      || 'http://localhost:8000';
const INGEST_SECRET = import.meta.env.VITE_INGEST_SECRET || '';

async function syncPost(post) {
  if (!INGEST_SECRET) return;
  try {
    await fetch(`${API_URL}/ingest-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Ingest-Secret': INGEST_SECRET },
      body: JSON.stringify({ id: post.id, title: post.title, content: post.content, category: post.category, tags: post.tags }),
    });
  } catch { /* silent — don't break the UI */ }
}

async function unsyncPost(postId) {
  if (!INGEST_SECRET) return;
  try {
    await fetch(`${API_URL}/ingest-post/${postId}`, {
      method: 'DELETE',
      headers: { 'X-Ingest-Secret': INGEST_SECRET },
    });
  } catch { /* silent */ }
}

export function usePosts() {
  const [posts, setPosts] = useState(() => getPosts());

  const refresh = useCallback(() => setPosts(getPosts()), []);

  const addPost = useCallback((fields) => {
    const next = createPost(fields);
    setPosts(next);
    syncPost(next[0]); // newest post is always first
  }, []);

  const editPost = useCallback((id, fields) => {
    const next = updatePost(id, fields);
    setPosts(next);
    syncPost(next.find(p => p.id === id));
  }, []);

  const removePost = useCallback((id) => {
    setPosts(deletePost(id));
    unsyncPost(id);
  }, []);

  const togglePin        = useCallback((id) => setPosts(togglePinStorage(id)), []);
  const toggleInProgress = useCallback((id) => setPosts(toggleInProgressStorage(id)), []);

  return { posts, refresh, addPost, editPost, removePost, togglePin, toggleInProgress };
}
