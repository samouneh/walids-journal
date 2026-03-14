import { useState, useCallback } from 'react';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  togglePin as togglePinStorage,
  toggleInProgress as toggleInProgressStorage,
} from '../utils/storage';

export function usePosts() {
  const [posts, setPosts] = useState(() => getPosts());

  const refresh          = useCallback(() => setPosts(getPosts()), []);
  const addPost          = useCallback((fields) => setPosts(createPost(fields)), []);
  const editPost         = useCallback((id, fields) => setPosts(updatePost(id, fields)), []);
  const removePost       = useCallback((id) => setPosts(deletePost(id)), []);
  const togglePin        = useCallback((id) => setPosts(togglePinStorage(id)), []);
  const toggleInProgress = useCallback((id) => setPosts(toggleInProgressStorage(id)), []);

  return { posts, refresh, addPost, editPost, removePost, togglePin, toggleInProgress };
}
