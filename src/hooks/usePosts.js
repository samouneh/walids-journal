import { useState, useCallback } from 'react';
import { getPosts, createPost, updatePost, deletePost, togglePin as togglePinStorage } from '../utils/storage';

export function usePosts() {
  const [posts, setPosts] = useState(() => getPosts());

  const refresh = useCallback(() => setPosts(getPosts()), []);

  const addPost = useCallback((fields) => {
    createPost(fields);
    setPosts(getPosts());
  }, []);

  const editPost = useCallback((id, fields) => {
    updatePost(id, fields);
    setPosts(getPosts());
  }, []);

  const removePost = useCallback((id) => {
    deletePost(id);
    setPosts(getPosts());
  }, []);

  const togglePin = useCallback((id) => {
    togglePinStorage(id);
    setPosts(getPosts());
  }, []);

  return { posts, refresh, addPost, editPost, removePost, togglePin };
}
