import { useState, useCallback, useEffect } from 'react';
import * as api from '../utils/api';

const CACHE_KEY = 'finance_blog_posts';

function getCached() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'); }
  catch { return []; }
}

function setCache(posts) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(posts)); } catch {}
}

export function usePosts() {
  const [posts, setPosts]     = useState(getCached);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.fetchPosts();
      setPosts(data);
      setCache(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addPost = useCallback(async (fields) => {
    const created = await api.createPost(fields);
    setPosts(prev => {
      const next = [created, ...prev];
      setCache(next);
      return next;
    });
    return created;
  }, []);

  const editPost = useCallback(async (id, fields) => {
    const updated = await api.updatePost(id, fields);
    setPosts(prev => {
      const next = prev.map(p => p.id === id ? updated : p);
      setCache(next);
      return next;
    });
  }, []);

  const removePost = useCallback(async (id) => {
    await api.deletePost(id);
    setPosts(prev => {
      const next = prev.filter(p => p.id !== id);
      setCache(next);
      return next;
    });
  }, []);

  const togglePin = useCallback(async (id) => {
    const updated = await api.togglePin(id);
    setPosts(prev => {
      const next = prev.map(p => p.id === id ? updated : p);
      setCache(next);
      return next;
    });
  }, []);

  const toggleInProgress = useCallback(async (id) => {
    const updated = await api.toggleInProgress(id);
    setPosts(prev => {
      const next = prev.map(p => p.id === id ? updated : p);
      setCache(next);
      return next;
    });
  }, []);

  return { posts, loading, error, refresh, addPost, editPost, removePost, togglePin, toggleInProgress };
}
